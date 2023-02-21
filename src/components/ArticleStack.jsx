import React, { useLayoutEffect, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import Article from "./Article";
import { articleVariantsFactory } from "../utilities/articleStackUtilities";
import { useWindowSize } from "react-use";
import { dodge, dodgem } from "../utilities/articleDogeUtilities";
import { timeParse, timeParse2, timeParse3 } from "../utilities/util";
import {
  ARTICALSTACK_TOP_PADDING,
  ARTICALSTACK_INNER_PADDING,
  NODEWIDTH,
  METROLINE_WIDTH,
} from "../utilities/util";
import _ from "lodash";

export default function ArticleStack({
  data,
  articles,
  colour,
  onClick,
  clicked,
  clickedArticleContainerHeight,
  zoomedInArticleWidth,
  zoomedInArticleHeight,
  articleWidth,
  articleHeight,
  articleLimit,
  onAnimationComplete,
  mapId,
}) {
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  // console.log(data);

  const articlesInitialHeight = _.range(articles.length).map(
    () => zoomedInArticleHeight
  );

  const [articlesHeight, setArticlesHeight] = useState(articlesInitialHeight);
  const [articlesClicked, setArticlesClicked] = useState(
    _.range(articles.length).map(() => false)
  );

  const [mostRecentClickedArticle, setMostRecentClickedArticle] =
    useState(null);

  const handleArticleClick = (id, articleIndex) => () => {
    setMostRecentClickedArticle({ id, articleIndex });
    setArticlesClicked((previousArticlesClicked) =>
      previousArticlesClicked.map((value, index) =>
        index === articleIndex ? !value : value
      )
    );
  };

  useLayoutEffect(() => {
    if (mostRecentClickedArticle) {
      const { id, articleIndex } = mostRecentClickedArticle;
      const { height } = document.getElementById(id).getBoundingClientRect();
      setArticlesHeight((previousArticlesHeight) => {
        return previousArticlesHeight.map((articleHeight, index) =>
          index === articleIndex
            ? height < zoomedInArticleHeight
              ? zoomedInArticleHeight
              : height + ARTICALSTACK_INNER_PADDING
            : articleHeight
        );
      });
    }
  }, [mostRecentClickedArticle, zoomedInArticleHeight]);

  // Parse date strings to date objects
  // -----------------------------------
  // GET X VALUES AND Y VALUES BASED ON DATE

  const datesParsed = articles.map((obj) => {
    return (
      timeParse(obj.timestamp) ||
      timeParse2(obj.timestamp) ||
      timeParse3(obj.timestamp)
    );
  });
  // Get min and max dates
  const minDate = d3.min(datesParsed);
  const maxDate = d3.max(datesParsed);

  // Create linear scale mapping dates to a range of 0 to 1
  const scale = d3.scaleTime().domain([minDate, maxDate]).range([0, 1]);

  // Map each date to a value between 0 and 1
  const X = datesParsed.map((d) => scale(d) * articleWidth);

  const Y = dodgem(X, NODEWIDTH);

  // add value into articles
  articles.forEach((article, index) => {
    article.x_value = X[index];
    article.y_value = Y[index];
    // article.y_value = 0;
  });

  const [showDoge, setShowDoge] = useState(false);

  // console.log(articles);

  // -----------------------------------

  return (
    <motion.div
      className={`${
        clicked
          ? `absolute top-0 left-0 w-full h-full overflow-y-scroll ${
              articles.length > articleLimit ? "scrollbar" : "scrollbar-none"
            }`
          : "absolute z-50"
      }`}
      style={{
        maxHeight: clicked ? clickedArticleContainerHeight : "100%",
        backgroundColor: clicked ? "" : "#d1cfbf",
      }}
      animate={{
        x: clicked ? screenWidth / 2 - zoomedInArticleWidth / 2 : 0,
        y: clicked ? ARTICALSTACK_TOP_PADDING : 0,
        width: zoomedInArticleWidth + ARTICALSTACK_INNER_PADDING * 2,
      }}
    >
      {/* article stack panel */}
      <motion.div
        className="absolute rounded-full "
        style={{
          backgroundColor: clicked ? null : "#9d9b8e",
        }}
        animate={{
          x: clicked ? 0 : 0,
          y: clicked ? 0 : articleHeight + METROLINE_WIDTH / 2,
          width: articleWidth + NODEWIDTH,
          height: METROLINE_WIDTH,
        }}
        onMouseEnter={() => setShowDoge(true)}
        onMouseLeave={() => setShowDoge(false)}
      ></motion.div>

      {
        // reversing an array of objects: https://stackoverflow.com/questions/51479338/reverse-array-of-objects-gives-same-output-2
        []
          .concat(articles)
          .reverse()
          .map((article, articleIndex, array) => {
            const clickedArticleYPosition = articlesHeight
              // the first article (in reverse order) = articles.length - 0 - 1 = articles.lenght - 1 (get all articles)
              .slice(0, articles.length - articleIndex - 1)
              .reduce((total, articleHeight) => {
                return total + ARTICALSTACK_INNER_PADDING + articleHeight;
              }, 0);

            // do not use articleIndex here, instead use articles.length - articleIndex - 1 cause the articles are reversed
            const zoomedArticleHeight = articlesHeight.find(
              (_, index) => index === articles.length - articleIndex - 1
            );

            return (
              <motion.div
                key={article.id}
                className={`article-${data.id} alerts-border absolute rounded-md overflow-hidden cursor-zoom-in `}
                style={{
                  border: data.isChanged ? null : "2px solid white", //###
                  backgroundColor: clicked ? "white" : "#d1cfbf",
                  borderRadius: clicked ? "6px" : "15px",
                  // (array.length - articleIndex) % 2 === 0
                  // ? "white"
                  // : colour,
                }}
                variants={articleVariantsFactory(
                  array.length,
                  articleIndex,
                  screenWidth,
                  screenHeight,
                  articleWidth,
                  articleHeight,
                  zoomedInArticleWidth,
                  zoomedArticleHeight,
                  clickedArticleYPosition,
                  article.timestamp,
                  article.x_value,
                  showDoge ? article.y_value : 0
                )}
                animate={clicked ? "clicked" : "default"}
                onAnimationComplete={() => {
                  if (articleIndex === array.length - 1) {
                    onAnimationComplete();
                  }
                }}
                whileHover={clicked ? {} : { scale: 1.5 }}
                onMouseEnter={() => setShowDoge(true)}
                onMouseLeave={() => setShowDoge(false)}
              >
                <Article
                  article={article}
                  metroStopClicked={clicked}
                  onClick={handleArticleClick(
                    `${mapId}-${article.id}`,
                    articles.length - articleIndex - 1
                  )}
                  clicked={articlesClicked[articles.length - articleIndex - 1]}
                  id={`${mapId}-${article.id}`}
                />

                {/* helper onClick layer */}
                {!clicked && (
                  <motion.div
                    className="helper absolute w-full h-full"
                    onClick={onClick}
                  />
                )}
              </motion.div>
            );
          })
      }
    </motion.div>
  );
}

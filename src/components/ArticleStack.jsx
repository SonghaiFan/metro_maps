import React, { useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Article from "./Article";
import { articleVariantsFactory } from "../utilities/articleStackUtilities";
import { useWindowSize } from "react-use";
import {
  ARTICALSTACK_TOP_PADDING,
  ARTICALSTACK_INNER_PADDING,
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

  return (
    <motion.div
      className={`${
        clicked
          ? `absolute top-0 left-0 w-full h-full overflow-y-scroll ${
              articles.length > articleLimit ? "scrollbar" : "scrollbar-none"
            }`
          : ""
      }`}
      style={{
        maxHeight: clicked ? clickedArticleContainerHeight : "100%",
      }}
      animate={{
        x: clicked ? screenWidth / 1.8 - zoomedInArticleWidth / 2 : 0,
        y: clicked ? ARTICALSTACK_TOP_PADDING : 0,
        width: zoomedInArticleWidth + ARTICALSTACK_INNER_PADDING * 2,
      }}
    >
      {
        // loadash reverse the articles
        _.reverse(articles).map((article, articleIndex, array) => {
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
              className={`article-${data.id} alerts-border absolute rounded-md overflow-hidden`}
              style={{
                border: data.isChanged ? "2px solid white" : null,
                backgroundColor: clicked
                  ? "white"
                  : (array.length - articleIndex) % 2 === 0
                  ? "white"
                  : "#d1cfbf",
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
                clickedArticleYPosition
              )}
              animate={clicked ? "clicked" : "default"}
              onAnimationComplete={() => {
                if (articleIndex === array.length - 1) {
                  onAnimationComplete();
                }
              }}
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

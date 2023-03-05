import React, { useLayoutEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import Article from "./Article";
import { articleVariantsFactory } from "../utilities/articleStackUtilities";
import { useWindowSize } from "react-use";
import { dodgem } from "../utilities/articleDogeUtilities";
import { timeParse, timeParse2, timeParse3 } from "../utilities/util";
import {
  ARTICALSTACK_TOP_PADDING,
  ARTICALSTACK_INNER_PADDING,
  NODEWIDTH,
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
  focusArticleID,
  setFocusArticleID,
  onZoomOutClick,
}) {
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  // console.log(data);

  const [shownArticles, setShownArticles] = useState(articles);

  //use effect when not clicked, set shown articles to articles

  const [articlesState, setArticlesState] = useState(
    articles.map((article) => ({
      id: `${mapId}-${article.id}`,
      height: zoomedInArticleHeight,
      clicked: false,
      data: article,
    }))
  );

  // write a function that takes data and generate a fake Article component, get its height, and destroy it
  const getClickedArticleHeight = (state) => {
    console.log(state);
    const div = document.createElement("div");
    div.style.width = `${zoomedInArticleWidth}px`;
    div.innerText = state.data.full_text;
    document.body.appendChild(div);
    const height = div.clientHeight;
    document.body.removeChild(div);
    return height + ARTICALSTACK_TOP_PADDING * 2 + ARTICALSTACK_INNER_PADDING;
  };

  const handleArticleShowMoreOrLessClick = (id) => () => {
    setArticlesState((prev) =>
      prev.map((state) =>
        state.id === id
          ? {
              ...state,
              clicked: !state.clicked,
              height: !state.clicked
                ? getClickedArticleHeight(state)
                : zoomedInArticleHeight,
            }
          : state
      )
    );
  };

  useLayoutEffect(() => {
    if (!clicked) {
      setShownArticles(articles);
      // set all articles to not clicked
      setArticlesState((prev) =>
        prev.map((state) => ({
          ...state,
          clicked: false,
          height: zoomedInArticleHeight,
        }))
      );
    }

    // if shownarticles only has one article, set clicked to true
    if (shownArticles.length === 1) {
      setArticlesState((prev) =>
        prev.map((state) =>
          state.id === `${mapId}-${shownArticles[0].id}`
            ? {
                ...state,
                clicked: true,
                height: getClickedArticleHeight(state),
              }
            : state
        )
      );
    }
    // This is to make show less button work when there is only one article
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked]);

  // Parse date strings to date objects
  // -----------------------------------
  // GET X VALUES AND Y VALUES BASED ON DATE

  const datesParsed = shownArticles.map((obj) => {
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
  shownArticles.forEach((article, index) => {
    article.x_value = X[index];
    article.y_value = Y[index];
    // article.y_value = 0;
  });

  // const [showDoge, setShowDoge] = useState(true);

  // console.log(articles);

  // -----------------------------------

  return (
    <motion.div
      datatype="article_stack"
      className={`absolute z-10 ${
        clicked
          ? ` top-0 left-0 w-full h-full overflow-y-scroll  scrollbar`
          : " z-50"
      }`}
      style={{
        maxHeight: clicked ? clickedArticleContainerHeight : "100%",
        backgroundColor: clicked ? "" : "#d1cfbf",
      }}
      animate={{
        x: clicked ? screenWidth / 1.8 - zoomedInArticleWidth / 2 : 0,
        y: clicked ? ARTICALSTACK_TOP_PADDING : 0,
        width: zoomedInArticleWidth + ARTICALSTACK_INNER_PADDING * 2,
      }}
      onClick={(event) => {
        setFocusArticleID(null);
        if (
          clicked &&
          event.target.getAttribute("datatype") === "article_stack"
        ) {
          onZoomOutClick();
        }
      }}
    >
      {_.reverse(shownArticles).map((article, articleIndex, array) => {
        // Calculate the y position of the article that was clicked
        // by summing the heights of all the articles in the stack
        // above it.
        // loadash shallow copy articlesState

        const clickedArticleYPosition = articlesState
          .slice(0, shownArticles.length - articleIndex - 1)
          .reduce((total, { id }) => {
            const state = articlesState.find((state) => state.id === id);
            return total + ARTICALSTACK_INNER_PADDING + state.height;
          }, 0);

        // Get the height of the article that is currently being displayed.
        const zoomedArticleHeight = articlesState.find(
          (state) => state.id === `${mapId}-${article.id}`
        ).height;

        return (
          <motion.div
            key={article.id}
            data-title={article.title}
            className={`article-${data.id} alerts-border absolute rounded-md overflow-hidden `}
            style={{
              border: data.isChanged ? "2px solid white" : null, //###
              backgroundColor: clicked ? "white" : "#d1cfbf",
              borderRadius: clicked ? "6px" : "15px",
              cursor: clicked ? "default" : "zoom-in",
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
              article.y_value
            )}
            animate={clicked ? "clicked" : "default"}
            onAnimationComplete={() => {
              if (articleIndex === array.length - 1) {
                onAnimationComplete();
              }
            }}
            whileHover={clicked ? { scale: 1 } : { scale: 1.5 }}
            onMouseEnter={() => {
              setFocusArticleID(article.id);
            }}
            onMouseLeave={() => {
              setFocusArticleID(null);
            }}
            onClick={() => {
              setFocusArticleID(article.id);
              // set shown articles to only the clicked article
              clicked || setShownArticles([article]);

              // fake open zoomed in article
              onClick();
            }}
          >
            <Article
              id={`${mapId}-${article.id}`}
              article={article}
              metroStopClicked={clicked}
              onClick={handleArticleShowMoreOrLessClick(
                `${mapId}-${article.id}`
              )}
              clicked={
                articlesState.find(
                  (state) => state.id === `${mapId}-${article.id}`
                ).clicked
              }
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

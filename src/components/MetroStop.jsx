import React, { useState } from "react";
import { motion } from "framer-motion";
import ArticleStack from "./ArticleStack";
import { nodeWordsVariantsFactory } from "../utilities/metroStopUtilities";
import { useWindowSize } from "react-use";
import {
  ARTICALSTACK_INNER_PADDING,
  ARTICLE_SIZE_MULTIPLIER,
  NODEWIDTH,
  METROLINE_WIDTH,
} from "../utilities/util";

import Tooltip from "./Tooltip";

export default function MetroStop({
  data,
  shouldRenderContent,
  isMapFocused,
  height,
  width,
  articles,
  onClick,
  clicked,
  onNeighbouringNodeClick,
  onArticleStackAnimationComplete,
  onNeighbourNodeLabelClick,
  onNodeNumberLabelClick,
  onNodeWordsLabelClick,
  onZoomOutClick,
  mapId,
}) {
  // console.log("🚀 ~ file: MetroStop.jsx:32 ~ articles:", articles);
  // console.log("From MetroStop", data);
  // const label = data.node_words;
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  // const content = label.length > 0 ? label[0].replace(/ /g, "_") : "";

  // const moreContent = Array.isArray(label)
  //   ? label
  //       .slice(0, 5)
  //       .map((x) => x.replace(/ /g, "_"))
  //       .join(", ")
  //   : label;

  const ARTICLE_HEIGHT = (screenHeight / 18) * ARTICLE_SIZE_MULTIPLIER;
  const ARTICLE_WIDTH = (screenWidth / 13) * ARTICLE_SIZE_MULTIPLIER;
  const ZOOMED_IN_ARTICLE_HEIGHT =
    (3 * ARTICLE_HEIGHT) / ARTICLE_SIZE_MULTIPLIER;
  const ZOOMED_IN_ARTICLE_WIDTH = (8 * ARTICLE_WIDTH) / ARTICLE_SIZE_MULTIPLIER;
  const ARTICLE_LIMIT = 4.5;
  const CLICKED_ARTICLE_CONTAINER_HEIGHT =
    ZOOMED_IN_ARTICLE_HEIGHT * ARTICLE_LIMIT +
    ARTICALSTACK_INNER_PADDING * (ARTICLE_LIMIT - 1);

  const [focusArticleID, setFocusArticleID] = useState(null);

  function getTitle() {
    const article = articles.find((article) => article.id === focusArticleID);
    return article ? article.timestamp + ": " + article.title : null;
  }

  function getKeywords() {
    const article = articles.find((article) => article.id === focusArticleID);
    return article ? article.keywords.join(", ") : "";
  }

  const title = getTitle();

  const keywords = getKeywords();
  // console log what is the typeof keywords?
  // console.log("🚀 ~ file: MetroStop.jsx:32 ~ keywords:", keywords);

  const content = keywords;
  const moreContent = keywords;

  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {isMapFocused && (
        <Tooltip text={title} clicked={clicked}>
          <ArticleStack
            data={data}
            articles={articles}
            colour={data.colour}
            onClick={onClick}
            clicked={clicked}
            clickedArticleContainerHeight={CLICKED_ARTICLE_CONTAINER_HEIGHT}
            zoomedInArticleWidth={ZOOMED_IN_ARTICLE_WIDTH}
            zoomedInArticleHeight={ZOOMED_IN_ARTICLE_HEIGHT}
            articleWidth={ARTICLE_WIDTH}
            articleHeight={ARTICLE_HEIGHT}
            articleLimit={ARTICLE_LIMIT}
            onAnimationComplete={onArticleStackAnimationComplete}
            mapId={mapId}
            focusArticleID={focusArticleID}
            setFocusArticleID={setFocusArticleID}
            onZoomOutClick={onZoomOutClick}
          />
          {/* {!clicked && (
            <motion.div
              className={
                "absolute text-white text-sm m-1 line-clamp-3 font-bold rounded-md px-2 bg-neutral-900 opacity-50 filter drop-shadow-md"
              }
              onClick={onClick}
            >
              {data.headline}
            </motion.div>
          )} */}
        </Tooltip>
      )}

      <motion.div
        data-type="modal"
        style={{
          backgroundColor: isMapFocused
            ? clicked
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(0, 0, 0, 0)"
            : data.colour, //"white"
        }}
        className={`w-fll h-full text-black flex justify-center -z-40 ${
          clicked || isMapFocused ? "truncate " : "items-center"
        } rounded-md`}
        onClick={(event) => {
          event.target.dataset.type === "modal" && onZoomOutClick();
        }}
      >
        {/* node number label */}
        {/* article stack panel */}
        <motion.div
          data-type="node-number-label"
          id={data.id}
          className="article--stack--panel absolute rounded-full "
          style={{
            backgroundColor: clicked ? null : "#9d9b8e",
            // outline: clicked
            //   ? null
            //   : data.isChanged
            //   ? "2px solid white"
            //   : "2px solid #9d9b8e",
          }}
          animate={{
            x: clicked ? 0 : NODEWIDTH / 2,
            y: clicked ? 0 : ARTICLE_HEIGHT + METROLINE_WIDTH / 2,
            width: ARTICLE_WIDTH + METROLINE_WIDTH / 2,
            height: METROLINE_WIDTH,
          }}
          onClick={(event) =>
            isMapFocused ? onNodeWordsLabelClick(event.target) : undefined
          }
        ></motion.div>

        {/* node words label */}
        {shouldRenderContent && (
          <motion.div
            data-type="node-words-label"
            id={data.id}
            variants={nodeWordsVariantsFactory(
              isMapFocused,
              height,
              screenHeight,
              CLICKED_ARTICLE_CONTAINER_HEIGHT,
              showMore,
              content,
              moreContent
            )}
            style={{
              backgroundColor: "#acab9f", // "white", // data.colour,
              border: data.isChanged ? "2px solid white" : null, //####
            }}
            className={`node-${
              data.id
            } alerts-border  text-black cursor-pointer overflow-hidden  ${
              isMapFocused
                ? `absolute rounded-md px-2 ${clicked ? "text-4xl" : "text-sm"}`
                : ""
            }`}
            initial="default"
            animate={clicked ? "clicked" : "default"}
            onClick={(event) =>
              isMapFocused ? onNodeWordsLabelClick(event.target) : undefined
            }
            onMouseEnter={() => setShowMore(true)}
            onMouseLeave={() => setShowMore(false)}
          >
            {showMore ? moreContent : content}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

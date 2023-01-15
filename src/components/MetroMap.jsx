import React, { useState, useMemo, useEffect, useRef } from "react";
import { calculateMetroMapLayout } from "../utilities/calculateMetroMapLayout";
import MetroStop from "./MetroStop";
import {
  margin,
  TOP_FULL_PAGE_PADDING,
  METROLINE_ANIMATION_DURATION,
} from "../utilities/util";
import { motion } from "framer-motion";
import { metroStopVariantsFactory } from "../utilities/metroStopUtilities";
import { generatePaths } from "../utilities/metroMapUtilities";
import NavigationButton from "./NavigationButton";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import MetroMapDescription from "./MetroMapDescription";
import MetroLine from "./MetroLine";
import MetroLineLabel from "./MetroLineLabel";
import TimeAxis from "./TimeAxis";
import { SideDrawer } from "./SideDrawer";
import mixpanel from "mixpanel-browser";

export default function MetroMap({
  width,
  height,
  data,
  title,
  onFocusButtonClick,
  isMapFocused,
  screenWidth,
  screenHeight,
  description,
  idx,
  updateArticleAnimationDelayRef,
  clearArticleAnimationDelayRef,
  hint,
  subtitle,
  time,
  zoomOutButtonClicked,
  mapId,
}) {
  const NODE_HEIGHT = (screenHeight / 18) * 1.25;
  const NODE_WIDTH = (screenWidth / 13) * 1.25;
  const LANDING_HEIGHT = screenHeight / 28;
  const LANDING_WIDTH = screenWidth / 23;
  const fullPageYPadding = title.startsWith("1")
    ? 0.5 * screenHeight + TOP_FULL_PAGE_PADDING
    : margin.y * screenHeight + TOP_FULL_PAGE_PADDING;
  // const fullPageYPadding = margin.y * screenHeight + TOP_FULL_PAGE_PADDING;
  const fullPageXPadding = margin.x * screenWidth;

  const paddingX = fullPageXPadding - NODE_WIDTH / 2;
  const paddingY = fullPageYPadding - NODE_HEIGHT;

  const [nodes, lines, columns] = useMemo(
    () => calculateMetroMapLayout(screenWidth, screenHeight, data, margin),
    // data and margin are not changing
    // eslint-disable-next-line react-hooks/exhaustive-deps,
    [screenWidth, screenHeight]
  );

  const [customNodes, setCustomeNodes] = useState(nodes);
  const [customLines, setCustomLines] = useState(lines);

  const addCutomNodeColor = (nodes, nodeId, newColour) => {
    const updatedNodes = Object.assign({}, nodes);
    updatedNodes[nodeId] && (updatedNodes[nodeId].colour = newColour);
    for (let eachNode in updatedNodes) {
      const conNodes = updatedNodes[eachNode].connectedNodes;

      conNodes.forEach((node) => {
        // console.log(node);
        node.id === nodeId && (node.colour = newColour);
      });
    }
    return updatedNodes;
  };

  const addCutomLineColor = (lines, pathId, newColour) => {
    const updatedLines = Object.assign({}, lines);

    const [pathStartId, pathEndId] = pathId.split("-");

    for (let lineId in updatedLines) {
      const linePathCoords = updatedLines[lineId].pathCoords;

      linePathCoords.forEach((coords) => {
        coords.source === pathStartId &&
          coords.target === pathEndId &&
          (coords.edgeColour = newColour);
      });
    }
    return updatedLines;
  };

  const handleCustomLines = (pathId, newColour) => {
    setCustomLines(addCutomLineColor(customLines, pathId, newColour));
  };

  const handleCustomNodes = (nodeId, newColour) => {
    setCustomeNodes(addCutomNodeColor(customNodes, nodeId, newColour));
  };

  const titleRef = useRef();
  const [titleAnimation, setTitleAnimation] = useState({});

  useEffect(() => {
    const titleElement = titleRef.current;
    if (titleElement.offsetWidth < titleElement.scrollWidth) {
      setTitleAnimation({
        x: [0, -5 * title.length],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 5,
            ease: "linear",
          },
        },
      });
      return;
    } else {
      setTitleAnimation({});
    }
    // disabled warning since we know title will never change after being set once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenWidth, screenHeight]);

  const metroLineData = useMemo(
    () =>
      Object.keys(customLines).map((lineId) => {
        const [paths, labels] = generatePaths(customLines[lineId]);

        const lineData = { [lineId]: { paths, labels } };

        return lineData;
      }),
    [customLines]
  );

  const [clickedNode, setClickedNode] = useState(null);
  const [clickedNodeBuffer, setClickedNodeBuffer] = useState(null);
  const [previousClickedNode, setPreviousClickedNode] = useState(null);
  const [foundLinkData, setFoundLinkData] = useState(null);

  // needed for transition animation - find out which nodes and link to draw
  useEffect(() => {
    if (previousClickedNode && clickedNodeBuffer) {
      const foundLineId = Object.keys(lines).find((lineId) => {
        return (
          lines[lineId].links.filter(
            (link) =>
              (link.source === previousClickedNode &&
                link.target === clickedNodeBuffer) ||
              (link.source === clickedNodeBuffer &&
                link.target === previousClickedNode)
          ).length > 0
        );
      });

      const { paths } = metroLineData.find(
        (line) => Object.keys(line)[0] === foundLineId
      )[foundLineId];

      const foundLinkData = paths.filter(
        ({ path }) =>
          path[path.length - 1].source === previousClickedNode &&
          path[path.length - 1].target === clickedNodeBuffer
      );

      const foundLinkDataReversed = paths.filter(
        ({ path }) =>
          path[path.length - 1].source === clickedNodeBuffer &&
          path[path.length - 1].target === previousClickedNode
      );

      setFoundLinkData({
        data:
          foundLinkDataReversed.length > 0
            ? foundLinkDataReversed
            : foundLinkData,
        reversed: foundLinkDataReversed.length > 0,
      });
    }
  }, [previousClickedNode, clickedNodeBuffer, metroLineData, lines]);

  useEffect(() => {
    if (zoomOutButtonClicked) {
      onZoomOutButtonClick();
      // console.log("zoom out button clicked")
    }
    // onZoomOutButtonClick will never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomOutButtonClicked]);

  const onArticleStackAnimationComplete = () => {
    if (clickedNodeBuffer) {
      updateArticleAnimationDelayRef(
        setTimeout(() => {
          setClickedNode(clickedNodeBuffer);
          setClickedNodeBuffer(null);
        }, METROLINE_ANIMATION_DURATION * 1000)
      );
    }
  };

  const handleMetroStopClick = (nodeId) => () => {
    // if the user clicks on next/previous neighbouring node button
    if (clickedNode) {
      mixpanel.track("MetroStopOnNeighbouringNode node clicked", {
        nodeId: nodeId,
      });
      setClickedNodeBuffer(nodeId);
      setPreviousClickedNode(clickedNode);
      setClickedNode(null);
      return;
    }

    // if the user clicks the node directly (not the neighbouring node button)
    setClickedNode(nodeId);
    mixpanel.track("MetroStop node clicked", {
      nodeId: nodeId,
    });
  };

  const onZoomOutButtonClick = () => {
    mixpanel.track("NavigationButtonMetroStop ZoomOut button clicked");
    clearArticleAnimationDelayRef();
    setClickedNodeBuffer(null);
    setClickedNode(null);
    setPreviousClickedNode(null);
  };

  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const [whoOpenSideDrawer, setWhoOpenSideDrawer] = useState();

  const openSideDrawer = (who) => {
    setWhoOpenSideDrawer(who);
    setSideDrawerOpen(true);
  };

  const closeSideDrawer = () => {
    setSideDrawerOpen(false);
  };

  return (
    <motion.div>
      <motion.div
        className={`absolute w-full h-full ${
          isMapFocused ? "cursor-default" : "cursor-zoom-in"
        }`}
        onClick={onFocusButtonClick}
      >
        {isMapFocused && (
          <motion.div
            style={{ width: screenWidth, height: screenHeight }}
            className="absolute"
          >
            <TimeAxis
              data={columns}
              nodeWidth={NODE_WIDTH}
              nodeHeight={NODE_HEIGHT}
              paddingX={paddingX}
              paddingY={paddingY}
            />
          </motion.div>
        )}

        {/* full page lines */}
        {isMapFocused && (
          <>
            <motion.svg
              className="absolute"
              x="0"
              y="0"
              width={isMapFocused ? screenWidth : width}
              height={isMapFocused ? screenHeight : height}
            >
              {metroLineData.map((data) => {
                const [lineId, { paths }] = Object.entries(data)[0];

                return (
                  <motion.g
                    animate={{
                      x:
                        paddingX +
                        (isMapFocused ? NODE_WIDTH / 2 : LANDING_WIDTH / 2),
                      y:
                        paddingY +
                        (isMapFocused ? NODE_HEIGHT : LANDING_HEIGHT / 2),
                    }}
                    key={lineId}
                  >
                    <MetroLine
                      data={paths}
                      onClickToOpenDrawer={(event) => {
                        openSideDrawer(event.target);
                      }}
                    />
                  </motion.g>
                );
              })}
            </motion.svg>

            {/* link labels */}
            <motion.div className="absolute">
              {metroLineData.map((data) => {
                // console.log("Object.entries(data)", Object.entries(data));
                // console.log("Object.entries(data)[0]", Object.entries(data)[0]);
                const [lineId, { labels }] = Object.entries(data)[0];

                return (
                  <motion.div
                    animate={{
                      x: paddingX + NODE_WIDTH / 2,
                      y: paddingY + NODE_HEIGHT,
                    }}
                    key={lineId}
                  >
                    {labels.map((label, index) => {
                      return (
                        <MetroLineLabel
                          key={`${lineId}-${index}`}
                          data={label}
                          onMetroLineLabelClick={(event) => {
                            openSideDrawer(event.target);
                          }}
                        />
                      );
                    })}
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        <motion.div>
          {Object.keys(customNodes).map((nodeId) => {
            const { x: landingX, y: landingY } = nodes[nodeId];

            const articles = customNodes[nodeId].articles.map((articleId) => {
              return data.articles[articleId];
            });

            return (
              <motion.div
                className={`metro-stop-wrapper absolute ${
                  clickedNode === nodeId ? "cursor-default" : "cursor-zoom-in"
                }`}
                variants={metroStopVariantsFactory(
                  screenWidth,
                  screenHeight,
                  isMapFocused,
                  customNodes[nodeId],
                  landingX,
                  landingY,
                  LANDING_WIDTH,
                  LANDING_HEIGHT,
                  paddingX,
                  paddingY,
                  NODE_WIDTH,
                  NODE_HEIGHT
                )}
                animate={clickedNode === nodeId ? "clicked" : "default"}
                key={nodeId}
                id={nodeId}
              >
                <MetroStop
                  data={customNodes[nodeId]}
                  articles={articles}
                  isMapFocused={isMapFocused}
                  shouldRenderContent={true}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  onClick={
                    isMapFocused ? handleMetroStopClick(nodeId) : () => {}
                  }
                  clicked={clickedNode === nodeId}
                  onNeighbouringNodeClick={(neighbourId) => {
                    return handleMetroStopClick(neighbourId);
                  }}
                  onArticleStackAnimationComplete={
                    onArticleStackAnimationComplete
                  }
                  onNeighbourNodeLabelClick={openSideDrawer}
                  onNodeNumberLabelClick={openSideDrawer}
                  onNodeWordsLabelClick={openSideDrawer}
                  mapId={mapId}
                />
              </motion.div>
            );
          })}

          {/* transition animation */}
          {previousClickedNode && clickedNodeBuffer && (
            <motion.div>
              <motion.div
                className="absolute top-0 left-0 w-screen h-screen"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
              />
              {foundLinkData && (
                <motion.svg
                  className="absolute"
                  x="0"
                  y="0"
                  width={screenWidth}
                  height={screenHeight}
                >
                  <motion.g
                    animate={{
                      x:
                        paddingX +
                        (isMapFocused ? NODE_WIDTH / 2 : LANDING_WIDTH / 2),
                      y:
                        paddingY +
                        (isMapFocused ? NODE_HEIGHT : LANDING_HEIGHT / 2),
                    }}
                  >
                    <MetroLine
                      data={foundLinkData.data}
                      reversed={foundLinkData.reversed}
                    />
                  </motion.g>
                </motion.svg>
              )}
              {[previousClickedNode, clickedNodeBuffer].map((nodeId) => {
                const { x: landingX, y: landingY } = nodes[nodeId];

                const articles = customNodes[nodeId].articles.map(
                  (articleId) => {
                    return data.articles[articleId];
                  }
                );
                console.log("articles", articles);

                return (
                  <motion.div
                    className="absolute"
                    variants={metroStopVariantsFactory(
                      screenWidth,
                      screenHeight,
                      isMapFocused,
                      customNodes[nodeId],
                      landingX,
                      landingY,
                      LANDING_WIDTH,
                      LANDING_HEIGHT,
                      paddingX,
                      paddingY,
                      NODE_WIDTH,
                      NODE_HEIGHT
                    )}
                    animate={clickedNode === nodeId ? "clicked" : "default"}
                    key={nodeId}
                  >
                    <MetroStop
                      data={customNodes[nodeId]}
                      articles={articles}
                      isMapFocused={isMapFocused}
                      shouldRenderContent={true}
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      onClick={
                        isMapFocused ? handleMetroStopClick(nodeId) : () => {}
                      }
                      clicked={clickedNode === nodeId}
                      onNeighbouringNodeClick={(neighbourId) => {
                        return handleMetroStopClick(neighbourId);
                      }}
                      onArticleStackAnimationComplete={() => {}}
                      // do not pass in onArticleStackAnimationComplete.
                      // otherwise, it will assign 2 additional setTimeout
                      // (executed after the animation for the source and target node is completed)
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* metromap title */}
          <motion.div
            className={`absolute ${
              isMapFocused
                ? "text-2xl"
                : `bg-black flex flex-col justify-start mt-10 pt-14 content-center `
            }`}
            animate={{
              x: 0, //isMapFocused ? 0 : margin.x * width,
              y: 0, //isMapFocused ? 0 : height - height * margin.y - 10,
              width: isMapFocused
                ? screenWidth //(2 * screenWidth) / 3
                : screenWidth, //width - margin.x * width,
              height: isMapFocused ? 0 : screenHeight,
            }}
          >
            {/* metromap title */}
            <motion.div
              style={{ width: isMapFocused ? width * 3 : width - 64 }}
              className=" my-6 mx-auto text-center whitespace-nowrap overflow-x-auto scrollbar-none text-sm"
            >
              <motion.h2
                animate={isMapFocused ? {} : titleAnimation}
                ref={titleRef}
              >
                {title}
              </motion.h2>
            </motion.div>
            <MetroMapDescription
              isDisplayed={!isMapFocused}
              idx={idx}
              description={description}
              subtitle={subtitle}
              hint={hint}
              height={screenHeight / 3}
              time={time}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <NavigationButton
        onClick={onZoomOutButtonClick}
        className={`right-[1%] top-[3%] z-50`}
        isVisible={clickedNode !== null || clickedNodeBuffer !== null}
      >
        <AiOutlineFullscreenExit size={40} />
      </NavigationButton>

      {/* {isMapFocused && ( */}
      <SideDrawer
        isVisible={sideDrawerOpen}
        close={closeSideDrawer}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        paddingY={paddingY}
        whoOpenSideDrawer={whoOpenSideDrawer}
        handleCustomNodes={handleCustomNodes}
        handleCustomLines={handleCustomLines}
      ></SideDrawer>
      {/* )} */}
    </motion.div>
  );
}

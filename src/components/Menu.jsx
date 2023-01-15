import React, { useReducer, useMemo, useState, useRef, useEffect } from "react";
import MetroMap from "./MetroMap";
import { loadData } from "../utilities/loadData";
import {
  ACTION_TYPES,
  FOCUS_MODE,
  metroMapContainerVariantsFactory,
} from "../utilities/menuUtilities";
import { METROMAPS_LENGTH, METROMAPS_TIME } from "../utilities/metromaps";
import { AnimatePresence, motion } from "framer-motion";
import NavigationButton from "./NavigationButton";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { METROMAPS_PER_PAGE, PAGE_DIRECTION, margin } from "../utilities/util";
import Timer from "./Timer";
import mixpanel from "mixpanel-browser";

const TOTAL_PAGES = Math.ceil(METROMAPS_LENGTH / METROMAPS_PER_PAGE);

export default function Menu({
  metromaps,
  width: screenWidth,
  height: screenHeight,
  setStart,
}) {
  const metromapsDetails = useMemo(() => {
    return metromaps.reduce((accumulatedDimensions, metromap, index) => {
      return {
        ...accumulatedDimensions,
        [metromap.url]: {
          width: screenWidth / 3,
          height: screenHeight / 3,
          xPosition: (index % METROMAPS_PER_PAGE) * (screenWidth / 3),
          yPosition: screenHeight / 5,
          /* copy data so that d3sankey does not mutate original data*/
          data: loadData(JSON.parse(JSON.stringify(metromap.data))),
          title: metromap.title,
          mapId: metromap.url,
        },
      };
    }, {});
  }, [metromaps, screenWidth, screenHeight]);

  const [pageState, setPageState] = useState({
    current: 1,
    hist: [1],
    total: TOTAL_PAGES,
    direction: PAGE_DIRECTION.RIGHT,
    time: METROMAPS_TIME[0],
  });

  const initialFocusState = {
    map: null,
    mode: null,
  };

  const reducer = (previous, { type, payload: current }) => {
    switch (type) {
      case ACTION_TYPES.FULL_MAP_VIEW:
        return current;
      case ACTION_TYPES.LANDING_PAGE_VIEW:
        return { map: previous.map, mode: null };
      default:
        return previous;
    }
  };

  const [focusState, dispatch] = useReducer(reducer, initialFocusState);

  const onFocusButtonClick = (mapId) => () => {
    dispatch({
      type: ACTION_TYPES.FULL_MAP_VIEW,
      payload: { map: mapId, mode: FOCUS_MODE.FULL_VIEW },
    });
    // console.log("focusState", focusState);
    mixpanel.track("MetroMap-onFucous button clicked", {
      map: mapId,
      mode: FOCUS_MODE.FULL_VIEW,
    });
  };

  const articleAnimationDelayRef = useRef();
  const [zoomOutButtonClicked, setZoomOutButtonClicked] = useState(false);

  useEffect(() => {
    if (focusState.mode === null) {
      setZoomOutButtonClicked(false);
    }
  }, [focusState.mode]);

  const updateArticleAnimationDelayRef = (timeoutId) => {
    // console.log("assigning");
    articleAnimationDelayRef.current = timeoutId;
  };

  const clearArticleAnimationDelayRef = () => {
    if (articleAnimationDelayRef.current) {
      // console.log("clearing");
      clearTimeout(articleAnimationDelayRef.current);
    }
  };

  const onZoomOutButtonClick = () => {
    mixpanel.track("onZoomOut-button clicked");
    setZoomOutButtonClicked(true);
    clearArticleAnimationDelayRef();
    dispatch({ type: ACTION_TYPES.LANDING_PAGE_VIEW });
  };

  const nextPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.min(oldPageState.total, oldPageState.current + 1),
      hist: oldPageState.hist.concat([oldPageState.current]),
      direction: PAGE_DIRECTION.RIGHT,
      time: METROMAPS_TIME[
        Math.min(oldPageState.total - 1, oldPageState.current)
      ],
    };
  };

  const previousPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.max(1, oldPageState.current - 1),
      hist: oldPageState.hist.concat([oldPageState.current]),
      direction: PAGE_DIRECTION.LEFT,
      time: METROMAPS_TIME[Math.max(0, oldPageState.current - 2)],
    };
  };

  const renderMetroMap = (metromap) => {
    return (
      <motion.div
        className="absolute"
        variants={metroMapContainerVariantsFactory(
          metromapsDetails,
          metromap.url,
          screenHeight,
          screenWidth,
          pageState.direction
        )}
        initial="hidden"
        animate="fullView"
        key={metromap.url}
        exit="hidden"
      >
        <MetroMap
          {...metromapsDetails[metromap.url]}
          width={metromapsDetails[metromap.url].width}
          height={metromapsDetails[metromap.url].height}
          onFocusButtonClick={onFocusButtonClick(metromap.url)}
          isMapFocused={
            // true
            focusState.map === metromap.url &&
            focusState.mode === FOCUS_MODE.FULL_VIEW
          }
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          description={metromap.description}
          subtitle={metromap.subtitle}
          idx={metromap.idx}
          hint={metromap.hint}
          time={metromap.time}
          updateArticleAnimationDelayRef={updateArticleAnimationDelayRef}
          clearArticleAnimationDelayRef={clearArticleAnimationDelayRef}
          zoomOutButtonClicked={zoomOutButtonClicked}
          mapId={metromap.url}
        />
      </motion.div>
    );
  };

  const onBackToIntroPageButtonClick = () => {
    mixpanel.track("NavigationButton-onBackToIntroPageButton clicked");
    setStart(false);
  };

  const onNavigationBtwSessionClick = (direction) => () => {
    // Fake zoomout click to exit the full view
    onZoomOutButtonClick();

    mixpanel.track("NavigationButton-onNavigationBtwSession clicked", {
      direction: direction === PAGE_DIRECTION.RIGHT ? "right" : "left",
      pageState: pageState,
    });

    if (direction === PAGE_DIRECTION.RIGHT) {
      setPageState(nextPageState(pageState));
    } else {
      setPageState(previousPageState(pageState));
    }
  };

  const timerNextPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.min(oldPageState.total, Math.max(...oldPageState.hist) + 1), // move to next page after the farthest explored page in hist
      hist: oldPageState.hist.concat([oldPageState.current]),
      direction: 1,
      time: METROMAPS_TIME[
        Math.min(oldPageState.total - 1, Math.max(...oldPageState.hist))
      ],
    };
  };

  const pageStateIsValid =
    pageState.current <= pageState.total &&
    pageState.current >= Math.max(...pageState.hist);

  const handleTimerUp = () => {
    focusState.mode = null;
    if (pageStateIsValid) {
      setPageState(timerNextPageState(pageState));
    }
  };

  return (
    <div>
      <motion.div className="timer">
        <Timer
          pageState={pageState}
          isValid={pageStateIsValid}
          isStop={focusState.mode === null}
          onTimeUp={handleTimerUp}
        />
      </motion.div>

      <motion.div>
        <AnimatePresence>
          {metromaps
            .filter(
              (_, index) =>
                index / METROMAPS_PER_PAGE < pageState.current &&
                index / METROMAPS_PER_PAGE >= pageState.current - 1
            )
            .map((metromap) => renderMetroMap(metromap))}
        </AnimatePresence>
      </motion.div>

      <motion.div className="metro-interface">
        <NavigationButton
          onClick={onBackToIntroPageButtonClick}
          className={`left-[2%] top-[50%]`}
          isVisible={
            // focusState.mode === null &&
            pageState.current === 1
          }
        >
          Back to Intro
          <FaArrowAltCircleLeft size={40} />
        </NavigationButton>

        {/* Navigation Button between each session */}
        <NavigationButton
          onClick={onNavigationBtwSessionClick(PAGE_DIRECTION.RIGHT)}
          className={`right-[2%] top-[50%] `}
          isVisible={
            focusState.mode === FOCUS_MODE.FULL_VIEW &&
            pageState.current !== pageState.total
          }
        >
          Next Map
          <FaArrowAltCircleRight size={40} color={"#b1babf"} />
        </NavigationButton>

        <NavigationButton
          onClick={onNavigationBtwSessionClick(PAGE_DIRECTION.LEFT)}
          className={`left-[2%] top-[50%] `}
          isVisible={
            // focusState.mode === null &&
            pageState.current !== 1
          }
        >
          Prev Map
          <FaArrowAltCircleLeft size={40} color={"#b1babf"} />
        </NavigationButton>
      </motion.div>
      <motion.div className="absolute left-[50%] bottom-0">
        {pageState.current}/{pageState.total}
      </motion.div>
    </div>
  );
}

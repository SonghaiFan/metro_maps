import { PAGE_DIRECTION } from "../components/Menu";

const ACTION_TYPES = {
  FULL_MAP_VIEW: "full_map_view",
  LANDING_PAGE_VIEW: "landing_page_view",
};

const FOCUS_MODE = {
  FULL_VIEW: "full_view",
};

const metroMapContainerVariantsFactory = (
  metromapsDetails,
  metromapId,
  screenHeight,
  screenWidth,
  direction
) => {
  return {
    entry: {
      x: metromapsDetails[metromapId].xPosition,
      y: metromapsDetails[metromapId].yPosition,
      width: metromapsDetails[metromapId].width,
      height: metromapsDetails[metromapId].height,
      opacity: 1,
      transition: { ease: "easeOut" },
    },
    fullView: {
      x: 0,
      y: 0,
      width: screenWidth,
      height: screenHeight,
      opacity: 1,
      transition: { ease: "easeOut" },
    },
    hidden: {
      x: direction === PAGE_DIRECTION.RIGHT ? screenWidth : -screenWidth,
      y: metromapsDetails[metromapId].yPosition,
      width: metromapsDetails[metromapId].width,
      height: metromapsDetails[metromapId].height,
      opacity: 0,
      transition: { ease: "easeOut" },
    },
  };
};

const getAnimateState = (focusState, metromap) => {
  return focusState.map === metromap.url &&
    focusState.mode === FOCUS_MODE.FULL_VIEW
    ? "fullView"
    : focusState.map !== metromap.url &&
      focusState.mode === FOCUS_MODE.FULL_VIEW
    ? "hidden"
    : "entry";
};

export {
  ACTION_TYPES,
  FOCUS_MODE,
  metroMapContainerVariantsFactory,
  getAnimateState,
};

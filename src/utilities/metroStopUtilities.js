import {
  METROSTOP_CIRCLE_SIZE,
  METROSTOP_BOTTOM_PADDING,
  ARTICALSTACK_INNER_PADDING,
  ARTICALSTACK_TOP_PADDING,
} from "../utilities/util";

const createCalculateNodeWordsLabelWidth = (fontSize, lineHeight) => {
  return (nodeLabel) => {
    const div = document.createElement("div");
    Object.assign(div.style, {
      visibility: "hidden",
      whiteSpace: "nowrap",
      width: "fit-content",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      fontSize,
      lineHeight,
    });
    div.innerText = nodeLabel;
    document.body.appendChild(div);
    const nodeWordsLabelWidth = div.clientWidth;
    document.body.removeChild(div);
    return nodeWordsLabelWidth;
  };
};

// Create functions for calculating node label width with different styles
const calculateNodeWordsLabelWidth = createCalculateNodeWordsLabelWidth(
  "0.875rem",
  "1.25rem"
);
const calculateNodeWordsLabelWidthClicked = createCalculateNodeWordsLabelWidth(
  "2.25rem",
  "2.5rem"
);

const nodeWordsVariantsFactory = (
  isMapFocused,
  height,
  screenHeight,
  clickedArticleContainerHeight,
  showMore,
  content,
  moreContent
) => {
  return {
    default: {
      y: isMapFocused ? height : 0,
      x: 0,
      width: showMore
        ? calculateNodeWordsLabelWidth(moreContent)
        : calculateNodeWordsLabelWidth(content),
    },
    clicked: {
      y:
        ARTICALSTACK_TOP_PADDING +
        clickedArticleContainerHeight +
        ARTICALSTACK_INNER_PADDING,
      width: showMore
        ? calculateNodeWordsLabelWidthClicked(moreContent)
        : calculateNodeWordsLabelWidthClicked(content),
    },
  };
};

export { nodeWordsVariantsFactory };

const metroStopVariantsFactory = (
  screenWidth,
  screenHeight,
  isMapFocused,
  node,
  landingX,
  landingY,
  landingWidth,
  landingHeight,
  paddingX,
  paddingY,
  nodeWidth,
  nodeHeight
) => {
  return {
    clicked: {
      x: 0,
      y: 0,
      width: screenWidth,
      height: screenHeight,
      zIndex: 50,
      transition: { ease: "easeOut" },
    },
    default: {
      x: (isMapFocused ? node.x : landingX) + paddingX,
      y:
        (isMapFocused ? node.y - METROSTOP_BOTTOM_PADDING : landingY) +
        paddingY,
      width: isMapFocused ? nodeWidth : landingWidth,
      height: isMapFocused ? nodeHeight : landingHeight,
      zIndex: 0,
      transition: { ease: "easeOut", when: "afterChildren" },
      // background: "gray",
    },
  };
};

export { metroStopVariantsFactory };

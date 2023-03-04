import {
  METROSTOP_CIRCLE_SIZE,
  METROSTOP_BOTTOM_PADDING,
  ARTICALSTACK_INNER_PADDING,
  ARTICALSTACK_TOP_PADDING,
} from "../utilities/util";
// TOP_MARGIN

const calculateNodeWordsLabelWidth = (content) => {
  // create a hidden div
  const div = document.createElement("div");
  div.style.visibility = "hidden";
  div.style.whiteSpace = "nowrap";
  div.style.width = "fit-content";
  div.style.paddingLeft = "0.5rem";
  div.style.paddingRight = "0.5rem";
  div.style.fontSize = "0.875rem";
  div.style.lineHeight = "1.25rem";
  div.innerText = content;
  document.body.appendChild(div);

  // calculate the width of the string
  const nodeWordsLabelWidth = div.clientWidth;

  // remove the div
  document.body.removeChild(div);

  return nodeWordsLabelWidth;
};

const calculateNodeWordsLabelWidthClicked = (content) => {
  // create a hidden div
  const div = document.createElement("div");
  div.style.visibility = "hidden";
  div.style.whiteSpace = "nowrap";
  div.style.width = "fit-content";
  div.style.paddingLeft = "0.5rem";
  div.style.paddingRight = "0.5rem";
  div.style.fontSize = "2.25rem";
  div.style.lineHeight = "2.5rem";
  div.innerText = content;
  document.body.appendChild(div);

  // calculate the width of the string
  const nodeWordsLabelWidth = div.clientWidth;

  // remove the div
  document.body.removeChild(div);

  return nodeWordsLabelWidth;
};

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
      y: isMapFocused ? height + METROSTOP_CIRCLE_SIZE : 0,
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
    },
  };
};

export { metroStopVariantsFactory };

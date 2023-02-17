import { NODEWIDTH } from "./util";
const articleVariantsFactory = (
  totalArticles,
  articleIndex,
  screenWidth,
  screenHeight,
  articleWidth,
  articleHeight,
  zoomedInArticleWidth,
  zoomedInArticleHeight,
  clickedArticleYPosition,
  articleDate,
  articleXvalue,
  articleYvalue
) => {
  // console.log(articleDate);
  return {
    clicked: {
      width: zoomedInArticleWidth,
      height: zoomedInArticleHeight,
      x: 0,
      y: clickedArticleYPosition,
      // transition: {
      //   delay: (totalArticles - articleIndex + 1) / 25,
      //   ease: "easeOut",
      // },
    },
    default: {
      width: NODEWIDTH,
      height: NODEWIDTH,
      // x: articleIndex * 20,
      // y: articleIndex * 5 - totalArticles + 1,
      x: articleXvalue,
      // normalizeDate("May 01, 2011", "May 28, 2011", articleDate),
      y: articleHeight + 2 - articleYvalue,
      transition: {
        delay: (totalArticles - articleIndex + 1) / 250,
        ease: "easeOut",
      },
    },
    doge: {
      width: NODEWIDTH,
      height: NODEWIDTH,
      // x: articleIndex * 20,
      // y: articleIndex * 5 - totalArticles + 1,
      x: articleXvalue,
      // normalizeDate("May 01, 2011", "May 28, 2011", articleDate),
      y: articleHeight + 2,
      transition: {
        delay: (totalArticles - articleIndex + 1) / 250,
        ease: "easeOut",
      },
    },
  };
};

export { articleVariantsFactory };

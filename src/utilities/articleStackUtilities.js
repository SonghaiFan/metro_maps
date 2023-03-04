const articleVariantsFactory = (
  totalArticles,
  articleIndex,
  screenWidth,
  screenHeight,
  articleWidth,
  articleHeight,
  zoomedInArticleWidth,
  zoomedInArticleHeight,
  clickedArticleYPosition
) => {
  return {
    clicked: {
      width: zoomedInArticleWidth,
      height: zoomedInArticleHeight,
      x: 0,
      y: clickedArticleYPosition,
      transition: {
        // delay: (totalArticles - articleIndex + 1) / 25,
        ease: "easeOut",
      },
    },
    default: {
      width: articleWidth,
      height: articleHeight,
      x: totalArticles - articleIndex - 1,
      y: articleIndex - totalArticles + 1,
      transition: {
        // delay: (totalArticles - articleIndex + 1) / 250,
        ease: "easeOut",
      },
    },
  };
};

export { articleVariantsFactory };

import { timeParse, timeParse2 } from "./util";

/**
 * Sorts and formats nodes and creates data object. Sorts lines to create the most intersections and also centers the most dense lines.
 * @returns data
 */
export const loadData = (rawData) => {
  const articles = rawData.articles.reduce((articles, article) => {
    return {
      ...articles,
      [article.id]: { ...article },
    };
  }, {});

  const data = {
    ...rawData,
    articles,
    nodes: rawData.nodes.map((n) => ({
      ...n,
      // if time is not array, parse it
      time: Array.isArray(n.time)
        ? n.time.map((time) => timeParse2(time))
        : timeParse(n.time),
    })),
  };

  return data;
};

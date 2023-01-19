const METROMAPS = [];

// estimate the time to read the data in seconds,
const estimateTimeToRead = (data) => {
  // count the length of the node,links and articles
  const nodeLength = data.nodes.length;
  const linkLength = data.links.length;
  const articleLength = data.articles.length;

  // estimate the time to read the data in seconds
  const time = Math.round(nodeLength * linkLength + articleLength);

  return time;
};

// const context = require.context("../data", true, /\.json$/);

const context = require.context("../data_norm", true, /\.json$/);

context.keys().forEach((key, index) => {
  const data = context(key);

  const url = key.replace("./", "").replace(".json", "");
  const title = url.replace(/-/g, " ");
  const idx = index;
  const description = "This is a dummy description";
  const subtitle = "This is a dummy subtitle";
  const hint = "This is a dummy hint";
  const time = estimateTimeToRead(data);
  METROMAPS.push({
    url,
    title,
    idx,
    data,
    description,
    subtitle,
    hint,
    time,
  });
  // sort by url
  METROMAPS.sort((a, b) => (a.url > b.url ? 1 : -1));
});

// find object in METROMAPS array by url and modify title, time, description, subtitle, hint
const findAndModify = (url, { title, time, description, subtitle, hint }) => {
  const index = METROMAPS.findIndex((m) => m.url === url);
  // if title is not defined, leave it as it is
  if (title) METROMAPS[index].title = title;
  if (time) METROMAPS[index].time = time;
  if (description) METROMAPS[index].description = description;
  if (subtitle) METROMAPS[index].subtitle = subtitle;
  if (hint) METROMAPS[index].hint = hint;
};

findAndModify("1-dummy-1x4-14_29", {
  time: 10,
});

export default METROMAPS;

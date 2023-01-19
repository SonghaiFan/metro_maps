// @satyaborg TODO: read data instead of importing
// import noFilterView1 from "../archived_data/05_04_2022/metromap_no_filter_n_neighbour_10_min_cluster_10.json";
// import noFilterView2 from "../archived_data/04_05_2022/20220503_no_filter_no_chunk_minlm.json";
// import ukrRus from "../archived_data/05_04_2022/ukr_rus_war.json";
// import electionView from "../archived_data/04_05_2022/election2.json";
// import domesticViolence from "../archived_data/01_07_2022/01_07_2022_1656654308.json";
// import domesticViolencePre2014 from "../archived_data/01_07_2022/01_07_2022_1656653072.json";
// import domesticViolencePost2014 from "../archived_data/01_07_2022/01_07_2022_1656653417.json";
// import introPage from "../archived_data/intro_page.json";
// import allView from "../archived_data/31_08_2022_1661913079_all_REDUCED.json";
// import govView from "../archived_data/21_09_2022_1663741409_gov.json";
// import voiceView from "../archived_data/21_09_2022_1663742238_voice.json";

// loop through the src/data folder and import all json files into METROMAPS array

// import { isNormalize } from "./util";

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

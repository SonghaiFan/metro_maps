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

import { normalizeTruth } from "./util";

const METROMAPS = [];

const normalizeNodeWeight = (data) => {
  // get the max and min node_weight
  let MAX_NODE_WEIGHT = data.nodes[0].node_weight;
  let MIN_NODE_WEIGHT = data.nodes[0].node_weight;

  // loop through all the data, get the max and min node_weight
  // and store it in the global variable
  data.nodes.forEach((node) => {
    if (node.node_weight > MAX_NODE_WEIGHT) {
      MAX_NODE_WEIGHT = node.node_weight;
    }
    if (node.node_weight < MIN_NODE_WEIGHT) {
      MIN_NODE_WEIGHT = node.node_weight;
    }
  });

  // if max and min are the same, set node_weight as it is, otherwise normalize
  if (MAX_NODE_WEIGHT !== MIN_NODE_WEIGHT) {
    data.nodes.forEach((node) => {
      node.node_weight =
        (node.node_weight - MIN_NODE_WEIGHT) /
        (MAX_NODE_WEIGHT - MIN_NODE_WEIGHT);
    });
  }
};

const normalizeEdgeWeight = (data) => {
  // get the max and min edge_weight
  let MAX_EDGE_WEIGHT = data.links[0].edge_weight;
  let MIN_EDGE_WEIGHT = data.links[0].edge_weight;

  // loop through all the data, get the max and min edge_weight
  // and store it in the global variable
  data.links.forEach((link) => {
    if (link.edge_weight > MAX_EDGE_WEIGHT) {
      MAX_EDGE_WEIGHT = link.edge_weight;
    }
    if (link.edge_weight < MIN_EDGE_WEIGHT) {
      MIN_EDGE_WEIGHT = link.edge_weight;
    }
  });

  // loop through all the data again and normalize the edge_weight
  // if max and min are the same, set edge_weight as it is, otherwise normalize
  if (MAX_EDGE_WEIGHT !== MIN_EDGE_WEIGHT) {
    data.links.forEach((link) => {
      link.edge_weight =
        (link.edge_weight - MIN_EDGE_WEIGHT) /
        (MAX_EDGE_WEIGHT - MIN_EDGE_WEIGHT);
    });
  }
};

const context = require.context("../data", true, /\.json$/);

context.keys().forEach((key) => {
  const data = context(key);

  // if the data.nodes has a node_weight property, normalize it

  if (normalizeTruth) {
    if (data.nodes[0].node_weight) {
      normalizeNodeWeight(data);
    }

    if (data.links[0].edge_weight) {
      normalizeEdgeWeight(data);
    }
  }

  const url = key.replace("./", "").replace(".json", "");
  const title = url.replace(/-/g, " ");
  const description =
    "This is a dummy description: lorem ipsum dolor sit amet etc.";
  const subtitle = "This is a dummy subtitle: lorem ipsum dolor sit amet etc.";
  const hint = "This is a dummy hint: lorem ipsum dolor sit amet etc.";
  const time = 60;
  METROMAPS.push({
    url,
    title,
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

const METROMAPS_URLS = METROMAPS.map((m) => m.url);
const METROMAPS_LENGTH = METROMAPS.length;
const METROMAPS_TIME = METROMAPS.map((m) => m.time);

export { METROMAPS_URLS, METROMAPS_LENGTH, METROMAPS_TIME };

export default METROMAPS;

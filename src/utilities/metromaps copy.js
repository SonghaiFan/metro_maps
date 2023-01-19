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

import { isNormalize } from "./util";
import _ from "lodash";

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

// loop through all the json files in the src/data folder

const getMinMaxWeight = (arr, type) => {
  const max = _.maxBy(
    arr.map((a) => a[type]),
    (val) => val
  );
  const min = _.minBy(
    arr.map((a) => a[type]),
    (val) => val
  );
  return { max, min };
};

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

const METROMAPS = [];
const MIX_WITH = {
  nodes: {
    node_weight: { min: 1, max: 0 },
    "node_weight-truth": { min: 1, max: 0 },
  },
  links: {
    edge_weight: { min: 1, max: 0 },
    "edge_weight-truth": { min: 1, max: 0 },
  },
};

const firstLoop = async () => {
  console.log("first loop");
  console.log("METROMAPS", METROMAPS);
  const context = require.context("../data", true, /\.json$/);
  const firstLoopPromises = context.keys().map((key) => {
    return new Promise((resolve) => {
      const data = context(key);

      Object.keys(MIX_WITH).forEach((type) => {
        Object.keys(MIX_WITH[type]).forEach((weightType) => {
          const { max, min } = getMinMaxWeight(data[type], weightType);
          MIX_WITH[type][weightType].max = max;
          MIX_WITH[type][weightType].min = min;
        });
      });
      resolve(MIX_WITH);
    });
  });
  await Promise.all(firstLoopPromises);
};

const secondLoop = async () => {
  console.log("second loop");
  console.log("METROMAPS", METROMAPS);
  const context = require.context("../data", true, /\.json$/);
  context.keys().forEach((key, index) => {
    const data = context(key);

    if (isNormalize) {
      Object.keys(MIX_WITH).forEach((type) => {
        Object.keys(MIX_WITH[type]).forEach((weightType) => {
          const { max, min } = MIX_WITH[type][weightType];
          data[type].forEach((item) => {
            if (max !== min && weightType in item) {
              item[weightType] = (item[weightType] - min) / (max - min);
              if (item[weightType] > 1) console.log(item);
              if (item[weightType] < 0) console.log(item);
            }
          });
        });
      });
    }
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
};

const loadAndModifyData = () => {
  return new Promise((resolve, reject) => {
    firstLoop()
      .then(() => {
        secondLoop();
      })
      .then(() => {
        findAndModify("0-dummy-2x2-54_99_19_30", {
          time: 10,
        });

        resolve(METROMAPS);
      })
      .catch((error) => reject(error));
  });
};

export default loadAndModifyData;

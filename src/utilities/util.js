import * as d3 from "d3";
import { differenceEuclideanRGB } from "d3-color-difference";

// FUNCTIONS
export const timeParse = d3.timeParse("%Y-%m-%d");
export const timeParse2 = d3.timeParse("%Y%m%d");
export const timeFormat = d3.timeFormat("%d %b %Y");
export const nodesCollided = (node1, node2) => {
  const xDifference = node1.x - node2.x;
  const yDifference = node1.x - node2.x;
  const length = Math.sqrt(
    xDifference * xDifference + yDifference * yDifference
  );
  return length < node1.radius + node2.radius;
};
export const flatMap = (array, mapFunction) => {
  return Array.prototype.concat(...array.map(mapFunction));
};

export const showTruth = true;
// CONSTANTS

export const NODEWIDTH = 10;
export const ARTICLE_RADIUS_MULTIPLIER = 0.8;
export const ARTICLE_SIZE_MULTIPLIER = 1.25;

export const TOP_FULL_PAGE_PADDING = 20;
export const MAX_ARTICLES = 20;

export const METROMAPS_PER_PAGE = 1; //Do not change this value
export const HEADER_HEIGHT = 80;

export const PAGE_DIRECTION = {
  RIGHT: 1,
  LEFT: -1,
};

export const METROLINE_WIDTH = 10;
export const METROLINE_ANIMATION_DURATION = 1;

export const METROSTOP_CIRCLE_SIZE = METROLINE_WIDTH * 2;

export const TIME_AXIS_PADDING = 10;

export const LINK_LABEL_HEIGHT = 20;

export const METROSTOP_BOTTOM_PADDING = 10;

export const ARTICALSTACK_TOP_PADDING = 50;
export const ARTICALSTACK_INNER_PADDING = 20;

export const LEFT_MARGIN = 20;
export const TOP_MARGIN = 40;

// metromap container margin
// export const margin = { x: 0.2, y: 0.15 };
export const METROMAP_CONTAINER_MARGIN = {
  left: 0.2,
  right: 0.05,
  top: 0.2,
  bottom: 0.2,
};
export const colours = ["#585d91", "#48a49e", "#fce554"];

const createColorScale = (colors, range) => {
  if (colors.length < 2) throw new Error("At least 2 colors are required");
  if (range[0] >= range[1])
    throw new Error("Invalid range, min value must be less than max value");

  const steps = colors.length - 1;
  const increment = (range[1] - range[0]) / steps;
  const domain = Array.from(
    { length: steps },
    (_, i) => range[0] + i * increment
  );
  domain.push(range[1]);
  console.log(domain);

  return d3.scaleLinear().domain(domain).range(colors);
};

//slate-500,emerald-400, yellow-300
// export const customerInterpolation = (Weight) => {
//   const ind = Weight * (colours.length - 1);
//   const colour1 = colours[Math.floor(ind)];
//   const colour2 = colours[Math.ceil(ind)];
//   return d3.interpolateRgb(colour1, colour2)(ind - Math.floor(ind));
// };

export const customerInterpolation = createColorScale(colours, [0, 1]);

export const invertCustomerInterpolation = (Color) => {
  const leftDist = differenceEuclideanRGB(colours[0], colours[1]);
  const rightDist = differenceEuclideanRGB(colours[1], colours[2]);
  const distToLeft = differenceEuclideanRGB(Color, colours[0]);
  const distToRight = differenceEuclideanRGB(Color, colours[2]);
  if (distToLeft < distToRight) {
    return distToLeft / leftDist / 2;
  }
  return 0.5 + (rightDist - distToRight) / rightDist / 2;
};

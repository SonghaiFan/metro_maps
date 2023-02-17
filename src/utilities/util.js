import * as d3 from "d3";
import { differenceEuclideanRGB } from "d3-color-difference";

// FUNCTIONS
export const timeParse = d3.timeParse("%Y-%m-%d");
export const timeParse2 = d3.timeParse("%Y%m%d");
export const timeParse3 = d3.timeParse("%B %d, %Y");

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

const NODEWIDTH = 15;
const ARTICLE_RADIUS_MULTIPLIER = 0.8;
const ARTICLE_SIZE_MULTIPLIER = 1.25;

const TOP_FULL_PAGE_PADDING = 20;
const MAX_ARTICLES = 20;

const METROMAPS_PER_PAGE = 1; //Do not change this value
const HEADER_HEIGHT = 80;

const PAGE_DIRECTION = {
  RIGHT: 1,
  LEFT: -1,
};

const METROLINE_WIDTH = 10;
const METROLINE_ANIMATION_DURATION = 1;

const METROSTOP_CIRCLE_SIZE = METROLINE_WIDTH * 2;

const TIME_AXIS_PADDING = 10;

const LINK_LABEL_HEIGHT = 20;

const METROSTOP_BOTTOM_PADDING = 10;

const ARTICALSTACK_TOP_PADDING = 50;
const ARTICALSTACK_INNER_PADDING = 20;

const LEFT_MARGIN = 20;
const TOP_MARGIN = 40;

export {
  NODEWIDTH,
  ARTICLE_SIZE_MULTIPLIER,
  ARTICLE_RADIUS_MULTIPLIER,
  TOP_FULL_PAGE_PADDING,
  MAX_ARTICLES,
  METROMAPS_PER_PAGE,
  HEADER_HEIGHT,
  PAGE_DIRECTION,
  METROLINE_WIDTH,
  METROLINE_ANIMATION_DURATION,
  METROSTOP_CIRCLE_SIZE,
  TIME_AXIS_PADDING,
  LINK_LABEL_HEIGHT,
  METROSTOP_BOTTOM_PADDING,
  ARTICALSTACK_TOP_PADDING,
  ARTICALSTACK_INNER_PADDING,
  LEFT_MARGIN,
  TOP_MARGIN,
};

// metromap container margin
export const margin = { x: 0.05, y: 0.15 };
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
  // console.log(domain);

  return d3.scaleLinear().domain(domain).range(colors);
};

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

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  METROLINE_WIDTH,
  METROLINE_ANIMATION_DURATION,
  LINK_LABEL_HEIGHT,
} from "../utilities/util";
import { useFirstMountState } from "react-use";

export default function MetroLineLabel({ data, onMetroLineLabelClick, width }) {
  const isFirstMount = useFirstMountState();

  const { id, label, colour, points, isChanged } = data;

  const content = Array.isArray(label) ? label[0].replace(/ /g, "_") : label;

  // get the length of the label array
  const labelLength = Math.min(Array.isArray(label) ? label.length : 1, 5);
  // get the first 5 words of the label array

  const moreContent = Array.isArray(label)
    ? label
        .slice(0, 5)
        .map((x) => x.replace(/ /g, "_"))
        .join(", ")
    : label;
  // join the label array into a string with space as separator

  let [{ x0, y0 }, { x1, y1 }] = points.map((coordinate, index) => {
    const keyX = `x${index}`;
    const keyY = `y${index}`;

    return {
      [keyX]: coordinate.x,
      [keyY]: coordinate.y,
    };
  });

  // reference: https://www.cuemath.com/geometry/angle-between-two-lines/
  const line1Gradient = 0; // assume the text is on a line with gradient=0
  const line2Gradient = x1 - x0 !== 0 ? (y1 - y0) / (x1 - x0) : 0; // avoid div by 0
  const angleBetweenTwoLinesRadian = Math.atan(
    (line2Gradient - line1Gradient) / (1 + line1Gradient * line2Gradient)
  );
  const angleBetweenTwoLinesDegree =
    (angleBetweenTwoLinesRadian * 180) / Math.PI;

  const shiftDist = -30;

  const shifDistAlongX =
    angleBetweenTwoLinesDegree === 45
      ? shiftDist * Math.cos(angleBetweenTwoLinesRadian)
      : 0;
  const shifDistAlongY =
    angleBetweenTwoLinesDegree === 45
      ? shiftDist * Math.sin(angleBetweenTwoLinesRadian)
      : 0;

  const [showMore, setShowMore] = useState(false);

  return (
    <motion.div
      className="absolute flex justify-center items-center pointer-events-none"
      initial={{
        x: Math.min(x0, x1),
        y: Math.min(y0, y1), // if y1 is smaller than y0 (lines going upwards) may cause bugs without Math.min
        width: Math.abs(x1 - x0),
        height: Math.abs(y1 - y0),
        rotate: angleBetweenTwoLinesDegree,
        opacity: 0,
      }}
      animate={{
        // change x and y values based on angleBetweenTwoLinesDegree to make the label shift to the left or right
        x: Math.min(x0, x1) + shifDistAlongX,
        y: Math.min(y0, y1) - METROLINE_WIDTH + shifDistAlongY, // if y1 is smaller than y0 (lines going upwards) may cause bugs without Math.min
        width: Math.abs(x1 - x0),
        height: Math.abs(y1 - y0),
        rotate: angleBetweenTwoLinesDegree,
        opacity: 1,
        transition: {
          ease: "easeOut",
          delay: isFirstMount ? METROLINE_ANIMATION_DURATION : 0,
        },
      }}
    >
      <motion.div
        data-type="metro-line-label"
        id={id}
        style={{
          wordSpacing: "100vw",
          width: "min-content", // to prevent the label from wrapping
          borderColor: "white",
          // borderWidth: label ? (isChanged ? "0px" : "2px") : null, //###
          borderStyle: "solid",
          borderBottom: "none",
          backgroundColor: colour, // "white"
        }}
        animate={{
          height: showMore
            ? LINK_LABEL_HEIGHT * labelLength
            : LINK_LABEL_HEIGHT, // 20 from line height of text-sm
        }}
        className={`edge-${id} alerts-border  text-black text-sm rounded-md px-2 z-50 cursor-pointer pointer-events-auto`}
        onClick={onMetroLineLabelClick}
        onMouseEnter={() => setShowMore(true)}
        onMouseLeave={() => setShowMore(false)}
      >
        {/* remove empty space in content */}
        {showMore ? moreContent : content}
      </motion.div>
    </motion.div>
  );
}

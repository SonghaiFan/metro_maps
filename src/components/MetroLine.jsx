import React from "react";
import { motion } from "framer-motion";
import * as utils from "svg-path-reverse";

import {
  METROLINE_WIDTH,
  METROLINE_ANIMATION_DURATION,
} from "../utilities/util";

const metroLineVariantFactory = {
  hidden: {
    pathLength: 0,
    transition: { duration: METROLINE_ANIMATION_DURATION },
  },
  default: {
    pathLength: 1,
    transition: { duration: METROLINE_ANIMATION_DURATION },
  },
};

export default function MetroLine({
  data,
  strokeWidth,
  reversed,
  onClickToOpenDrawer,
}) {
  const drawPath = (coords) => {
    let res = "";

    // Draws svg path through given coords
    coords.forEach((c, i) => {
      if (i === 0) {
        // first coord
        res += `M ${c.x} ${c.y}`;
      } else {
        const cl = 10; // curve length
        const offset = cl * 2 ** -0.5; // side length after curve
        if (c.start === null) {
          res += ` L ${c.x} ${c.y}`;
        } else {
          res += ` L ${c.x + cl * c.start[0]} ${c.y + cl * c.start[1]}`; // point before curve
          res += ` C ${c.x} ${c.y} ${c.x} ${c.y}`; // control points
          res += ` ${c.x + offset * c.end[0]} ${c.y + offset * c.end[1]}`;
        }
      }
    });

    return reversed ? utils.reverse(res) : res;
  };

  return (
    <>
      {data.map((path, index) => {
        // console.log(path);
        return (
          <motion.g key={index}>
            {path.isChanged && (
              <motion.path
                className={`edge-shadow-${path.id} alerts-border `}
                d={drawPath(path.path)}
                style={{
                  fill: "transparent",
                  strokeWidth: strokeWidth + 4 || METROLINE_WIDTH + 4,
                  stroke: "white",
                }}
                variants={metroLineVariantFactory}
                initial="hidden"
                animate="default"
              />
            )}
            <motion.path
              data-type="metro-line-path"
              className={`edge-${path.id} hover:cursor-pointer`}
              id={path.id}
              d={drawPath(path.path)}
              stroke={path.colour}
              style={{
                fill: "transparent",
                strokeWidth: strokeWidth || METROLINE_WIDTH,
              }}
              variants={metroLineVariantFactory}
              initial="hidden"
              animate="default"
              onClick={onClickToOpenDrawer}
            />
          </motion.g>
        );
      })}
    </>
  );
}

import React from "react";
import { motion } from "framer-motion";
import * as utils from "svg-path-reverse";
import { NODEWIDTH } from "../utilities/util";

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
  width,
}) {
  const drawPath = (coords) => {
    let res = "";

    // Draws svg path through given coords

    const xs = coords.map((c) => c.x);
    const ys = coords.map((c) => c.y);

    const m = (ys[1] - ys[2]) / (xs[1] - xs[2]);

    coords.forEach((c, i) => {
      if (i === 0) {
        // first coord
        res += `M ${xs[i] + width / 2 + NODEWIDTH / 2} ${ys[i]}`;
      }
      if (i === 1) {
        const x0 = xs[i - 1] + width / 2 + NODEWIDTH / 2;
        if (xs[i] < x0) {
          res += ` L ${x0} ${m * x0 + ys[i] - m * xs[i]}`;
        } else {
          res += ` L ${xs[i]} ${ys[i]}`;
        }
      }
      if (i === 2) {
        const x0 = xs[i + 1] - width / 2 + NODEWIDTH / 2;
        if (xs[i] > x0) {
          res += ` L ${x0} ${m * x0 + ys[i] - m * xs[i]}`;
        } else {
          res += ` L ${xs[i]} ${ys[i]}`;
        }
      }
      if (i === 3) {
        res += ` L ${xs[i] - width / 2 + NODEWIDTH / 2} ${ys[i]}`;
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
            {/* ###line border */}
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

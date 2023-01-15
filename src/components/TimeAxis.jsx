import React from "react";
import { motion } from "framer-motion";
import {
  timeFormat,
  METROSTOP_CIRCLE_SIZE,
  TIME_AXIS_PADDING,
  MAX_ARTICLES,
  METROSTOP_BOTTOM_PADDING,
  // METROLINE_ANIMATION_DURATION,
} from "../utilities/util";
// import { useFirstMountState } from "react-use";

export default function TimeAxis({
  data,
  nodeWidth,
  nodeHeight,
  paddingX,
  paddingY,
}) {
  // const isFirstMount = useFirstMountState();
  const longestColumnIndex = data.reduce((maxColumnIndex, column, index) => {
    return data[maxColumnIndex].length < column.length ? index : maxColumnIndex;
  }, 0);

  console.log(data);

  const timeAxisHeight =
    // article stack height
    MAX_ARTICLES +
    // difference between last node y and first node y
    (data[longestColumnIndex][data[longestColumnIndex].length - 1].y -
      data[longestColumnIndex][0].y) +
    // last node height
    nodeHeight +
    // last node circle height
    METROSTOP_CIRCLE_SIZE +
    // last node node word label height
    20 +
    // top & bottom padding of the time axis
    2 * TIME_AXIS_PADDING;

  return (
    <motion.div>
      {data.map((column, index) => {
        // if time is array, reduce it to an array only contians the min and max time

        const isTimeArray = Array.isArray(column[0].time);

        // if isTimeArray, then combine all time array and get the min and max time,
        // else, get the min and max time directly

        const startingDate = isTimeArray
          ? new Date(
              Math.min(
                ...column.map((node) => {
                  return Math.min(...node.time);
                })
              )
            )
          : new Date(Math.min(...column.map((node) => node.time)));

        const endingDate = isTimeArray
          ? new Date(
              Math.max(
                ...column.map((node) => {
                  return Math.max(...node.time);
                })
              )
            )
          : new Date(Math.max(...column.map((node) => node.time)));

        return (
          <motion.div key={index}>
            <motion.div
              className="absolute bg-neutral-800 rounded-2xl"
              initial={{
                x: column[0].x - (nodeWidth + MAX_ARTICLES) * 0.25,
                y:
                  paddingY -
                  METROSTOP_BOTTOM_PADDING -
                  MAX_ARTICLES -
                  TIME_AXIS_PADDING,
                width: (nodeWidth + MAX_ARTICLES) * 1.5,
                height: 0,
              }}
              animate={{
                x: column[0].x - (nodeWidth + MAX_ARTICLES) * 0.25,
                y:
                  paddingY -
                  METROSTOP_BOTTOM_PADDING -
                  MAX_ARTICLES -
                  TIME_AXIS_PADDING,
                width: (nodeWidth + MAX_ARTICLES) * 1.5,
                height: timeAxisHeight,
                // transition: {
                //   duration: isFirstMount ? METROLINE_ANIMATION_DURATION : 0,
                // },
              }}
            />
            <motion.div
              className="absolute p-2 flex justify-center"
              initial={{
                x: column[0].x - (nodeWidth + MAX_ARTICLES) * 0.25,
                y:
                  paddingY -
                  METROSTOP_BOTTOM_PADDING -
                  MAX_ARTICLES -
                  TIME_AXIS_PADDING +
                  timeAxisHeight,
                width: (nodeWidth + MAX_ARTICLES) * 1.5,
                opacity: 0,
                // transition: {
                //   delay: isFirstMount ? 2 : 0,
                // },
              }}
              animate={{
                x: column[0].x - (nodeWidth + MAX_ARTICLES) * 0.25,
                y:
                  paddingY -
                  METROSTOP_BOTTOM_PADDING -
                  MAX_ARTICLES -
                  TIME_AXIS_PADDING +
                  timeAxisHeight,
                width: (nodeWidth + MAX_ARTICLES) * 1.5,
                opacity: 1,
                // transition: {
                //   delay: isFirstMount ? 2 : 0,
                // },
              }}
            >
              {startingDate === endingDate ? (
                <>{timeFormat(startingDate)}</>
              ) : (
                <>
                  {`${timeFormat(startingDate)} to ${timeFormat(endingDate)}`}
                </>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

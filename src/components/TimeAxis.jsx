import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
import { motion } from "framer-motion";
import {
  timeFormat,
  METROSTOP_CIRCLE_SIZE,
  TIME_AXIS_PADDING,
  MAX_ARTICLES,
  METROSTOP_BOTTOM_PADDING,
  ARTICLE_SIZE_MULTIPLIER,
  // METROLINE_ANIMATION_DURATION,
} from "../utilities/util";
// import { useFirstMountState } from "react-use";

export default function TimeAxis({
  data,
  nodeWidth,
  nodeHeight,
  paddingX,
  paddingY,
  screenWidth,
  screenHeight,
}) {
  // const isFirstMount = useFirstMountState();
  const longestColumnIndex = data.reduce((maxColumnIndex, column, index) => {
    return data[maxColumnIndex].length < column.length ? index : maxColumnIndex;
  }, 0);

  const times = data.map((column, index) => {
    const isTimeArray = Array.isArray(column[0].time);
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

    // add startingDate and endingDate to the column
    return {
      startingDate,
      endingDate,
    };
  });

  // const startingDates = times.map((d) => d.startingDate);
  // const endingDates = times.map((d) => d.endingDate);
  // const minStartingDate = d3.min(startingDates);
  // const maxEndingDate = d3.max(endingDates);

  // const scale = d3
  //   .scaleTime()
  //   .domain([minStartingDate, maxEndingDate])
  //   .range([paddingX + nodeWidth, screenWidth - paddingX - nodeWidth]);

  // create time axis
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
        const startingDate = times[index].startingDate;
        const endingDate = times[index].endingDate;
        // get middle day of the time range
        // const middleDate = new Date(
        //   startingDate.getTime() +
        //     (endingDate.getTime() - startingDate.getTime()) / 2
        // );

        // const timeVaryNodeWidth = scale(endingDate) - scale(startingDate);
        return (
          <motion.div key={index}>
            <motion.div
              className="absolute bg-neutral-900 rounded-2xl"
              initial={{
                x: paddingX + column[0].x - nodeWidth * 0.25,
                y:
                  paddingY -
                  METROSTOP_BOTTOM_PADDING -
                  MAX_ARTICLES -
                  TIME_AXIS_PADDING,
                width: nodeWidth * ARTICLE_SIZE_MULTIPLIER,
                height: timeAxisHeight,
                opacity: 0,
              }}
              animate={{
                x: paddingX + column[0].x - nodeWidth * 0.25,
                y:
                  paddingY -
                  METROSTOP_BOTTOM_PADDING -
                  MAX_ARTICLES -
                  TIME_AXIS_PADDING,
                width: nodeWidth * ARTICLE_SIZE_MULTIPLIER,
                height: timeAxisHeight,
                opacity: 1,
              }}
              // initial={{
              //   x: scale(startingDate),
              //   y:
              //     paddingY -
              //     METROSTOP_BOTTOM_PADDING -
              //     MAX_ARTICLES -
              //     TIME_AXIS_PADDING,
              //   width: timeVaryNodeWidth,
              //   height: timeAxisHeight,
              // }}
            />
            <motion.div
              className="absolute p-2 flex justify-center"
              initial={{
                x: paddingX + column[0].x - (nodeWidth + MAX_ARTICLES) * 0.25,
                y:
                  paddingY -
                  METROSTOP_BOTTOM_PADDING -
                  MAX_ARTICLES -
                  TIME_AXIS_PADDING +
                  timeAxisHeight,
                width: (nodeWidth + MAX_ARTICLES) * 1.2,
                opacity: 0,
              }}
              animate={{
                x: paddingX + column[0].x - (nodeWidth + MAX_ARTICLES) * 0.25,
                y:
                  paddingY -
                  METROSTOP_BOTTOM_PADDING -
                  MAX_ARTICLES -
                  TIME_AXIS_PADDING +
                  timeAxisHeight,
                width: (nodeWidth + MAX_ARTICLES) * 1.2,
                opacity: 1,
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

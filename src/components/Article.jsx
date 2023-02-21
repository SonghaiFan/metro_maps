import React, { useState } from "react";
import { motion } from "framer-motion";
export default function Article({
  article,
  metroStopClicked,
  onClick,
  clicked,
  id,
}) {
  return (
    <motion.div
      className=" absolute bg-inherit w-full h-full rounded-md"
      // onClick={onClick}
    >
      <motion.div
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--primaryDark)",
        }}
        id={id}
        className="article-container"
      >
        {metroStopClicked && (
          <>
            <motion.div
              className={`text-2xl p-2 pb-1 ${
                clicked ? "" : "line-clamp-2"
              } font-bold`}
            >
              {article.title}
            </motion.div>
            <motion.div className="p-2 pt-0 pb-1">
              {/* if article.publisher is defined, show string "by {article.publisher} on {article.timestamp}" */}
              {article.publisher && (
                <span className="font-bold">By {article.publisher} </span>
              )}
              <span> on {article.timestamp}</span>
            </motion.div>
            <motion.div className={`${clicked ? "" : "line-clamp-2"} m-2 mt-0`}>
              {article.full_text ? article.full_text : article.text}
            </motion.div>
            <motion.button
              className={`relative bg-transparent rounded left-[50%] transform -translate-x-1/2 bottom-0`}
              onClick={onClick}
            >
              {clicked ? (
                <>
                  Show less
                  {/* <MdUnfoldLess size={30} /> */}
                </>
              ) : (
                <>
                  Show more
                  {/* <MdUnfoldMore size={30} /> */}
                </>
              )}
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

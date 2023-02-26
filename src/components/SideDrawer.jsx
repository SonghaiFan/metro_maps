import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { invertCustomerInterpolation } from "../utilities/util";
import { MdClose, MdCheck } from "react-icons/md";
import mixpanel from "mixpanel-browser";

export const SideDrawer = ({
  isVisible,
  close,
  screenWidth,
  screenHeight,
  whoOpenSideDrawer,
  handleSideDrawerConfirmed,
  handleChange,
}) => {
  const drawerWidth = screenWidth;
  const drawerHeight = screenHeight / 4;
  // check if whoOpenSideDrawer dom element is on top half of the screen

  const [isOnTopHalf, setIsOnTopHalf] = useState(true);

  const [comment, setComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setComment("");
    close();
  };

  const handleTextChange = (event) => {
    setComment(event.target.value);
  };

  // useEffect(() => {
  //   setIsOnTopHalf(
  //     whoOpenSideDrawer
  //       ? whoOpenSideDrawer.getBoundingClientRect().top < screenHeight / 2
  //       : false
  //   );
  // }, [whoOpenSideDrawer, screenHeight]);

  // const getColour = (whoOpenSideDrawer) => {
  //   if (whoOpenSideDrawer) {
  //     const type = whoOpenSideDrawer.dataset.type;
  //     // console.log("type", type);
  //     if (type === "metro-line-path") {
  //       // return path element stroke properties

  //       return getComputedStyle(whoOpenSideDrawer).stroke;
  //     } else {
  //       return whoOpenSideDrawer.style.backgroundColor;
  //     }
  //   }
  // };

  // const whoColour = getColour(whoOpenSideDrawer);
  // const whoValue = invertCustomerInterpolation(whoColour);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* print out whoOpenSideDrawer as stirng */}

          <motion.div
            className="drawer-modal absolute w-screen h-screen bg-black z-50"
            style={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={close}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className={
              isOnTopHalf
                ? `absolute bottom-0 right-[25%] flex items-center justify-center bg-neutral-900 rounded-2xl z-50`
                : `absolute top-0 right-[25%] flex items-center justify-center bg-neutral-900 rounded-2xl z-50`
            }
            style={{ width: drawerWidth / 2, overflow: "hidden" }}
            animate={{ height: drawerHeight }}
            exit={{ height: 0, capacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="absolute top-0 right-0 flex justify-center items-center text-4xl"
              onClick={close}
            >
              <MdClose />
            </motion.button>
            <motion.button
              className="absolute bottom-0 right-0 flex justify-center items-center text-4xl"
              onClick={handleSubmit}
            >
              <MdCheck />
            </motion.button>
            <motion.div className="text-2xl mx-10">
              <h1 className="text-2xl">Please write the narrative/story</h1>
              <textarea
                value={comment}
                onChange={handleTextChange}
                rows={3}
                className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              />
              <br></br>
              <h1 className="text-sm max-w-xl ">
                PS: Based on your reading, what is the overall story of the
                links you selected? Write with your own words.
              </h1>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

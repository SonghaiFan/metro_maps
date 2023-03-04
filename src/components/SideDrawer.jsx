import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import { invertCustomerInterpolation } from "../utilities/util";
import { MdClose, MdCheck } from "react-icons/md";
import { METROMAP_CONTAINER_MARGIN } from "../utilities/util";
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
  const drawerWidth = screenWidth * METROMAP_CONTAINER_MARGIN.left - 50;
  const drawerHeight = screenHeight;
  // check if whoOpenSideDrawer dom element is on top half of the screen

  // const [isOnTopHalf, setIsOnTopHalf] = useState(true);

  const [comment, setComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setComment("");
    close();
  };

  const handleTextChange = (event) => {
    setComment(event.target.value);
  };

  // const whoColour = getColour(whoOpenSideDrawer);
  // const whoValue = invertCustomerInterpolation(whoColour);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* print out whoOpenSideDrawer as stirng */}

          {/* <motion.div
            className="drawer-modal absolute w-screen h-screen bg-black z-50"
            style={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={close}
            transition={{ duration: 0.2 }}
          /> */}

          <motion.div
            className={`absolute bottom-0 left-0 flex justify-center bg-neutral-900 rounded-2xl z-50`}
            style={{
              width: 0,
              height: drawerHeight,
              overflow: "hidden",
            }}
            animate={{ width: drawerWidth }}
            exit={{ width: 0, capacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* <motion.button
              className="absolute top-0 right-0 flex justify-center items-center text-4xl"
              onClick={close}
            >
              <MdClose />
            </motion.button> */}
            <motion.button
              className="absolute bottom-0 right-0 flex justify-center items-center text-4xl"
              onClick={handleSubmit}
            >
              <MdCheck />
            </motion.button>
            <motion.div className="text-2xl mx-10">
              <br></br>
              <h1 className="text-2xl">Please write the narrative/story</h1>
              <textarea
                value={comment}
                onChange={handleTextChange}
                className="w-full h-[80%] px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
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

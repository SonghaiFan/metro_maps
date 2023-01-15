import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  margin,
  cutomerInterpolation,
  invertCustomerInterpolation,
} from "../utilities/util";
import { MdClose } from "react-icons/md";
import mixpanel from "mixpanel-browser";

export const SideDrawer = ({
  isVisible,
  close,
  screenWidth,
  screenHeight,
  whoOpenSideDrawer,
  handleCustomNodes,
  handleCustomLines,
}) => {
  const drawerWidth = screenWidth;
  const drawerHeight = screenHeight / 4;
  // check if whoOpenSideDrawer dom element is on top half of the screen
  const isOnTopHalf = whoOpenSideDrawer
    ? whoOpenSideDrawer.getBoundingClientRect().top < screenHeight / 2
    : false;

  const getColour = (whoOpenSideDrawer) => {
    if (whoOpenSideDrawer) {
      const type = whoOpenSideDrawer.dataset.type;
      console.log("type", type);
      if (type === "metro-line-path") {
        // return path element stroke properties

        return getComputedStyle(whoOpenSideDrawer).stroke;
      } else {
        return whoOpenSideDrawer.style.backgroundColor;
      }
    }
  };

  const whoColour = getColour(whoOpenSideDrawer);
  const whoValue = invertCustomerInterpolation(whoColour);

  const handleCustomNodesChange = (event) => {
    // console.log("in the drawer: ", whoOpenSideDrawer);
    mixpanel.track("Metro label changed", {
      value: event.target.value,
    });

    const newColour = cutomerInterpolation(event.target.value);

    const type = whoOpenSideDrawer.dataset.type;
    // console.log("type", type);
    const whoId = whoOpenSideDrawer.id;

    if (type === "metro-line-label" || type === "metro-line-path") {
      mixpanel.track("Metro line label colour changed", {
        lineID: whoId,
        newColour: newColour,
      });
      // console.log(`this is a metro line label at ${whoId}`);
      handleCustomLines(whoId, newColour);

      const changedEdges = document.querySelectorAll(`.edge-${whoId}`);
      for (let i = 0; i < changedEdges.length; i++) {
        changedEdges[i].style.border = null;
      }

      const changedEdgeShadow = document.querySelectorAll(
        `.edge-shadow-${whoId}`
      );
      for (let i = 0; i < changedEdgeShadow.length; i++) {
        changedEdgeShadow[i].style.strokeWidth = null;
      }
    }

    if (
      type === "node-words-label" ||
      type === "node-number-label" ||
      type === "neighbour-node-label"
    ) {
      mixpanel.track("Node word label colour changed", {
        nodeID: whoId,
        newColour: newColour,
      });
      // console.log(`this is a node word label at ${whoId}`);
      handleCustomNodes(whoId, newColour);
      // query all dom has the same class name based on whoId and add border
      const changedNodes = document.querySelectorAll(`.node-${whoId}`);
      // loop through the changedNodes and add border
      for (let i = 0; i < changedNodes.length; i++) {
        changedNodes[i].style.border = null;
      }

      const changedArticles = document.querySelectorAll(`.article-${whoId}`);

      for (let i = 0; i < changedArticles.length; i++) {
        changedArticles[i].style.border = null;
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="absolute w-screen h-screen bg-black z-50"
            style={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            onClick={close}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className={
              isOnTopHalf
                ? `absolute bottom-0 right-[25%] flex items-center justify-center bg-black z-50`
                : `absolute top-0 right-[25%] flex items-center justify-center bg-black z-50`
            }
            style={{ width: drawerWidth / 2 }}
            animate={{ height: drawerHeight }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="absolute top-0 right-0 flex justify-center items-center text-4xl"
              onClick={close}
            >
              <MdClose />
            </motion.button>

            <motion.div className="text-2xl mx-10">
              {/* range slider with five step, label is very high, high, moderate, weak, very weak */}
              <motion.div className="text-2xl">
                Please rate the degree of connection
              </motion.div>
              <motion.input
                id="range-slider"
                type="range"
                className="w-full h-3 bg-gray-70 rounded-lg appearance-none cursor-pointer range-lg"
                min="0"
                max="1"
                step="0.25"
                defaultValue={whoValue}
                list="tickmarks"
                onChange={handleCustomNodesChange}
              />
              <motion.datalist id="tickmarks" className="felex flex-col ">
                <option>Very high</option>
                <option>High</option>
                <option>Moderate</option>
                <option>Weak</option>
                <option>Very weak</option>
              </motion.datalist>
              <motion.div className="w-full flex justify-between text-xs px-2">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </motion.div>
              <motion.div className="w-full flex justify-between text-xs px-2">
                <span>Very weak</span>
                <span>Weak</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Very high</span>
              </motion.div>
              <br></br>
              <motion.button
                className="absolute bottom-0 right-0 flex justify-center items-center text-4xl"
                onClick={close}
              >
                <MdClose />
              </motion.button>
              <motion.div className="text-[10px]">
                PS: Based on your reading, how relatively strong is the
                connection in this corpus? Either change it or leave it as it
                is. confirm your choice by clicking confrim button. Exit the
                side drawer by clicking the close button or anywhere outside the
                side drawer.
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

import React from "react";
import { motion } from "framer-motion";
// import { ReactComponent as NeighbourArrow } from "../assets/NeighbourArrow.svg";
import { BsArrowRightCircle as NeighbourArrow } from "react-icons/bs";
import { NEIGHBOURING_NODE_POSITION } from "./NeighbouringNodes";

export default function NeighbouringNode({
  data,
  onClick,
  currentNode,
  position,
  onNeighbourNodeLabelClick,
}) {
  // console.log("data", data);
  const content = data.node_words.length > 0 ? data.node_words[0] : "";

  const { x: x0, y: y0 } = currentNode;
  const { x: x1, y: y1 } = data;

  // reference: https://www.cuemath.com/geometry/angle-between-two-lines/
  const line1Gradient = 0; // assume the text is on a line with gradient=0
  const line2Gradient = x1 - x0 !== 0 ? (y1 - y0) / (x1 - x0) : 0; // avoid div by 0
  const angleBetweenTwoLinesRadian = Math.atan(
    (line2Gradient - line1Gradient) / (1 + line1Gradient * line2Gradient)
  );
  const angleBetweenTwoLinesDegree =
    (angleBetweenTwoLinesRadian * 180) / Math.PI +
    (position === NEIGHBOURING_NODE_POSITION.LEFT ? 180 : 0);

  return (
    <motion.div className="w-full h-full flex flex-col justify-center items-center ">
      <motion.div
        data-type="neighbour-node-label"
        id={data.id}
        style={{
          backgroundColor: data.colour, //"white"
          border: "2px solid white",
        }}
        className={`node-${data.id}  text-black rounded-md px-2 m-5 text-2xl pointer-events-auto`}
        onClick={(event) => onNeighbourNodeLabelClick(event.target)}
      >
        {content}
      </motion.div>
      <motion.button
        className="w-20 pointer-events-auto"
        onClick={onClick}
        animate={{ rotate: angleBetweenTwoLinesDegree }}
      >
        <NeighbourArrow size={50} />
      </motion.button>
    </motion.div>
  );
}

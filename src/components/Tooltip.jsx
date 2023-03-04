import React, { useRef, useState } from "react";

const Tooltip = ({ text, clicked, children }) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null);

  const handleMouseEnter = () => {
    setShow(true);
  };

  const handleMouseMove = (e) => {
    // console.log(e.clientX, e.clientY);
    // get the recent parent with class name metro--stop--wrapper position
    const parent = e.target.closest(".metro--stop--wrapper");
    const parentRect = parent.getBoundingClientRect();
    const parentLeft = parentRect.left;
    const parentTop = parentRect.top;
    tooltipRef.current.style.left = clicked
      ? e.clientX + 10 + "px"
      : e.clientX + 10 - parentLeft + "px";
    tooltipRef.current.style.top = clicked
      ? e.clientY - 100 + "px"
      : e.clientY - 100 - parentTop + "px";
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && (
        <div
          ref={tooltipRef}
          style={{ width: "150px" }}
          className="absolute text-white text-sm m-1 font-bold rounded-md px-2 bg-neutral-900 opacity-80 filter drop-shadow-md z-50  max-w-xs break-words"
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;

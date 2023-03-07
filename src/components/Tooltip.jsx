import React, { useRef, useState } from "react";

const Tooltip = ({ data, clicked, children }) => {
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

    // funtion that make sure the x and y not move out of the screen
    const checkX = (x) => {
      if (x < 500) {
        return 500;
      } else if (x > window.innerWidth - 150) {
        return window.innerWidth - 150;
      } else {
        return x;
      }

      // return x < 0 ? 0 : x > window.innerWidth - 300 ? window.innerWidth - 300 : x;
    };

    const checkY = (y) => {
      if (y < 200) {
        return 200;
      } else {
        return y;
      }
    };

    const y = checkY(e.clientY);
    const x = checkX(e.clientX);

    tooltipRef.current.style.left = clicked
      ? x - 150 + "px"
      : x - 150 - parentLeft + "px";

    tooltipRef.current.style.top = clicked
      ? y - 200 + "px"
      : y - 200 - parentTop + "px";
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="z-50"
    >
      {children}
      {show && (
        <div
          ref={tooltipRef}
          style={{ width: "300px" }}
          className="absolute z-100 text-white text-sm m-1 font-bold rounded-md px-2 bg-white opacity-80 filter max-w-xs break-words"
        >
          {!clicked && data && (
            <div
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--primaryDark)",
              }}
            >
              <div
                className={`text-sm p-2 pb-1 ${
                  clicked ? "" : "line-clamp-2"
                } font-bold`}
              >
                {data.title}
              </div>
              <div className="p-2 pt-0 pb-1">
                {/* if article.publisher is defined, show string "by {article.publisher} on {article.timestamp}" */}
                {data.publisher && (
                  <span className="font-bold">By {data.publisher} </span>
                )}
                <span> on {data.timestamp}</span>
              </div>
              <div
                className={`article-text-container text-[10px] unselectable ${
                  clicked ? "" : "line-clamp-2"
                } m-2 mt-0`}
              >
                {data.text}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;

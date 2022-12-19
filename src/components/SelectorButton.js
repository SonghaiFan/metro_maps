import React from "react";

export default function SelectorButton({
  selectorID,
  onClick,
  isActive,
  isSmall,
  isDead,
}) {
  const className = `${
    isSmall ? "w-2 h-2" : "w-10 h-10"
  } flex items-center justify-center rounded-full border-2 border-white-500 ml-2 select-none ${
    !isDead ? "hover:bg-white hover:text-black" : ""
  } ${
    isActive
      ? "bg-white text-black font-bold  "
      : "bg-black text-white font-normal "
  }`;

  return (
    <>
      {isDead ? (
        <div id={"selector" + selectorID} className={className}></div>
      ) : (
        <div
          id={"selector" + selectorID}
          onClick={onClick}
          className={className}
        >
          {selectorID}
        </div>
      )}
    </>
  );
}

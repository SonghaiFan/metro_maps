import React, { useState, useEffect } from "react";
import NavigationButton from "./NavigationButton";
import { FaArrowAltCircleRight } from "react-icons/fa";
import NavigationBar from "./NavigationBar";
import {
  TOTAL_SLIDES,
  PAGES,
  ExplanatoryPage,
  WelcomePage,
  FirstPage,
  ArticlePage,
  MetroStopPage,
  MetroLinesPage,
  FinalPage,
} from "./IntroPages";
// import mixpanel from "mixpanel-browser";

// sample images
import mappng from "../img/map1.png";
import metrostop from "../img/metrostop.png";
import legend from "../img/legend.png";
import connection from "../img/connection.png";
import branching from "../img/branching.png";
import articles from "../img/articles.png";
import cover1 from "../img/cover1.png";
import cover2 from "../img/cover2.png";
import cover3 from "../img/cover3.png";
import cover4 from "../img/cover4.png";

const images = [cover1, cover2, cover3, cover4];

const randomIndex = Math.floor(Math.random() * images.length);
const randomImage = images[randomIndex];

export default function IntroMetroMapWrapper({ setStart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const selectPage = () => {
    switch (currentPage) {
      case PAGES.WELCOME:
        return {
          left: (
            <WelcomePage
              setIsFormSubmitted={setIsFormSubmitted}
              isConfirmed={isConfirmed}
              setIsConfirmed={setIsConfirmed}
            />
          ),
          right: <ExplanatoryPage />,
        };
      case PAGES.FIRST:
        return {
          left: (
            <img
              className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[47%] translate-y-[-50%]"
              src={mappng}
              alt="Sample metromap"
            />
          ),
          right: <FirstPage />,
        };
      case PAGES.ARTICLE:
        return {
          left: (
            <>
              <img
                src={articles}
                className="absolute left-[28%] max-w-[45%] max-h-[40%] translate-x-[-50%] top-[40%] translate-y-[-50%]"
                alt="Sample articles"
              />
              <img
                src={metrostop}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[70%] translate-y-[-50%]"
                alt="Sample station"
              />
            </>
          ),
          right: <ArticlePage />,
        };
      case PAGES.METROSTOP:
        return {
          left: (
            <>
              <img
                src={legend}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[30%] translate-y-[-50%]"
                alt="Metromap legend"
              />
              <img
                src={connection}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[50%] translate-y-[-50%]"
                alt="Sample stations"
              />
            </>
          ),
          right: <MetroStopPage />,
        };
      case PAGES.METROLINES:
        return {
          left: (
            <>
              <img
                src={branching}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[47%] translate-y-[-50%]"
                alt="Sample metromap"
              />
            </>
          ),
          right: <MetroLinesPage />,
        };
      case PAGES.FINAL:
        return {
          left: (
            <>
              <img
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[47%] translate-y-[-50%]"
                src={mappng}
                alt="Sample metromap"
              />
              <img
                src={legend}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[77%] translate-y-[-50%]"
                alt="Metromap legend"
              />
            </>
          ),
          right: <FinalPage />,
        };

      default:
        return;
    }
  };

  const page = selectPage();

  return (
    <>
      <div className="h-[100vh] w-[100vw] flex overflow-hidden absolute top-0 left-0">
        <div className="w-1/2 m-[3%] ">{page.left}</div>
        <div
          className="overflow-y-auto scrollbar w-1/2 m-[3%] px-[2%] pb-[25px]"
          style={{ direction: "rtl" }}
        >
          <div className="" style={{ direction: "ltr" }}>
            {page.right}
          </div>
        </div>
        <div className="absolute w-full px-[5%] bottom-[3%]">
          {/* <div className="text-white text-base mt-[3%] ">
              Tap here to progress through the user guide
            </div> */}
          <NavigationBar
            currentPage={currentPage}
            totalPages={TOTAL_SLIDES}
            handleNext={handleNext}
            handlePrev={handlePrev}
            isConfirmed={isConfirmed}
          />
        </div>
        {currentPage === TOTAL_SLIDES && isConfirmed && (
          <NavigationButton
            onClick={() => setStart(true)}
            className={`right-[2%] top-[50%]`}
            isVisible={true}
          >
            Start
            <FaArrowAltCircleRight size={40} />
          </NavigationButton>
        )}
      </div>
    </>
  );
}

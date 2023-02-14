import React, { useState } from "react";
import Menu from "./components/Menu";
import IntroMetroMapWrapper from "./components/IntroMetroMapWrapper";
import METROMAPS from "./utilities/metromaps";
import { useWindowSize } from "react-use";
import mixpanel from "mixpanel-browser";
// 9c5e78500fd3d59204909acfdd2784b8
mixpanel.init("test", {
  debug: true,
  ignore_dnt: true,
});

export default function App() {
  mixpanel.track("app loaded");

  const [start, setStart] = useState(false);

  const { width, height } = useWindowSize();

  return (
    <Menu
      metromaps={METROMAPS}
      width={width}
      height={height}
      setStart={setStart}
    />
  );

  // return (
  //   <>
  //     {start ? (
  //       <Menu
  //         metromaps={METROMAPS}
  //         width={width}
  //         height={height}
  //         setStart={setStart}
  //       />
  //     ) : (
  //       <IntroMetroMapWrapper setStart={setStart} />
  //     )}
  //   </>
  // );
}

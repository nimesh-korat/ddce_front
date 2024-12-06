import Lottie from "lottie-react";
import React from "react";
import animationData from "./preloader-unity.json";

function Preloader() {
  return (
    <>
      <div id="preloader">
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          onComplete={() => {
            console.log("anmation");
          }}
          
          goToAndPlay={100}
          style={{ width: 200, height: 200 }}
        />
      </div>
    </>
  );
}

export default Preloader;

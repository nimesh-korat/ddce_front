import Lottie from "lottie-react";
import React from "react";
import "./preloader.css";
import animationData from "../preloader-unity.json";

function Preloader() {
  return (
    <>
      <div className="preloader">
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          onComplete={() => {
            console.log("anmation");
          }}
          style={{ width: 200, height: 200 }}
        />
      </div>
    </>
  );
}

export default Preloader;

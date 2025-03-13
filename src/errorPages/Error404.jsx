import React from "react";
import { Link } from "react-router-dom";
import "./css/error404.css";

function Error404() {
  return (
    <>
      <main className="row align-items-center justify-content-center text-center">
        <img
          className="w-25 mt-10 unselectable errorAnimation"
          src="../assets/images/error/error404.png"
          draggable="false"
          alt=""
        />
        <h1 className="text-gray-900 unselectable">404</h1>
        <h2 className="text-18 text-gray-600 unselectable">Page not found</h2>
        <Link className="text-18 text-gray-600" to="/">
          <span className="hover-text-main-600 unselectable">Go Back</span>
        </Link>
      </main>
    </>
  );
}

export default Error404;

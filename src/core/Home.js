import React, { useState, useEffect } from "react";
import "../styles.css";
import Menu from "./Menu";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

const cookies = new Cookies();

export default function Home() {
  const [error, setError] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    let token = cookies.get("token");
    if (token) {
      console.log("hello");
      setToken(token);
    }
  });

  const homeButton = () => {
    return (
      <Link
        style={{
          borderRadius: "40px",
          background: "#F72D2D",
          color: "#ffffff",
          fontSize: "30px",
        }}
        className="btn shadow text-center mt-4"
        to="/signin"
      >
        Login to Get Started
      </Link>
    );
  };

  return (
    <div>
      <div className="homeD">
        <div className="heroSection">
          <div className="container pt-4">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="text-center font-weight-bold">Job Portal for Everyone</h1>
                <h5 className="text-center">Get your dream job. Create your free account and apply to jobs now!</h5>
                {homeButton()} <br />
                <img src="/home.jpg" className="homeImg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="homeM">
        <div className="container pb-4" style={{ minHeight: "100vh" }}>
          <Menu />

          <div className="row">
            <div className="col-md-12 col-sm-12 text-center">
              <img src="/images/clipboard.png" className="homeImgM shadow" />
            </div>
            <div className="col-md-12 col-sm-12 text-center">
              <p className="textLM">
                Manage Your <br /> Projects
                <br /> Efficiently
              </p>
              {homeButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

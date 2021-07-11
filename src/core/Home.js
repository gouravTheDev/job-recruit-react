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
        className="btn shadow"
        to="/user/todo"
      >
       {token ? 'Projects' : 'Get Started'} 
      </Link>
    );
  };

  return (
    <div>
      <div className="homeD">
        <div className="v101_2">
          <div className="v101_3"></div>
          <Menu />
          <div className="container">
            <div className="row">
              <div className="col-md-5 col-sm-12">
                <p className="textL">
                  Manage Your <br /> Projects
                  <br /> Efficiently
                </p>
                {homeButton()}
              </div>
              <div className="col-md-7 col-sm-12 text-left">
                <img src="/images/clipboard.png" className="homeImg" />
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
              <img src="/images/clipboard.png" className="homeImgM" />
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

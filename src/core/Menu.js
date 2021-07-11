import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAutheticated } from "../auth/helper";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#2ecc72" };
  } else {
    return { color: "#FFFFFF" };
  }
};

const Menu = ({ history }) => (
  <div>
    <ul
      className="nav nav-tabs bg-dark py-2 bg-transparent"
      style={{ borderBottom: "0px" }}
    >
      <a
        className="ml-3 navbar-brand btn btn-primary"
        href="#"
        style={{ borderRadius: "24px" }}
      >
        POLO
      </a>
      {!isAutheticated() && (
        <Fragment>
          <li className="nav-item ml-auto mr-2">
            <Link
              style={currentTab(history, "/signup")}
              style={{
                borderRadius: "30px",
                background: "#F72D2D",
                color: "#ffffff",
                fontSize: "20px",
              }}
              className="btn"
              to="/signup"
            >
              Signup
            </Link>
          </li>
          <li className="nav-item">
            <Link
              style={currentTab(history, "/signin")}
              style={{
                borderRadius: "30px",
                background: "#F72D2D",
                color: "#ffffff",
                fontSize: "20px",
              }}
              className="btn"
              to="/signin"
            >
              Login
            </Link>
          </li>
        </Fragment>
      )}
      {isAutheticated() && (
        <li className="nav-item ml-auto mr-3">
          <span
            className="btn"
            style={{ cursor: "pointer" }}
            style={{
              borderRadius: "30px",
              background: "#F72D2D",
              color: "#ffffff",
              fontSize: "20px",
            }}
            onClick={() => {
              signout(() => {
                history.push("/");
              });
            }}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);

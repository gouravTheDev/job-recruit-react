import React from "react";
import Menu from "./Menu";

const Base = ({
  title = "My Title",
  description = "My desription",
  className = "pt-4",
  children,
}) => (
  <div className="baseClass">
    <Menu />
    <div className="container">
      <h1 className="text-center mt-4">{title}</h1>
      <div className={className}>{children}</div>
    </div>
  </div>
);

export default Base;

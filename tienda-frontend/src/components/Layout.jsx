import React from "react";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className="container mt-4">{children}</div>
    </>
  );
};

export default Layout;

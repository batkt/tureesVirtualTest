import React from "react";
import SanalaGomdol from "./dedKheseg/SanalaGomdol";
import Daalgavar from "./dedKheseg/Daalgavar";
function index({ turul, ...busad }) {
  if (turul === "daalgavar") return <Daalgavar {...busad} />;
  return <SanalaGomdol {...busad} />;
}

export default index;

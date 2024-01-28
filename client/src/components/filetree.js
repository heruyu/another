import React, { useState } from "react";
import axios from "axios";
const SERVER_URL = "http://127.0.0.1:5000";

// axios.defaults.timeout = 1000 * 60;
function FileTree() {
  const [Tree, setTree] = useState();
  axios
    .get(`${SERVER_URL}/filetree`)
    .then((response) => {
      console.log(response.data);
      setTree(response.data.text);
    })
    .catch((err) => {
      console.log(err);
    });
  return (
    <>
      <h1>File Tree</h1>
      <div>{Tree}</div>
    </>
  );
}

export default FileTree;

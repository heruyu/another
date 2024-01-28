import React, { useState } from "react";
import axios from "axios";
const SERVER_URL = "http://127.0.0.1:5000";

function FileView() {
  // const [Word, setWord] = useState([]);
  // // const [File, setFile] = useState([]);
  // axios
  //   .get(`${SERVER_URL}/search_view`)
  //   .then((response) => {
  //     if (response.data) {
  //       setWord(response.data.word);
  //     }
  //     console.log(response.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  return (
    <>
      <h1>Search results for word</h1>
    </>
  );
}

export default FileView;

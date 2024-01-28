import React, { useState } from "react";
import axios from "axios";
const SERVER_URL = "http://127.0.0.1:5000";
// CONNECTION_STRING = "mongodb://localhost:27017";

function SearchBar() {
  const [ResFiles, setResFiles] = useState([{}]);
  const handleSearch = () => {
    const searchword = document.getElementById("search").value;
    const sendWord = { word: searchword };
    if (sendWord) {
      axios
        .post(`${SERVER_URL}/search_view`, sendWord, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          // console.log(response.data.all);
          setResFiles(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <h1 className="font-medium uppercase leading-normal text-white">
        File Search
      </h1>
      <input
        type="text"
        id="search"
        className="inline-block rounded bg-primary px-4 pb-2 pt-2 text-xs"
      ></input>
      <button
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-500 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        onClick={handleSearch}
      >
        search
      </button>
      <div>{View(ResFiles[1])}</div>
    </>
  );
}

function View(record) {
  if (record) {
    return (
      <>
        <h2>{record.basename}</h2>
      </>
    );
  }
  return (
    <>
      <h1>nothing</h1>
    </>
  );
}

export default SearchBar;

import React, { useState } from "react";
import axios from "axios";
const SERVER_URL = "http://127.0.0.1:5000";
// CONNECTION_STRING = "mongodb://localhost:27017";

function SearchBar() {
  const [ResFiles, setResFiles] = useState([]);
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
          setResFiles(response.data.all);
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
      <div>
        {Object.entries(ResFiles).map(([key, value]) => View(ResFiles[key]))}
      </div>
    </>
  );
}

function View(record) {
  if (record) {
    const keywords = record.keywords.map((keyword) => (
      <div className="flex-auto bg-slate-500 my-1 p-1">{keyword}</div>
    ));
    return (
      <>
        <div className="rounded bg-neutral-700 px-6 pb-2 pt-2.5 my-2 text-white grid grid-cols-2">
          <div className="w-3/4">
            <h2>{record["main title"]}</h2>
          </div>
          <div className="uppercase text-xs">{keywords}</div>
        </div>
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

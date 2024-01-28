import React from "react";
import "./assets/main.css";
import Upload from "./components/upload";
import FileTree from "./components/filetree";
import SearchBar from "./components/searchbar";
import FileView from "./components/fileview";

function App() {
  // const [data, setData] = useState([{}]);
  // useEffect(() => {
  //   fetch("/")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data);
  //       console.log(data);
  //     });
  // }, []);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-l from-cyan-600 via-sky-400 to-indigo-300">
        <div className="px-4 py-4 grid grid-cols-2 grid-rows-1 gap-4">
          <div>
            <SearchBar></SearchBar>
            <FileView></FileView>
          </div>
          <div className=" mb-2 grid grid-cols-1 grid-rows-2 gap-4">
            <div>
              <Upload></Upload>
            </div>
            <div>{/* <FileTree></FileTree> */}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

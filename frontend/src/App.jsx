import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/signup";
import Roadmap from "./pages/Roadmap";
import Search from "./pages/Search";
function App() {
  return (
    <div
      style={{ backgroundColor: "#2f0553", minHeight: "100vh", color: "white" }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/roadmap/:slug" element={<Roadmap />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

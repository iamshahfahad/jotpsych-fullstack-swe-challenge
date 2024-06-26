import React from "react";
import { Route, Routes  } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Logout from "./components/Logout.tsx";
import Profile from "./components/Profile.tsx";
import AudioRecorder from "./components/AudioRecorder.tsx";

function App() {

  return (
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recorder" element={<AudioRecorder />} />

    </Routes>
  );
}

export default App;

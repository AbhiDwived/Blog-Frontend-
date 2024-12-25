import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ViewBlog from "./components/ViewBlog";
import ProfilePage from "./pages/ProfilePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";

function App() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/update-profile" element={<UpdateProfilePage />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/blog-view/:id" element={<ViewBlog token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;

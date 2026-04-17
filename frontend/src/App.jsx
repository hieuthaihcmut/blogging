import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import PostEditor from "./pages/PostEditor.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import Posts from "./pages/Posts.jsx";
import Questions from "./pages/Questions.jsx";
import QuestionDetail from "./pages/QuestionDetail.jsx";
import QuestionEditor from "./pages/QuestionEditor.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/my-blog" element={<Posts personalMode />} />
      <Route path="/posts" element={<Navigate to="/my-blog" replace />} />
      <Route path="/questions" element={<Questions />} />
      <Route path="/questions/new" element={<QuestionEditor />} />
      <Route path="/questions/:id" element={<QuestionDetail />} />
      <Route path="/posts/new" element={<PostEditor />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/:id/edit" element={<PostEditor />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

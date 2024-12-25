import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewBlog = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs(id);
  }, [id]);

  const fetchBlogs = async (id) => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const blogData = response.data.blogs;

      const filterData = blogData.find((item) => item.id === id);
      setBlogs(filterData);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <img src={blogs.image} alt="" style={{ width: "21rem" }} />
          <h3>{blogs.title}</h3>
          <p>{blogs.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;

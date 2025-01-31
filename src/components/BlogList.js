import React, { useEffect, useState } from "react";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("https://blog-server-rfve.onrender.com/blogs");
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`https://blog-server-rfve.onrender.com/blogs/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (error) {
        console.error("Failed to delete blog", error);
      }
    }
  };

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <p>{blog.description}</p>
          <img src={`https://blog-server-rfve.onrender.com/${blog.image}`} alt={blog.title} />
          <button onClick={() => handleDelete(blog._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BlogList;

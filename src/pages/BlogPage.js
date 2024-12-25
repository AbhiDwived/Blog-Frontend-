import React, { useEffect, useState } from "react";
import axios from "axios";

const BlogPage = ({ match }) => {
  const [blog, setBlog] = useState(null);
  const blogId = match.params.id;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `https://blog-server-rfve.onrender.com/blogs/${blogId}`
        );
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog", error);
      }
    };

    fetchBlog();
  }, [blogId]);

  return (
    <div>
      {blog && (
        <div>
          <h1>{blog.title}</h1>
          <img
            src={`https://blog-server-rfve.onrender.com/api/${blog.image}`}
            alt={blog.title}
          />
          <p>{blog.description}</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;

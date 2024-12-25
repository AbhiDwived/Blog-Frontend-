import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("description", description);

    try {
      if (isEditMode && currentBlogId) {
        await axios.put(
          `http://localhost:5000/api/blogs/${currentBlogId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Blog updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/blogs", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Blog added successfully!");
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add or update blog");
    }
  };

  const resetForm = () => {
    setTitle("");
    setImage(null);
    setDescription("");
    setError("");
    setIsEditMode(false);
    setCurrentBlogId(null);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUser();
      fetchBlogs();
    }
  }, [token, navigate]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.data.user);
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogData = await axios.get("http://localhost:5000/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogData.data.blogs);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setIsEditMode(true);
    setCurrentBlogId(blog.id);
    setTitle(blog.title);
    setDescription(blog.description);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog.id !== id));
      console.log(`Blog with id: ${id} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete blog with id: ${id}`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const imageUrl = `http://localhost:5000/uploads/${user.profileImage}`;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          {loading ? (
            <p>Loading...</p>
          ) : user ? (
            <div>
              <h1>Welcome, {user.email}</h1>
            </div>
          ) : (
            <p>No user data found.</p>
          )}
        </div>
        <div className="col-md-4 d-flex justify-content-end align-items-center">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img
              src={imageUrl}
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{
                width: "100px",
                borderRadius: "50%",
                height: "6rem",
                objectFit: "cover",
              }}
            />
            <div className="dropdown">
              <button
                className="custom-dropdown-button"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.email}
              </button>
              <ul
                className="dropdown-menu custom-dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-center">
        <div className="card mt-2" style={{ width: "350px" }}>
          <div className="card-body">
            <h3 className="card-title">
              {isEditMode ? "Edit Blog" : "Add New Blog"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <label htmlFor="title" className="form-label">
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-2">
                <label htmlFor="description" className="form-label">
                  Blog Description
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group mb-2">
                <label htmlFor="image" className="form-label">
                  Blog Image
                </label>
                <input
                  type="file"
                  id="image"
                  className="form-control"
                  onChange={handleImageChange}
                  required={!isEditMode}
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">
                {isEditMode ? "Update Blog" : "Add Blog"}
              </button>
              {isEditMode && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div>
          <h2>All Blogs</h2>
        </div>
        <div className="row">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div className="card m-2" key={index} style={{ width: "18rem" }}>
                <img
                  className="card-img-top"
                  src={blog.image}
                  alt="Card image cap"
                  style={{ height: "15rem", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">{blog.description}</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary ">
                      <Link
                        to={`/blog-view/${blog.id}`}
                        style={{ color: "white", textDecoration: "none" }}
                      >
                        View Blog
                      </Link>
                    </button>

                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

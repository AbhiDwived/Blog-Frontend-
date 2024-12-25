import axios from "axios";

const API_URL = "https://blog-server-rfve.onrender.com/api/blogs";

export const getBlogs = async () => {
  return await axios.get(API_URL);
};

export const getBlogById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

export const addBlog = async (blogData, token) => {
  return await axios.post(API_URL, blogData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateBlog = async (id, blogData, token) => {
  return await axios.put(`${API_URL}/${id}`, blogData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteBlog = async (id, token) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

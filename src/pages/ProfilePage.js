import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  if (!user) return <p>No user data found.</p>;

  return (
    <div className="container mt-4">
      <h1>Profile</h1>
      <div
        className="row"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="col-md-4">
          <div className="card" style={{ width: "15rem" }}>
            <img
              src={`http://localhost:5000/uploads/${user.profileImage}`}
              alt="Profile"
              className="card-img-top"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
            <div className="card-body">
              <p className="card-text">Email: {user.email}</p>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateProfile}
                >
                  Update Profile
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

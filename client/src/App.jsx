 import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
  const BACKEND_URL = "https://civic-fix-i02b.onrender.com";

const COMPLAINT_API = `${BACKEND_URL}/api/complaints`;
const AUTH_API = `${BACKEND_URL}/api/auth`;
function App() {
  const [complaints, setComplaints] = useState([]);

  const [activePage, setActivePage] = useState("home");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [complaintData, setComplaintData] = useState({
  name: "",
  title: "",
  category: "Road",
  location: "",
  description: "",
  imageUrl: "",
});
  const [searchTerm, setSearchTerm] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");
const [statusFilter, setStatusFilter] = useState("All");

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState("");

  // ---------------- COMPLAINT FUNCTIONS ----------------

  const getComplaints = async () => {
    try {
      const response = await axios.get(COMPLAINT_API);
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleComplaintChange = (e) => {
    setComplaintData({
      ...complaintData,
      [e.target.name]: e.target.value,
    });
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first to submit a complaint.");
      setActivePage("login");
      return;
    }
 try {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("name", user.name);
  formData.append("title", complaintData.title);
  formData.append("category", complaintData.category);
  formData.append("location", complaintData.location);
  formData.append(
    "description",
    complaintData.description
  );

  if (selectedImage) {
    formData.append("image", selectedImage);
  }

  await axios.post(
    COMPLAINT_API,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("Complaint submitted successfully!");
     
 setComplaintData({
  name: "",
  title: "",
  category: "Road",
  location: "",
  description: "",
  imageUrl: "",
});
setSelectedImage(null);
setImagePreview("");

      getComplaints();
      setActivePage("complaints");
     } catch (error) {
  console.error("Complaint Error:", error);

  console.log("Response Data:", error.response?.data);
  console.log("Response Status:", error.response?.status);

  alert(
    error.response?.data?.message ||
    `Error Status: ${error.response?.status || "Network Error"}`
  );
}

};

  // ---------------- STATUS / DELETE ----------------

  const updateStatus = async (id, status) => {
  try {
    await axios.put(
      `${COMPLAINT_API}/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    getComplaints();
  } catch (error) {
    console.error(error);
    alert("Could not update status!");
  }
};

  const deleteComplaint = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this complaint?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `${COMPLAINT_API}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    getComplaints();
  } catch (error) {
    console.error(error);
    alert("Could not delete complaint!");
  }
};

  // ---------------- REGISTER ----------------

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${AUTH_API}/register`, registerData);

      alert("Registration successful! Please login.");

      setRegisterData({
        name: "",
        email: "",
        password: "",
      });

      setActivePage("login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed!"
      );
    }
  };

  // ---------------- LOGIN ----------------

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${AUTH_API}/login`,
        loginData
      );

      const loggedInUser = response.data.user;

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);

      alert(`Welcome ${loggedInUser.name}!`);

      setLoginData({
        email: "",
        password: "",
      });

      setActivePage("home");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login failed!"
      );
    }
  };

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setActivePage("home");

    alert("Logged out successfully!");
  };

  useEffect(() => {
    getComplaints();
  }, []);

  // ---------------- HOME ----------------
const renderHome = () => (
  <section className="home-premium">

    <div className="home-overlay"></div>
     <div className="city-animation">

  <div className="sun"></div>

  <div className="building building-one"></div>
  <div className="building building-two"></div>
  <div className="building building-three"></div>

  <div className="road">
    <div className="road-line"></div>

    <div className="car car-one">
      🚗
    </div>

    <div className="car car-two">
      🚙
    </div>

  </div>

</div> 

    <div className="home-content-premium">
     

      <div className="home-badge">
        🏙️ Smart Civic Reporting System
      </div>

      <h1>
        Make Your City
        <span> Better Together.</span>
      </h1>

      <p>
        Report civic problems around you and help create a
        cleaner, safer and better community.
      </p>

      <div className="home-buttons">

        <button
          className="home-primary-btn"
          onClick={() => setActivePage("report")}
        >
          📝 Report a Problem
        </button>

        <button
          className="home-secondary-btn"
          onClick={() => setActivePage("complaints")}
        >
          📋 View Complaints
        </button>

      </div>

       <div className="home-features">

  <button
    className="feature-item"
    onClick={() => setActivePage("report")}
  >
    <span>⚡</span>
    <div>
      <strong>Easy Reporting</strong>
      <small>Report problems quickly</small>
    </div>
  </button>

  <button
    className="feature-item"
    onClick={() => {
      if (user) {
        setActivePage("myComplaints");
      } else {
        setActivePage("login");
      }
    }}
  >
    <span>📍</span>
    <div>
      <strong>Track Complaints</strong>
      <small>Monitor complaint status</small>
    </div>
  </button>

  <button
    className="feature-item"
    onClick={() => setActivePage("complaints")}
  >
    <span>🌱</span>
    <div>
      <strong>Better Community</strong>
      <small>Build a better city</small>
    </div>
  </button>

</div>
    </div>

  </section>
);
    
  // ---------------- REPORT PAGE ----------------

  const renderReport = () => (
    <section className="report-section">
      <div className="form-box">
        <h2>Report a Civic Problem</h2>

        <form onSubmit={handleComplaintSubmit}>
          <label>Problem Title</label>

          <input
            type="text"
            name="title"
            placeholder="Example: Large pothole on main road"
            value={complaintData.title}
            onChange={handleComplaintChange}
            required
          />

          <label>Category</label>

          <select
            name="category"
            value={complaintData.category}
            onChange={handleComplaintChange}
          >
            <option value="Road">Road Problem</option>
            <option value="Garbage">Garbage Problem</option>
            <option value="Street Light">Street Light</option>
            <option value="Drainage">Drainage Problem</option>
            <option value="Water">Water Problem</option>
            <option value="Other">Other</option>
          </select>

          <label>Location</label>

          <input
            type="text"
            name="location"
            placeholder="Enter problem location"
            value={complaintData.location}
            onChange={handleComplaintChange}
            required
          />

          <label>Description</label>

          <textarea
            name="description"
            placeholder="Describe the problem..."
            value={complaintData.description}
            onChange={handleComplaintChange}
            required
          />
 <label>Upload Complaint Image (Optional)</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }}
/>

{imagePreview && (
  <div className="image-preview">
    <img
      src={imagePreview}
      alt="Complaint Preview"
    />
  </div>
)}

          <button type="submit">
            Submit Complaint
          </button>
        </form>
      </div>
    </section>
  );

  // ---------------- COMPLAINT PAGE ----------------
const renderMyComplaints = () => {
  if (!user) {
    return (
      <section className="complaints-section">
        <h2>My Complaints</h2>
        <p className="no-complaint">
          Please login to see your complaints.
        </p>
      </section>
    );
  }

  const myComplaints = complaints.filter(
    (complaint) =>
      complaint.name?.toLowerCase() ===
      user.name?.toLowerCase()
  );

  return (
    <section className="complaints-section">
      <h2>My Complaints</h2>

      {myComplaints.length === 0 ? (
        <p className="no-complaint">
          You have not submitted any complaints yet.
        </p>
      ) : (
        <div className="complaint-grid">
          {myComplaints.map((complaint) => (
            <div
              className="complaint-card"
              key={complaint._id}
            >
              <h3>{complaint.title}</h3>
              {complaint.imageUrl && (
  <img
    src={complaint.imageUrl}
    alt={complaint.title}
    className="complaint-image"
  />
)}

              <p>
                <strong>Category:</strong>{" "}
                {complaint.category}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {complaint.location}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {complaint.description}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="status">
                  {complaint.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
  const renderDashboard = () => {
  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage and monitor all civic complaints.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card total-card">
          <h3>Total Complaints</h3>
          <p>{totalComplaints}</p>
        </div>

        <div className="dashboard-card pending-card">
          <h3>Pending</h3>
          <p>{pendingComplaints}</p>
        </div>

        <div className="dashboard-card progress-card">
          <h3>In Progress</h3>
          <p>{inProgressComplaints}</p>
        </div>

        <div className="dashboard-card resolved-card">
          <h3>Resolved</h3>
          <p>{resolvedComplaints}</p>
        </div>
      </div>

      <div className="dashboard-recent">
        <h2>All Complaints</h2>

        {complaints.length === 0 ? (
          <p>No complaints available.</p>
        ) : (
          <div className="dashboard-complaints">
            {complaints.map((complaint) => (
              <div
                className="dashboard-complaint-card"
                key={complaint._id}
              >
                <div>
                  <h3>{complaint.title}</h3>

                  <p>
                    <strong>Category:</strong>{" "}
                    {complaint.category}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {complaint.location}
                  </p>

                  <p>
                    <strong>Reported By:</strong>{" "}
                    {complaint.name}
                  </p>
                </div>

                <div className="dashboard-actions">
                  <span className="dashboard-status">
                    {complaint.status}
                  </span>

                  <select
                    value={complaint.status}
                    onChange={(e) =>
                      updateStatus(
                        complaint._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteComplaint(complaint._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
const filteredComplaints = complaints.filter((complaint) => {
  const matchesSearch =
    complaint.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    complaint.location
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    complaint.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesCategory =
    categoryFilter === "All" ||
    complaint.category === categoryFilter;

  const matchesStatus =
    statusFilter === "All" ||
    complaint.status === statusFilter;

  return (
    matchesSearch &&
    matchesCategory &&
    matchesStatus
  );
}); 
 
 const renderComplaints = () => (
  <section className="complaints-section">
    <h2>All Civic Complaints</h2>

    <div className="filter-container">
      <input
        type="text"
        placeholder="Search by title, location or reporter..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Road">Road</option>
        <option value="Water">Water</option>
        <option value="Garbage">Garbage</option>
        <option value="Electricity">Electricity</option>
        <option value="Street Light">Street Light</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>
    </div>

    {filteredComplaints.length === 0 ? (
      <p className="no-complaint">
        No complaints found.
      </p>
    ) : (
      <div className="complaint-grid">
        {filteredComplaints.map((complaint) => (
          <div
            className="complaint-card"
            key={complaint._id}
          >
            <h3>{complaint.title}</h3>
            {complaint.imageUrl && (
  <img
    src={complaint.imageUrl}
    alt={complaint.title}
    className="complaint-image"
  />
)}

            <p>
              <strong>Reported By:</strong>{" "}
              {complaint.name}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {complaint.category}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {complaint.location}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {complaint.description}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="status">
                {complaint.status}
              </span>
            </p>
            {complaint.createdAt && (
  <p className="complaint-date">
    <strong>Reported:</strong>{" "}
    {new Date(complaint.createdAt).toLocaleString()}
  </p>
)}

            {user?.role === "admin" && (
              <div className="complaint-actions">
                <select
                  value={complaint.status}
                  onChange={(e) =>
                    updateStatus(
                      complaint._id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteComplaint(complaint._id)
                  }
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </section>
);
  // ---------------- REGISTER PAGE ----------------

  const renderRegister = () => (
    <section className="auth-section">
      <div className="auth-box">
        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>
          <label>Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={registerData.name}
            onChange={handleRegisterChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />

          <button type="submit">
            Register
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <button
            className="text-button"
            onClick={() => setActivePage("login")}
          >
            Login
          </button>
        </p>
      </div>
    </section>
  );

  // ---------------- LOGIN PAGE ----------------

  const renderLogin = () => (
    <section className="auth-section">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <button
            className="text-button"
            onClick={() => setActivePage("register")}
          >
            Register
          </button>
        </p>
      </div>
    </section>
  );

  // ---------------- MAIN RENDER ----------------

  return (
    <div className="app">
     <header className="header">

  <button
    className="brand"
    onClick={() => setActivePage("home")}
  >
    <span className="brand-icon">🏙️</span>

    <span className="brand-text">
      <span className="brand-name">Civic Fix</span>
      <span className="brand-tagline">
        Smart Civic Reporting
      </span>
    </span>
  </button>

  <nav className="main-nav">

    <button
      className={activePage === "home" ? "nav-button active" : "nav-button"}
      onClick={() => setActivePage("home")}
    >
      🏠 Home
    </button>

    <button
      className={activePage === "report" ? "nav-button active" : "nav-button"}
      onClick={() => setActivePage("report")}
    >
      📝 Report Problem
    </button>

    <button
      className={activePage === "complaints" ? "nav-button active" : "nav-button"}
      onClick={() => setActivePage("complaints")}
    >
      📋 Complaints
    </button>

    {user && (
      <button
        className={
          activePage === "myComplaints"
            ? "nav-button active"
            : "nav-button"
        }
        onClick={() => setActivePage("myComplaints")}
      >
        👤 My Complaints
      </button>
    )}

    {user?.role === "admin" && (
      <button
        className={
          activePage === "dashboard"
            ? "nav-button active"
            : "nav-button"
        }
        onClick={() => setActivePage("dashboard")}
      >
        📊 Dashboard
      </button>
    )}

    {user ? (
      <div className="user-area">

        <span className="user-name">
          Hi, {user.name}
        </span>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    ) : (
      <div className="auth-buttons">

        <button
          className="login-button"
          onClick={() => setActivePage("login")}
        >
          Login
        </button>

        <button
          className="register-button"
          onClick={() => setActivePage("register")}
        >
          Register
        </button>

      </div>
    )}

  </nav>
</header>

      {activePage === "home" && renderHome()}
      {activePage === "report" && renderReport()}
      {activePage === "complaints" && renderComplaints()}
      {activePage === "myComplaints" && renderMyComplaints()}
      {activePage === "dashboard" &&
        user?.role === "admin" &&
        renderDashboard()}
      {activePage === "register" && renderRegister()}
      {activePage === "login" && renderLogin()}

      <footer>
        <p>
          © 2026 Civic Fix | Smart Civic Problem Reporting System
        </p>
      </footer>
    </div>
  );
}

export default App;
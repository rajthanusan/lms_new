import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import Navbar from "./navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [birthday, setBirthday] = useState(null);
  const [joindate, setJoindate] = useState(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [handphone, sethandphone] = useState(""); // New state for contact

  // validation
  const [validationErrors, setValidationErrors] = useState({});

 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the password visibility
  };

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://lms-be-beta.vercel.app/api/AllDepartment"); // Replace with your API endpoint
        setDepartments(response.data); // Assuming response data is an array of department names
      } catch (error) {
        console.error("Failed to fetch departments", error);
        toast.error("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!birthday) {
      errors.birthday = "Birth Date is required";
    }

    if (!joindate) {
      errors.joindate = "Join Date is required";
    }

    if (!username) {
      errors.username = "Email / Username is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      errors.username = "Invalid email";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (!handphone) {
      errors.handphone = "handphone number is required";
    }

    if (!department) {
      errors.department = "Department is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "https://lms-be-beta.vercel.app/api/employeeregister",
          {
            username,
            password,
            birthday,
            joindate,
            name,
            department, // Include the department in the submission
            handphone, // Include contact in the submission
          }
        );

        if (response.status === 201) {
          toast.success("Registration successful");
          // Clear form fields
          setUsername("");
          setPassword("");
          setBirthday(null);
          setJoindate(null);
          setName("");
          setDepartment("");
          sethandphone(""); // Clear contact field
          setValidationErrors({});

          window.location.href = "./login";
        }
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Registration failed, please try again");
      }
    } else {
      setValidationErrors(errors);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container pt-5">
        <div className="row row-grid align-items-center">
          {/* Image Section */}
          <div className="col-12 col-md-5 col-lg-6 text-center">
            <figure className="w-100">
              <img
                src="https://imconnect.in/wp-content/uploads/2024/04/imconnect-employee-location-tracking-app.gif"
                alt="Leave Management"
                className="img-fluid mw-md-120"
              />
            </figure>
          </div>

          {/* Form Section */}
          <div className="col-12 col-md-7 col-lg-6">
            <Card className="shadow-lg registration-card">
              <h1 className="text-center mb-4" style={{ color: "darkblue" }}>
                Register
              </h1>
              <hr />
              <form onSubmit={handleSubmit} className="p-fluid">
  {/* Full Name Field */}
  <div>
    <div className="p-inputgroup flex-1">
      <span className="p-inputgroup-addon">
        <i className="pi pi-user"></i>
      </span>
      <InputText
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setValidationErrors((prev) => ({ ...prev, name: undefined })); // Clear error for name
        }}
        className={validationErrors.name ? "p-invalid" : ""}
        placeholder="Full Name"
      />
    </div>
    <div>
      {validationErrors.name && (
        <small className="p-error">{validationErrors.name}</small>
      )}
    </div>
  </div>
  <br />

  {/* Handphone Field */}
  <div>
    <div className="p-inputgroup flex-1">
      <span className="p-inputgroup-addon">
        <i className="pi pi-phone"></i>
      </span>
      <InputText
        value={handphone}
        onChange={(e) => {
          sethandphone(e.target.value);
          setValidationErrors((prev) => ({ ...prev, handphone: undefined })); // Clear error for handphone
        }}
        className={validationErrors.handphone ? "p-invalid" : ""}
        placeholder="Contact Number"
      />
    </div>
    {validationErrors.handphone && (
      <small className="p-error">{validationErrors.handphone}</small>
    )}
  </div>
  <br />

  {/* Birthday Field */}
  <div className="row mb-3">
    <div className="col">
      <span className="p-float-label">
        <Calendar
          id="birthday"
          value={birthday ? new Date(birthday) : null}
          onChange={(e) => {
            if (e.value) {
              const formattedDate = e.value.toISOString().split("T")[0];
              setBirthday(formattedDate);
              setValidationErrors((prev) => ({ ...prev, birthday: undefined })); // Clear error for birthday
            }
          }}
          dateFormat="dd/mm/yy"
          className={`custom-calendar ${
            validationErrors.birthday ? "p-invalid" : ""
          }`}
          showIcon
        />
        <label htmlFor="birthday">Birth date</label>
      </span>
      {validationErrors.birthday && (
        <small className="p-error">{validationErrors.birthday}</small>
      )}
    </div>

    {/* Joined Date Field */}
    <div className="col">
      <span className="p-float-label">
        <Calendar
          id="joindate"
          value={joindate ? new Date(joindate) : null}
          onChange={(e) => {
            if (e.value) {
              const formattedDate = e.value.toISOString().split("T")[0];
              setJoindate(formattedDate);
              setValidationErrors((prev) => ({ ...prev, joindate: undefined })); // Clear error for joindate
            }
          }}
          dateFormat="dd/mm/yy"
          className={`custom-calendar ${
            validationErrors.joindate ? "p-invalid" : ""
          }`}
          showIcon
        />
        <label htmlFor="joindate">Joined date</label>
      </span>
      {validationErrors.joindate && (
        <small className="p-error">{validationErrors.joindate}</small>
      )}
    </div>
  </div>

  {/* Department Dropdown */}
  <div>
    <Dropdown
      value={department}
      options={departments}
      onChange={(e) => {
        setDepartment(e.value);
        setValidationErrors((prev) => ({ ...prev, department: undefined })); // Clear error for department
      }}
      placeholder="Select Department"
      className={validationErrors.department ? "p-invalid" : ""}
    />
    {validationErrors.department && (
      <small className="p-error">
        {validationErrors.department}
      </small>
    )}
  </div>
  <br />

  {/* Email Field */}
  <div>
    <div className="p-inputgroup flex-1">
      <span className="p-inputgroup-addon">
        <i className="pi pi-user"></i>
      </span>
      <InputText
        id="email"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setValidationErrors((prev) => ({ ...prev, username: undefined })); // Clear error for username
        }}
        className={validationErrors.username ? "p-invalid" : ""}
        placeholder="Enter Email"
      />
    </div>
    <div>
      {validationErrors.username && (
        <small className="p-error">
          {validationErrors.username}
        </small>
      )}
    </div>
  </div>
  <br />

  {/* Password Field */}
  <div>
      <div className="p-inputgroup flex-1" style={{ position: "relative" }}>
        <span className="p-inputgroup-addon">
          <i className="pi pi-lock"></i>
        </span>
        <InputText
          id="password"
          type={showPassword ? "text" : "password"} // Toggle between text and password
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setValidationErrors((prev) => ({ ...prev, password: undefined })); // Clear error for password
          }}
          className={validationErrors.password ? "p-invalid" : ""}
          placeholder="Password"
          style={{ paddingRight: "45px" }} // Padding for the toggle button
        />
        <button
          type="button"
          onClick={togglePasswordVisibility} // Show/Hide password
          style={{
            position: "absolute",
            right: "10px", // Align the button inside the input box
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 1, // Ensure the button stays on top
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon */}
        </button>
      </div>
      {validationErrors.password && (
        <small className="p-error">
          {validationErrors.password}
        </small>
      )}
    </div>
  <br />

  <Button type="submit" label="Register" className="p-button-primary custom-darkblue-button" />
</form>

            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

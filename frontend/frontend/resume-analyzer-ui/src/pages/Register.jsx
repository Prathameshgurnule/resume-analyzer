import { useState } from "react";
import { registerUser } from "../services/AuthService";
import { Link } from "react-router-dom";
function Register() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const handleChange = (e) => {
  const { name, value } = e.target;

  const newUser = {
    ...user,
    [name]: value
  };

  setUser(newUser);

  setEmailError("");

  // PASSWORD VALIDATION
  if (name === "password" || name === "confirmPassword") {

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (newUser.password && !passwordRegex.test(newUser.password)) {
      setPasswordError(
        "Must be 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character"
      );
    } else if (
      newUser.confirmPassword &&
      newUser.password !== newUser.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || user.name.trim() === "") {
      alert("Name is required");
      return;
    }

    if (!user.email || user.email.trim() === "") {
      alert("Email is required");
      return;
    }

    if (passwordError) {
      alert("Fix password errors first");
      return;
    }

    try {
      const requestData = {
        name: user.name.trim(),
        email: user.email,
        password: user.password
      };

      await registerUser(requestData);

      alert("User Registered Successfully");

    } catch (error) {

  console.error(error);

  console.log(error.response);

  setEmailError(
    error.response?.data || "Registration Failed"
  );
}
  };

  return (
    <div className="container mt-5">

      <div className="card p-4 shadow">

        <h2 className="text-center mb-4">
          User Registration
        </h2>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
            />

            {emailError && (
              <small className="text-danger">
                {emailError}
              </small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
            />

            {/* LIVE ERROR */}
            {passwordError && (
              <small className="text-danger">
                {passwordError}
              </small>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Register
          </button>
<div className="text-center mt-3">
  <p className="mb-1">Already have an account?</p>

  <a href="/login" className="btn btn-outline-secondary w-100">
    Login
  </a>
</div>
        </form>

      </div>

    </div>
  );
}

export default Register;
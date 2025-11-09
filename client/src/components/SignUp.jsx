import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import image from "../assets/image1.png"; 

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard"); 
  };

  // const handleGoogleClick = () => {
  //   console.log("Google auth clicked");
  // };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={image} alt="Join Us Illustration" className="signup-image" />
      </div>

      <div className="signup-right">
        <h2 className="signup-title">Join Us!</h2>
        <h3 className="signup-subtitle">Stay connected, stay productive, and reach milestones together.</h3>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" required />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" required />

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        {/* <div className="google-auth-icon" onClick={handleGoogleClick}>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google Icon"
          />
        </div> */}

        <p className="signin-text">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

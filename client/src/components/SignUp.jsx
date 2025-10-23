import React from "react";
import "../styles/SignUp.css";
import image from "../assets/image2.png"; 

const SignupPage = () => {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={image} alt="Join Us Illustration" className="signup-image" />
      </div>

      <div className="signup-right">
        <h2 className="signup-title">Join Us!</h2>

        <form className="signup-form">
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

        <p className="signin-text">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

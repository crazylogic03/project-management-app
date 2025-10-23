import React from "react";
import "../styles/SignIn.css";
import image from "../assets/image1.png"; 

const SignInPage = () => {
  return (
    <div className="signin-container">
      <div className="signin-right">
        <h2 className="signin-title">Welcome Back!</h2>

        <form className="signin-form">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <p className="signup-text">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>

      <div className="signin-left">
        <img src={image} alt="Sign In Illustration" className="signin-illustration" />
      </div>
    </div>
  );
};

export default SignInPage;

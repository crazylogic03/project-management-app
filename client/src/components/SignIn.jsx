import React from "react";
import "../styles/SignIn.css";
import image from "../assets/image2.png"; 

const SignInPage = () => {
  return (
    <div className="signin-container">
      <div className="signin-right">
        <h2 className="signin-title">Welcome Back!</h2>
        <h3 className="signin-subtitle">
          Take a look at what's happening in your Account
        </h3>

        <form className="signin-form">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <div className="signin-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <p className="signup-text">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>

      <div className="signin-left">
        <img
          src={image}
          alt="Sign In Illustration"
          className="signin-illustration"
        />
      </div>
    </div>
  );
};

export default SignInPage;

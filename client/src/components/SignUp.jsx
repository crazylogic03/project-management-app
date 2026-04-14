import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/SignUp.css";
import image from "../assets/image1.png";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[4].value; // Updated index due to button

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("https://project-management-app-89n4.onrender.com/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("✅ Signup successful");
        navigate("/dashboard");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    let attempts = 0;
    let isAwake = false;

    // Ping the backend until it's awake to avoid Render's sleeping page overlay
    while (!isAwake && attempts < 30) {
      try {
        const res = await fetch("https://project-management-app-89n4.onrender.com/api/users/search?query=wake");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            isAwake = true;
            break;
          }
        }
      } catch (error) {
        // Will fail due to CORS or network when Render shows the sleeping HTML page
      }
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsGoogleLoading(false);
    window.open("https://project-management-app-89n4.onrender.com/api/users/google", "_self");
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={image} alt="Join Us Illustration" className="signup-image" />
      </div>

      <div className="signup-right">
        <h2 className="signup-title">Join Us!</h2>
        <h3 className="signup-subtitle">
          Stay connected, stay productive, and reach milestones together.
        </h3>

        <form className="signup-form" onSubmit={handleSignup}>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" required />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <label>Confirm Password</label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              "Waking up server... (this may take a minute)"
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  style={{ width: 20, height: 20 }}
                />
                Sign up with Google
              </>
            )}
          </button>
        </form>

        <p className="signin-text">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

// Export Signup Component
export default SignupPage;
'use client'

import React, { useState } from 'react';
import { AuthFormContainer } from '../components/AuthFormContainer';
import { SocialIcon } from '../components/SocialIcon';
import { useRouter } from 'next/navigation';


const Page: React.FC = () => {

  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setState] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setState({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await fetch(api_url+'/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.token) {
        // Set JWT as a cookie
        document.cookie = `token=${data.token};path=/; max-age=3600; SameSite=Strict`;
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("first_name", data.first_name.String);
        sessionStorage.setItem("last_name", data.last_name.String);
        sessionStorage.setItem("avatarUrl", data.avatarUrl.String);

        console.log("Login successful!");
        setState({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: ""
        });

        router.push('/');
      } else {
        console.error("Token not received");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("API URL:", api_url);
    try {
      

      // Send the signup data to your API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();

      // Assuming the API returns a JWT in the response
      const token = data.token;

      if (token) {
        // Set JWT as a cookie
        document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;

        console.log("Signup successful!");
        setState({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: ""
        });

        router.push('/');
      } else {
        console.error("Token not received");
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
    }
  };

  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setState({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    })
  };

  return (
    <AuthFormContainer className={isSignUp ? 'right-panel-active' : ''}>
      <div className="form-container sign-up-container">
        <form onSubmit={handleSubmit}>
          <h1 style={{ fontSize: "1.5rem" }}>Create Account</h1>
          <div className="social-media">
            <SocialIcon href="#" className="social">
              <i className="fab fa-google"></i>
            </SocialIcon>
          </div>
          <span >or sign up using your email account</span>
          <input type="text" placeholder="Username" name='username' value={formData.username} onChange={handleChange} required />
          <input type="text" placeholder="First Name" name='first_name' value={formData.first_name} onChange={handleChange} required />
          <input type="text" placeholder="Last Name" name='last_name' value={formData.last_name} onChange={handleChange} required />
          <input type="email" placeholder="Email" name='email' value={formData.email} onChange={handleChange} required />
          <input type="password" placeholder="Password" name='password' value={formData.password} onChange={handleChange} required />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-container log-in-container">
        <form onSubmit={handleLogin}>
          <h1 >Log In</h1>
          <div className="social-media">
            <SocialIcon href="#" className="social">
              <i className="fa-brands fa-google"></i>
            </SocialIcon>

          </div>
          <span>or sign up using your email account</span>
          <input type="email" placeholder="Email" name='email' value={formData.email} onChange={handleChange} required />
          <input type="password" placeholder="Password" name='password' value={formData.password} onChange={handleChange} required />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel left">
            <h1 >Welcome Back!</h1>
            <p >To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={toggleForm}>Log In</button>
          </div>
          <div className="overlay-panel right">
            <h1>Howdy, Stranger!</h1>
            <p>Sign up for an account and start your journey now!!</p>
            <button className="ghost" onClick={toggleForm}>Sign Up</button>
          </div>
        </div>
      </div>
    </AuthFormContainer>
  );
};

export default Page;
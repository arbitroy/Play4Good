'use client'

import React, { useState } from 'react';
import * as bcrypt from 'bcryptjs';
import { AuthFormContainer } from '../components/AuthFormContainer';
import { SocialIcon } from '../components/SocialIcon';


const Page: React.FC = () => {
  const [formData, setState] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setState({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getUserFromDB = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/email/${email}`);
      if (!response.ok) {
        throw new Error('User not found or some other error');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      // Retrieve the user data from the database by email
      const user = await getUserFromDB(formData.email);

      if (!user) {
        console.error("User not found");
        return;
      }

      // Assuming user.password contains the hashed password stored in your database
      const storedHashedPassword = user.password_hash;

      // Use bcrypt or a similar library to compare the hashed password
      const isPasswordValid = await bcrypt.compare(formData.password, storedHashedPassword);

      if (isPasswordValid) {
        console.log("Login successful!");
        // Proceed with the login process (e.g., setting a session, redirecting)
        setState({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: ""
        })
      } else {
        console.error("Invalid password");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    //hash password
    const salt = await bcrypt.genSalt(10);
    const passHashed = await bcrypt.hash(formData.password, salt);

    // Create a new object with the hashed password
    const updatedFormData = {
      ...formData,
      password: passHashed,
    };

    // Convert updatedFormData to JSON
    const jsonData = JSON.stringify(updatedFormData);

    try {
      // Send the JSON data to your API
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      const result = await response.json();
      console.log('Success:', result);
      setState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: ""
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }

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
        <form action="#">
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
          <button onClick={handleSubmit}>Sign Up</button>
        </form>
      </div>
      <div className="form-container log-in-container">
        <form action="#">
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
          <button onClick={handleLogin}>Sign In</button>
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
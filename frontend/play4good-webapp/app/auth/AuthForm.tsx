'use client'

import React, { useState } from 'react';
import styled from 'styled-components';

const AuthFormContainer = styled.div`
  position: relative;
  width: 766px;
  max-width: 100%;
  min-height: 480px;
  background-color: white;
  margin: 100px auto;
  border-radius: 10px;
  overflow: hidden;

  a {
    text-decoration: none;
    margin: 20px auto;
    color: inherit;
    font-size: 12px;
  }

  p {
    font-size: 14px;
    font-weight: 100;
    line-height: 1.4;
    margin: 20px;
  }

  .social-media a {
    border: 1px solid #ddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;

    &:hover {
      background-color: lightGray;
    }
  }

  button {
    padding: 12px 45px;
    border-radius: 20px;
    font-family: inherit;
    background-color: #f736ce;
    border: none;
    color: white;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;

    &:hover {
      transform: scale(0.97);
    }

    &.ghost {
      background: transparent;
      border: 1px solid #fff;
      color: #fff;
    }
  }

  .form-container {
    height: 100%;
    position: absolute;
    top: 0;
    transition: all 0.6s ease-in-out;

    form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 50px;
      margin-top: 20px;
    }
  }

  .social-media {
    height: 40px;
    margin: 20px 0;
  }

  span {
    font-size: 12px;
  }

  .form-container input {
    margin: 8px auto;
    width: 100%;
    padding: 12px 15px;
    background-color: #fff;
    border: 1px solid #ddd;
  }

  .log-in-container,
  .sign-up-container {
    width: 50%;
    left: 0;
    height: 100%;
  }

  .sign-up-container {
    opacity: 0;
    z-index: 1;
  }

  .log-in-container {
    z-index: 2;
  }

  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
  }

  .overlay {
    background-image: linear-gradient(to right, #f736ce, #df22a5, #c41280, #a70860, #890544);
    width: 200%;
    height: 100%;
    position: relative;
    left: -100%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }

  .overlay-panel {
    position: absolute;
    top: 0;
    color: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    height: 100%;
    width: 50%;
    text-align: center;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }

  .overlay-panel.right {
    right: 0;
    transform: translateX(0);
  }

  .overlay-panel.left {
    transform: translateX(-20%);
  }

  &.right-panel-active {
    .log-in-container {
      transform: translateY(100%);
    }

    .sign-up-container {
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
    }

    .overlay-container {
      transform: translateX(-100%);
    }

    .overlay {
      transform: translateX(50%);
    }

    .overlay-panel.left {
      transform: translateX(0);
    }

    .overlay-panel.right {
      transform: translateX(20%);
    }
  }
`;



const SocialIcon = styled.a`
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    background-color: #eee;
    transform: translateY(-2px);
  }
`;

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <AuthFormContainer className={isSignUp ? 'right-panel-active' : ''}>
      <div className="form-container sign-up-container">
        <form action="#">
          <h1>Create Account</h1>
          <div className="social-media">
            <SocialIcon href="#" className="social">
              <i className="fab fa-google"></i>
            </SocialIcon>
          </div>
          <span>or sign up using your email account</span>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button>Sign Up</button>
        </form>
      </div>
      <div className="form-container log-in-container">
        <form action="#">
          <h1>Log In</h1>
          <div className="social-media">
            <SocialIcon href="#" className="social">
              <i className="fa-brands fa-google"></i>
            </SocialIcon>

          </div>
          <span>or sign up using your email account</span>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <a href="#">Forgot your password?</a>
          <button>Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
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

export default AuthForm;
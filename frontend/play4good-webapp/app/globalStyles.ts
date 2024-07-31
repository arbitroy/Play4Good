'use client'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

  /* Reset and base styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    line-height: 1.5;
    color: #333333;
    background-color: #ffffff;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5em;
    line-height: 1.2;
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  p {
    margin-bottom: 1em;
  }

  a {
    color: #3498db;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #2980b9;
    }
  }

  /* Button styles */
  .button {
    font-family: 'Nunito', sans-serif;
    display: inline-block;
    position: relative;
    border-radius: 10px;
    text-decoration: none;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.5s ease;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .button:hover {
    text-shadow: 0px 0px 0px rgba(255, 255, 255, 0.8);
  }

  .button:hover::after {
    left: 100%;
    top: 100%;
    bottom: 100%;
    right: 100%;
  }

  .button::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    border-radius: inherit;
    transition: all 0.5s;
  }

  .button::after {
    content: "";
    display: block;
    position: absolute;
    left: 2.5px;
    top: 2px;
    bottom: 2.5px;
    right: 2px;
    z-index: -1;
    border-radius: 8px;
    transition: all 0.5s;
  }

  .button:after,
  .close-btn:after {
    background: #fff;
  }

  .explore,
  .explore:before,
  .close-btn,
  .close-btn:before {
    background: rgba(255, 193, 7, 1);
    background: linear-gradient(
      45deg,
      rgba(255, 193, 7, 1) 0%,
      rgba(255, 87, 34, 1) 100%
    );
    background: -moz-linear-gradient(
      45deg,
      rgba(255, 193, 7, 1) 0%,
      rgba(255, 87, 34, 1) 100%
    );
    background: -webkit-linear-gradient(
      45deg,
      rgba(255, 193, 7, 1) 0%,
      rgba(255, 87, 34, 1) 100%
    );
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Lists */
  ul, ol {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
  }

  th, td {
    padding: 0.5em;
    border: 1px solid #ddd;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Utility classes */
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .hidden { display: none; }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Focus styles for keyboard navigation */
  :focus-visible {
    outline: 2px solid #3498db;
    outline-offset: 2px;
  }

  /* Responsive typography */
  @media (max-width: 480px) {
    html {
      font-size: 14px;
    }
  }
`

export default GlobalStyle
import styled from 'styled-components';


const Button = styled.button`
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
color: transparent;
background-image: linear-gradient(
  45deg,
  rgba(255, 193, 7, 1) 0%,
  rgba(255, 87, 34, 1) 100%
);

&::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: inherit;
  border-radius: inherit;
  z-index: -1;
  transition: all 0.5s ease;
}

&::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 8px;
  z-index: -1;
  transition: all 0.5s ease;
}

&:hover {
  color: white;
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.7);
}

&:hover::before {
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
}

&:hover::after {
  top: 100%;
  left: 100%;
  right: 100%;
  bottom: 100%;
}
`;


export default Button;
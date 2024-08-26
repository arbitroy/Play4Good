import { styled } from "styled-components";

export const SocialIcon = styled.a`
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
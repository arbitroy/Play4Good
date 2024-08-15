'use client'

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import Image from 'next/image';



interface CardProps {
  title: string;
  image: string;
  content: React.ReactNode;
}

const CardWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50% 50%;
  border: 1px solid #000;
  width: 300px;
  aspect-ratio: 1/1;
  color: #fff;
  border-radius: 20px;
  box-shadow: 0 6.7px 5.3px rgba(0, 0, 0, 0.03),
    0 22.3px 17.9px rgba(0, 0, 0, 0.05);
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
  object-position: 50% 50%;
  z-index: 2;
  transition: all 450ms ease-in 200ms;

  ${CardWrapper}:hover & {
    width: 50%;
    height: 50%;
    top: 50%;
    border-radius: 0 0 0 20px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #000;
  border-radius: 20px 20px 0 0;
  text-align: center;
`;

const More = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;
  background-color: #fff;
  border-radius: 0 0 20px 20px;
`;

const ModalOpenButton = styled.button`
    font-family: 'Nunito', sans-serif;
    text-transform: uppercase;
    color: #000;
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    grid-area: 1 / 2 / span 1 / span 1;
`;

interface ModalProps {
  isOpen: boolean;
}

const Modal = styled.div<ModalProps>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
  animation: openModal 0.3s ease-in-out 1 normal;

  @keyframes openModal {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 50%;
  max-width: 500px;
  border-radius: 20px;
  z-index: 30;
  padding: 20px;
`;

const ModalHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  padding: 15px 20px 10px;
  font-size: 1.2rem;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 30px 50px;
  height: 70vh;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 20px;
`;


const Card: React.FC<CardProps> = ({ title, image, content }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <CardWrapper>
        <CardImage src={image} alt={title} />
        <Title>
          <h2>{title}</h2>
        </Title>
        <More>
          <ModalOpenButton onClick={() => setIsModalOpen(true)}>
            more
          </ModalOpenButton>
        </More>
      </CardWrapper>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            {title}
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </ModalHeader>
          <ModalBody>
            <Image src={image} alt={title} />
            {content}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Card;
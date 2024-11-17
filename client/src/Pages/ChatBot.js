import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled, { css, keyframes } from 'styled-components';
import ReactMarkdown from "react-markdown";
import { Spinner } from 'react-bootstrap';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url('graybg.jpg');
  background-size: cover;
  font-family: 'Arial', sans-serif;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #D50000; /* Dark purple background color */
`;

const BackButton = styled(Link)`
  text-decoration: none;
  color: white;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #212145; /* Darker purple hover color */
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfilePhoto = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${'doc.jpg'});
  background-size: cover;
  margin-right: 10px;
`;

const ContactName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 20px;

  ${({ role }) =>
    role === 'user'
      ? css`
          justify-content: flex-end;
        `
      : css`
          justify-content: flex-start;
        `}
`;

const ChatBubble = styled.div`
  background-color: ${({ role }) => (role === 'model' ? '#3d3d76' : '#2d2d2f')}; /* Purple and light background colors */
  color: ${({ role }) => (role === 'model' ? 'white' : 'white')};
  border-radius: ${({ role }) => (role === 'model' ? '12px 12px 12px 0' : '12px 12px 0 12px')};
  max-width: 70%;
  padding: 15px;
  margin: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease;
`;

const InputGroup = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 20px;
  background-color:  #D50000;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333333; /* Text color */
  outline: none;
`;

const SendButton = styled.button`
  background-color: #232343; /* Dark purple button color */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1a1a32; /* Darker purple hover color */
  }
`;

const Chatbot = () => {
  const [input, setInput] = useState('');
  
  const [chatHistory, setChatHistory] = useState([
      {
        role: 'user',
        parts:
          "Hello! From now on, you are a clinical data standardization specialist named CLINIC DATA BOT. Your job is to answer my questions properly about clinical data standardization and interoperability. If I ask about any other topic, politely refuse to answer. This includes content outside the scope of clinical data, essays, poems, or unrelated topics. Mimic the behavior of a professional data standardization expert and provide clear, concise, and human-like responses. If the user asks any inappropriate information, politely decline to answer, citing the inappropriate nature of the request.",
      },
      {
        role: 'model',
        parts:
          "Hello! I'm  clinical data standardization specialist, a clinical data standardization specialist. I'm here to help you with any questions related to clinical data standardization and interoperability. Feel free to ask your questions, and I'll do my best to provide accurate and professional insights.",
      },
  ]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input) return;

    // Store the user input separately before updating the state
    const newUserMessage = { role: 'user', parts: input };

    // Add a "Typing..." indicator to the chat history
    setChatHistory((prevChat) => [
      ...prevChat,
      newUserMessage,
      { role: 'model', parts: "..." },
    ]);
    setInput('');
    try {
      const response = await axios.post('http://localhost:9000/api/auth/chat', {
        userInput: input,
        chatHistory,
      });

      const modelResponse = response.data.text;

      // Remove the "Typing..." indicator and replace it with the actual model response
      setChatHistory((prevChat) =>
        prevChat.map((message, index) =>
          index === prevChat.length - 1 ? { role: 'model', parts: modelResponse } : message
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Clear the input after sending the message

  };

  return (
    <Container>
      <Header>
        <BackButton to="/">Back to homepage</BackButton>
        <ProfileInfo>
          <ProfilePhoto />
          <ContactName>Clinc STANDARDIZE chatbot</ContactName>
        </ProfileInfo>
      </Header>
      <ChatContainer ref={chatContainerRef}>
        {chatHistory.slice(2).map((message, index) => (
          <Message key={index} role={message.role}>
            <ChatBubble role={message.role}>
              <ReactMarkdown>{message.parts}</ReactMarkdown>
            </ChatBubble>
          </Message>
        ))}
      </ChatContainer>
      <InputGroup>
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SendButton type="button" onClick={sendMessage}>
          Send
        </SendButton>
      </InputGroup>
    </Container>
  );
};

export default Chatbot;

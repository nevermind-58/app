import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const wave = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const wobble = keyframes`
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-8px) rotate(-5deg); }
  30% { transform: translateX(6px) rotate(3deg); }
  45% { transform: translateX(-4px) rotate(-2deg); }
  60% { transform: translateX(2px) rotate(1deg); }
  75% { transform: translateX(-1px) rotate(-0.5deg); }
`;

const PromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.7' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
`;

const PixelForm = styled.form`
  width: 100%;
  max-width: 500px;
  padding: 30px;
  background-color: white;
  border: 5px solid #3a86ff;
  box-shadow: 10px 10px 0 rgba(255, 158, 0, 0.5);
  border-radius: 8px;
  animation: ${fadeIn} 0.6s ease-out;
  transition: all 0.3s ease;
  
  @media (max-width: 576px) {
    padding: 20px;
    border-width: 4px;
    box-shadow: 6px 6px 0 rgba(255, 158, 0, 0.5);
  }
`;

const QuestionCard = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 30px;
  background-color: white;
  border: 5px solid #ff527b;
  box-shadow: 10px 10px 0 rgba(255, 158, 0, 0.5);
  border-radius: 8px;
  margin-top: 20px;
  animation: ${bounce} 0.6s ease-out;
  
  @media (max-width: 576px) {
    padding: 20px;
    border-width: 4px;
    box-shadow: 6px 6px 0 rgba(255, 158, 0, 0.5);
  }
`;

const FeedbackCard = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background-color: white;
  border: 5px solid #ffca3a;
  box-shadow: 10px 10px 0 rgba(255, 158, 0, 0.5);
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  animation: ${bounce} 0.6s ease-out;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
  color: #ff527b;
  text-shadow: 2px 2px 0 #ffca3a;
  letter-spacing: 2px;
  font-size: ${props => props.small ? '16px' : '24px'};
  line-height: 1.4;
`;

const ErrorMessage = styled.p`
  color: #ff527b;
  margin-top: 10px;
  font-size: 10px;
  text-align: center;
  animation: ${wobble} 0.5s ease-in-out;
`;

const ColorContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  gap: 8px;
  padding: 5px 0;
`;

const ColorBlock = styled.div`
  width: 30px;
  height: 30px;
  border: 2px solid white;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
  border-radius: 4px;
  background-color: ${props => props.color};
  animation: ${wave} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.index * 0.1}s;
  position: relative;
  
  &:hover {
    animation-play-state: paused;
    transform: scale(1.1) rotate(5deg);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
  
  @media (max-width: 400px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const OptionButton = styled.button`
  flex: 1;
  padding: 15px;
  font-size: 12px;
  background-color: ${props => props.background || '#4cc9f0'};
  box-shadow: 4px 4px 0 ${props => props.shadow || '#ff9e00'};
  color: ${props => props.color || '#333333'};
  border: 3px solid ${props => props.border || '#3a86ff'};
  transition: all 0.2s;
  cursor: pointer;
  font-family: inherit; /* Add this to ensure consistent font */
  font-weight: 600;
  border-radius: 4px;
  
  &:hover {
    transform: translate(2px, 2px) scale(1.05);
    box-shadow: 2px 2px 0 ${props => props.shadow || '#ff9e00'};
  }
`;


const Emoji = styled.span`
  display: inline-block;
  margin-left: 5px;
  font-size: 16px;
`;

const FeedbackMessage = styled.p`
  font-size: 18px;
  color: #333333;
  margin-bottom: 10px;
`;

const ContinueButton = styled(OptionButton)`
  width: 50%;
  margin: 20px auto 0;
  display: block;
  font-size: 14px;
  font-family: inherit;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit; /* Use the same font as parent */
  margin-bottom: 10px;
  
  &:focus {
    border-color: #3a86ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
  }
`;

const SubmitButton = styled(OptionButton)`
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  font-family: inherit;
  font-size: 14px;
  background-color: #4cc9f0;
  border: 3px solid #3a86ff;
  box-shadow: 4px 4px 0 #ff9e00;
  color: white;
  font-weight: 600;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #ff9e00;
  }
`;

const PasswordPrompt = () => {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState(0); // 0 = password, 1 = Q1, 2 = feedback1, 3 = Q2, 4 = feedback2, 5 = Q3, 6 = feedback3
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { login } = useAuth();

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Make sure this matches your password in auth.js
    const correctPassword = 'boobs';
    
    if (enteredPassword === correctPassword) {
      setStage(1); // Move to first question
    } else {
      setError('Incorrect password!');
    }
  };

  const handleOptionClick = (answer, expectedAnswer, nextStage) => {
    if (answer === expectedAnswer) {
      // Show feedback only for correct answers
      setShowFeedback(true);
      
      if (nextStage === 2) {
        setFeedbackMessage("you got that right! yes u my dum cutie");
      } else if (nextStage === 4) {
        setFeedbackMessage("that's right! i'm the smartest");
      } else if (nextStage === 6) {
        setFeedbackMessage("aw yes u are baby");
      }
      
      // Progress to next stage upon clicking continue
    } else {
      // Wrong answer - show error but NO continue button
      setShowFeedback(false); // Don't show feedback card with continue button
      setError("Hmm, try again baby"); // Show error message instead
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setError(''); // Clear any error messages
    
    // Progress based on current stage
    if (stage === 1) {
      setStage(3); // Go to second question after first feedback
    } else if (stage === 3) {
      setStage(5); // Go to third question after second feedback
    } else if (stage === 5) {
      // All questions answered correctly - move to home page
      login('boobs');
    }
  };

  // Password entry form
  if (stage === 0) {
    return (
      <PromptContainer>
        <PixelForm onSubmit={handlePasswordSubmit}>
          <Title>Our Space</Title>
          <ColorContainer>
            <ColorBlock color="#ff527b" index={0} />
            <ColorBlock color="#ffca3a" index={1} />
            <ColorBlock color="#4cc9f0" index={2} />
            <ColorBlock color="#3a86ff" index={3} />
            <ColorBlock color="#8338ec" index={4} />
          </ColorContainer>
          <p style={{ 
            marginBottom: '20px', 
            textAlign: 'center', 
            color: '#333333',
            fontSize: '14px'
          }}>
            Enter password to continue
          </p>
          <FormInput
            type="password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">
            Enter
          </SubmitButton>
        </PixelForm>
      </PromptContainer>
    );
  }
  
  // First question: "who's dumb as rock..." (moved from stage 3 to stage 1)
  if (stage === 1) {
    return (
      <PromptContainer>
        <QuestionCard>
          <Title small>who's dumb as a rock and pea brain sized and trash and garbage and shitty and cute as fuck and my my so hott?</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonsContainer>
            <OptionButton 
              onClick={() => handleOptionClick("me", "me", 2)}
              background="#ff85a1"
              border="#ff527b"
              shadow="#ffca3a"
              color="white"
            >
              me <Emoji>😨</Emoji>
            </OptionButton>
            <OptionButton 
              onClick={() => handleOptionClick("you", "me", 2)}
              background="#8338ec"
              border="#6c11d8"
              shadow="#4cc9f0"
              color="white"
            >
              pff you ofc <Emoji>😌</Emoji>
            </OptionButton>
          </ButtonsContainer>
        </QuestionCard>
        
        {showFeedback && (
          <FeedbackCard>
            <FeedbackMessage>{feedbackMessage}</FeedbackMessage>
            <ContinueButton 
              onClick={handleContinue}
              background="#ffca3a"
              border="#ff9e00"
            >
              Continue <Emoji>➡️</Emoji>
            </ContinueButton>
          </FeedbackCard>
        )}
      </PromptContainer>
    );
  }

  // Second question: "who's smart..." (moved from stage 5 to stage 3)
  if (stage === 3) {
    return (
      <PromptContainer>
        <QuestionCard>
          <Title small>who's smart and way way smarter than u and super smart oh my god would never make a mistake and did i say smart? yeah</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonsContainer>
            <OptionButton 
              onClick={() => handleOptionClick("me", "you", 4)}
              background="#ff85a1"
              border="#ff527b"
              shadow="#ffca3a"
              color="white"
            >
              me <Emoji>🧠</Emoji>
            </OptionButton>
            <OptionButton 
              onClick={() => handleOptionClick("you", "you", 4)}
              background="#8338ec"
              border="#6c11d8"
              shadow="#4cc9f0"
              color="white"
            >
              u <Emoji>👑</Emoji>
            </OptionButton>
          </ButtonsContainer>
        </QuestionCard>
        
        {showFeedback && (
          <FeedbackCard>
            <FeedbackMessage>{feedbackMessage}</FeedbackMessage>
            <ContinueButton 
              onClick={handleContinue}
              background="#ffca3a"
              border="#ff9e00"
            >
              Continue <Emoji>➡️</Emoji>
            </ContinueButton>
          </FeedbackCard>
        )}
      </PromptContainer>
    );
  }
  
    // Third question: "Who's mommy's good boy?" (moved from stage 1 to stage 5)
  if (stage === 5) {
    return (
      <PromptContainer>
        <QuestionCard>
          <Title>Who's mommy's good boy?</Title>
          <p style={{ marginBottom: '30px', textAlign: 'center', color: '#333333', fontSize: '14px' }}>
            Answer correctly to continue
          </p>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonsContainer>
            <OptionButton 
              onClick={() => handleOptionClick("me", "me", 6)}
              background="#ff85a1"
              border="#ff527b"
              shadow="#ffca3a"
              color="white"
            >
              Meeeee <Emoji>🙋‍♂️</Emoji>
            </OptionButton>
            <OptionButton 
              onClick={() => handleOptionClick("you", "you", 6)}
              background="#8338ec"
              border="#6c11d8"
              shadow="#4cc9f0"
              color="white"
            >
              I'm mommy's good boy <Emoji>😊</Emoji>
            </OptionButton>
          </ButtonsContainer>
        </QuestionCard>
        
        {showFeedback && (
          <FeedbackCard>
            <FeedbackMessage>{feedbackMessage}</FeedbackMessage>
            <ContinueButton 
              onClick={handleContinue}
              background="#ffca3a"
              border="#ff9e00"
            >
              You may now enter <Emoji>😏</Emoji>
            </ContinueButton>
          </FeedbackCard>
        )}
      </PromptContainer>
    );
  }

  return null;
};

export default PasswordPrompt;
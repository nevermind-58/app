import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const wobble = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const WelcomeCard = styled.div`
  background: white;
  border: 4px solid #ff527b;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 8px 8px 0 rgba(255, 158, 0, 0.5);
  animation: ${bounce} 1s ease-in-out;
  position: relative;
  overflow: hidden;

  @media (max-width: 576px) {
    padding: 20px 15px;
    border-width: 3px;
    box-shadow: 5px 5px 0 rgba(255, 158, 0, 0.5);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -50px;
    left: -50px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255,202,58,0.3) 0%, rgba(255,202,58,0) 70%);
    border-radius: 50%;
    animation: ${float} 7s infinite ease-in-out;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -30px;
    right: -30px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(76,201,240,0.3) 0%, rgba(76,201,240,0) 70%);
    border-radius: 50%;
    animation: ${float} 5s infinite ease-in-out reverse;
  }
`;

const MoodCard = styled.div`
  background: white;
  border: 4px solid #3a86ff;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 8px 8px 0 rgba(255, 158, 0, 0.5);
  position: relative;
  
  @media (max-width: 576px) {
    padding: 20px 15px;
    border-width: 3px;
    box-shadow: 5px 5px 0 rgba(255, 158, 0, 0.5);
  }
`;

const Greeting = styled.h1`
  color: #ff527b;
  text-shadow: 2px 2px 0 #ffca3a;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    font-size: 1.8rem;
    text-shadow: 1px 1px 0 #ffca3a;
  }
`;

const Message = styled.p`
  font-size: 14px;
  color: #333;
  margin-bottom: 25px;
  line-height: 1.8;
  
  @media (max-width: 576px) {
    font-size: 13px;
    margin-bottom: 15px;
  }
`;

const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  font-size: 28px;
  margin-top: 25px;
`;

const Emoji = styled.span`
  cursor: pointer;
  transition: transform 0.2s;
  animation: 2s infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  
  &:hover {
    transform: scale(1.3) rotate(15deg);
  }
`;

const FloatingHeart = styled.div`
  position: absolute;
  font-size: ${props => props.size || '20px'};
  color: ${props => props.color || '#ff527b'};
  top: ${props => props.top || '10%'};
  left: ${props => props.left || '10%'};
  animation: ${float} ${props => props.duration || '8s'} infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  z-index: -1;
`;

const SliderContainer = styled.div`
  margin: 20px 0 30px;
  position: relative;
  
  @media (max-width: 576px) {
    margin: 15px 0;
  }
`;

const SliderTrack = styled.div`
  width: 100%;
  height: 10px;
  background: linear-gradient(to right, #ff85a1, #ffca3a, #4cc9f0);
  border-radius: 5px;
  border: 2px solid #333;
`;

const SliderThumb = styled.div`
  width: 30px;
  height: 30px;
  background: white;
  border: 3px solid #333;
  border-radius: 50%;
  position: absolute;
  top: -10px;
  left: ${props => props.position}%;
  transform: translateX(-15px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(-15px) scale(1.1);
  }
  
  &:active {
    transform: translateX(-15px) scale(0.95);
  }
`;

const MoodLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const MoodLabel = styled.div`
  font-size: 12px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  span {
    font-size: 18px;
    margin-bottom: 5px;
  }
`;

const MoodResponse = styled.div`
  margin-top: 30px;
  padding: 15px;
  background: ${props => props.bgColor || '#f8f9fa'};
  border: 3px solid ${props => props.borderColor || '#3a86ff'};
  border-radius: 8px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const HugButton = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #ff85a1;
  border: 2px solid #ff527b;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  font-family: inherit; /* Use the same font as parent */
  font-size: 14px; /* Match your app's font size */
  font-weight: 600;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const HugAnimation = styled.div`
  font-size: 60px;
  margin: 20px 0;
  animation: ${wobble} 1s infinite;
  
  @media (max-width: 576px) {
    font-size: 40px;
    margin: 10px 0;
  }
`;

const PromptMessage = styled.p`
  font-size: 14px;
  color: #666;
  font-style: italic;
  margin-top: 20px;
  animation: 2s infinite;
  text-align: center;
`;

const Home = () => {
  const [message, setMessage] = useState("");
  const [greeting, setGreeting] = useState("");
  const [emojis, setEmojis] = useState(["🦎", "😚", "🦆"]);
  const [moodValue, setMoodValue] = useState(50); // middle position by default
  const [showHug, setShowHug] = useState(false);
  const [currentMoodResponse, setCurrentMoodResponse] = useState(""); // Store current mood response
  const [moodSelected, setMoodSelected] = useState(false); // Track if user has selected a mood
  
  // Array of possible greetings and pet names
  const greetings = [
    "Hi baby!",
    "Hey honeybun!",
    "Hello cutie!",
    "Welcome back, babe!",
    "Hey honey!",
    "There's my cutie pie!",
    "oooh pretty boy's here",
    "Hiiii babe!"
  ];
  
  // Array of romantic/cheeky messages
  const messages = [
    "How are you so cute, huh? Oh my god, and so sexy and hot too!",
    "Stop being so cute like do u want me to die????",
    "So adorable and squishable and rufflable and cuddlable and damn fuckable",
    "*clears throat* excuse me pretty boy, can you come closer? yeah a lil bit more mhm *pecks u super hard* mmmmwah",
    "oh oh uk black shirt main maal dikhte ho, kha jaungi nom nom",
    "what else can i call u.. hmmm trashy shitty garbagy poopy dumby lol idk what else",
    "beb, mine, yes u..u are mine",
    "um ok fine take a heart ig ❤️"
  ];

  // Mood-based responses
  const sadResponses = [
    "yayy yay yay",
    "here u go an apple to make u feel better 🍎......it's okay i'll give u more 🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎",
    "aw man i'll give u lots of cuddles",
    "uk what'll make u feel better? ik lizards yes lot of em 🦎🦎🦎🦎🦎🦎🦎🦎🦎🦎🦎",
  ];

  const neutralResponses = [
    "works",
    "die ig",
    "no click a lil to the left no? should be sad no other mood is acceptable",
    "think about apples",
    "uk what, i'll wrap apples with that ew yuck bleh milk skin n feed it to u"
  ];

  const happyResponses = [
    "sad",
    "can't let u be happy nope nope",
    "now i'm unhappy",
    "be saddd c'monnn",
    "aw yayy",
    "no u are supposed to be crying not happy"
  ];

  // Set up floating hearts
  const hearts = [
    { id: 1, emoji: "🦎", top: "15%", left: "5%", size: "24px", duration: "7s", delay: "0s", color: "#ff527b" },
    { id: 2, emoji: "🦆", top: "70%", left: "80%", size: "18px", duration: "9s", delay: "1s", color: "#ffca3a" },
    { id: 3, emoji: "🚮", top: "10%", left: "60%", size: "16px", duration: "11s", delay: "2.5s", color: "#4cc9f0" }
  ];

  // Randomly select greeting and message when component mounts
  useEffect(() => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setGreeting(randomGreeting);
    setMessage(randomMessage);
    
    // Don't set initial mood response - wait for user interaction
  }, []);

  // Update mood response whenever mood value changes (but only after user interaction)
  useEffect(() => {
    if (moodSelected) {
      setCurrentMoodResponse(getMoodResponse(moodValue));
    }
  }, [moodValue, moodSelected]);

  // Function to change emojis only (not the message)
  const changeEmoji = (index) => {
    const emojiOptions = ["😏", "😎", "✨", "👀", "🥰", "🧍‍♀️", "😌", "🦎", "🔥"];
    const randomEmoji = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
    
    const newEmojis = [...emojis];
    newEmojis[index] = randomEmoji;
    setEmojis(newEmojis);
  };

  // Function to handle slider movement
  const handleSliderChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setMoodValue(percentage);
    setShowHug(false); // Reset hug animation when mood changes
    
    // Mark that the user has selected a mood
    if (!moodSelected) {
      setMoodSelected(true);
    }
  };

  // Get mood emoji based on slider value
  const getMoodEmoji = () => {
    if (moodValue < 30) return "😕";
    if (moodValue < 70) return "😐";
    return "😄";
  };

  // Get response based on mood
  const getMoodResponse = (value) => {
    if (value < 30) {
      return sadResponses[Math.floor(Math.random() * sadResponses.length)];
    } else if (value < 70) {
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
    } else {
      return happyResponses[Math.floor(Math.random() * happyResponses.length)];
    }
  };

  // Get colors based on mood
  const getMoodColors = () => {
    if (moodValue < 30) {
      return { bg: "#f8d7da", border: "#ff85a1" };
    } else if (moodValue < 70) {
      return { bg: "#fff3cd", border: "#ffca3a" };
    } else {
      return { bg: "#d1ecf1", border: "#4cc9f0" };
    }
  };

  // Show virtual hug
  const giveHug = () => {
    setShowHug(true);
    
    // Reset hug after animation
    setTimeout(() => {
      setShowHug(false);
    }, 3000);
  };

  return (
    <HomeContainer>
      {hearts.map(heart => (
        <FloatingHeart 
          key={heart.id}
          top={heart.top}
          left={heart.left}
          size={heart.size}
          duration={heart.duration}
          delay={heart.delay}
          color={heart.color}
        >
          {heart.emoji}
        </FloatingHeart>
      ))}
    
      <WelcomeCard>
        <Greeting>{greeting}</Greeting>
        <Message>{message}</Message>
        <EmojiContainer>
          <Emoji onClick={() => changeEmoji(0)} delay="0s">{emojis[0]}</Emoji>
          <Emoji onClick={() => changeEmoji(1)} delay="0.5s">{emojis[1]}</Emoji>
          <Emoji onClick={() => changeEmoji(2)} delay="1s">{emojis[2]}</Emoji>
        </EmojiContainer>
      </WelcomeCard>
      
      <MoodCard>
        <h2 style={{ color: '#3a86ff', textShadow: '2px 2px 0 #ffca3a', marginBottom: '20px' }}>
          How are you feeling today?
        </h2>
        
        <SliderContainer>
          <SliderTrack onClick={handleSliderChange} />
          <SliderThumb position={moodValue}>{getMoodEmoji()}</SliderThumb>
          
          <MoodLabels>
            <MoodLabel>
              <span>😕</span>
              Sad
            </MoodLabel>
            <MoodLabel>
              <span>😐</span>
              Normal
            </MoodLabel>
            <MoodLabel>
              <span>😄</span>
              Happy
            </MoodLabel>
          </MoodLabels>
        </SliderContainer>
        
        {!moodSelected && (
          <PromptMessage>
            Drag the slider to tell me how you're feeling...
          </PromptMessage>
        )}
        
        {moodSelected && (
          <MoodResponse bgColor={getMoodColors().bg} borderColor={getMoodColors().border}>
            <p style={{ fontSize: '14px' }}>{currentMoodResponse}</p>
            
            {moodValue < 30 && !showHug && (
              <HugButton onClick={giveHug}>
                fiine u can have a hug c'mere 
              </HugButton>
            )}
            
            {showHug && (
              <HugAnimation>
                🫂
              </HugAnimation>
            )}
          </MoodResponse>
        )}
      </MoodCard>
    </HomeContainer>
  );
};

export default Home;
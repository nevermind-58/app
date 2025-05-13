import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Press Start 2P', cursive;
  }

  body {
    font-family: 'Press Start 2P', cursive;
    background-color: #ffffff;
    color: #333333;
    line-height: 1.6;
    padding: 20px;
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.7' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
  }

  @media (max-width: 576px) {
    input, select, textarea, button {
      font-size: 16px !important; /* Prevents zoom on iOS */
    }
    
    button {
      cursor: pointer;
      touch-action: manipulation; /* Better touch experience */
    }

  h1, h2, h3, h4 {
    margin-bottom: 20px;
    color: #ff527b;
    text-shadow: 2px 2px 0 #ffca3a;
  }

  button {
    font-family: 'Press Start 2P', cursive;
    padding: 10px 15px;
    background-color: #4cc9f0;
    color: #333333;
    border: 3px solid #3a86ff;
    box-shadow: 4px 4px 0 #ff9e00;
    cursor: pointer;
    transition: all 0.1s;
    border-radius: 4px;

    &:hover {
      background-color: #5dd7ff;
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 #ff9e00;
    }

    &:active {
      background-color: #7de2ff;
      transform: translate(4px, 4px);
      box-shadow: 0px 0px 0 #ff9e00;
    }
  }

  input, textarea, select {
    font-family: 'Press Start 2P', cursive;
    padding: 8px;
    margin-bottom: 10px;
    border: 2px solid #3a86ff;
    background-color: #f8f9fa;
    color: #333333;
    width: 100%;
    font-size: 10px;
    border-radius: 4px;

    &::placeholder {
      color: #adb5bd;
    }
  }

  .pixel-box {
    background-color: #ffffff;
    border: 4px solid #3a86ff;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 8px 8px 0 rgba(255, 158, 0, 0.5);
    border-radius: 6px;
  }

  .pixel-card {
    background-color: #f8f9fa;
    border: 3px solid #3a86ff;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 5px 5px 0 rgba(255, 158, 0, 0.5);
    border-radius: 6px;
  }

  a {
    color: #8338ec;
    text-decoration: none;
    
    &:hover {
      color: #a255ff;
      text-decoration: underline;
    }
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #4cc9f0;
    border: 2px solid #3a86ff;
  }
`;

export default GlobalStyle;
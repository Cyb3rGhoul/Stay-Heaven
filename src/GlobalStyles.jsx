import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    background: #f8f8f8;
    color: #333;
  }

@keyframes l5 {
    0%, 20% {
      transform: rotate(0);
    }
    40%, 60% {
      transform: rotate(0.5turn);
    }
    80%, 100% {
      transform: rotate(1turn);
    }
  }

  .loader {
    width: 80px;
    height: 40px;
    border-radius: 100px 100px 0 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }

  .loader:before {
    content: "";
    position: absolute;
    inset: 0 0 -100%;
    background: radial-gradient(farthest-side, #ffd738 80%, #0000) left 70% top 20%/15px 15px,
      radial-gradient(farthest-side, #020308 92%, #0000) left 65% bottom 19%/12px 12px,
      radial-gradient(farthest-side, #ecfefe 92%, #0000) left 70% bottom 20%/15px 15px,
      linear-gradient(#9eddfe 50%, #020308 0);
    background-repeat: no-repeat;
    animation: l5 2s infinite;
  }
`;

export default GlobalStyles;

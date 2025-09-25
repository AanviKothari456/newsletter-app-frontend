import { useTypewriter } from 'react-simple-typewriter';

const TextTyping = ({ text }) => {
  const [typedText] = useTypewriter({
    words: [text],
    typeSpeed: 53,
    loop: 3,
  });

  return <span>{typedText}</span>;
};

export default TextTyping;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { FaMapMarkerAlt, FaPlane, FaTrophy, FaShareAlt } from 'react-icons/fa';
import './Game.css';

const Game = () => {
  const [destination, setDestination] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [feedback, setFeedback] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const fetchDestination = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/destination');
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setDestination(response.data);
      setSelectedAnswer('');
      setFeedback(null);
      setShowImage(false); // Hide image for new question
    } catch (error) {
      console.error('Error fetching destination:', error);
      alert('Failed to fetch destination. Please try again.');
    }
  };

  useEffect(() => { fetchDestination(); }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === destination.correctAnswer;

    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      wrong: !isCorrect ? prev.wrong + 1 : prev.wrong
    }));

    setFeedback({
      isCorrect,
      funFact: destination.funFact,
      trivia: destination.trivia
    });

    if (isCorrect) {
      setShowImage(true); // Show image for correct answer
    }
  };

  const shareChallenge = () => {
    const shareText = `Can you beat my score of ${score.correct} in Globetrotter? 🌍🚀\nPlay now: http://localhost:3000`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    window.open(shareUrl, '_blank');
  };

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {feedback?.isCorrect && <Confetti />}

      <div className="score-display">
        <div className="score-correct">
          <FaTrophy /> ✅ {score.correct}
        </div>
        <div className="score-wrong">
          ❌ {score.wrong}
        </div>
      </div>

      <motion.div
        className="clues"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {destination?.clues.map((clue, i) => (
          <p key={i}><FaMapMarkerAlt /> {clue}</p>
        ))}
      </motion.div>

      <motion.div
        className="options"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {destination?.options.map(option => (
          <motion.button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={!!selectedAnswer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`option-button ${selectedAnswer === option ? (feedback.isCorrect ? 'correct' : 'wrong') : ''}`}
          >
            {option}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback ${feedback.isCorrect ? 'happy' : 'sad'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <p>{feedback.funFact}</p>
            <p>{feedback.trivia}</p>
            <motion.button
              onClick={fetchDestination}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="next-button"
            >
              Next Destination <FaPlane />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {showImage && (
        <motion.div
          className="image-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <img
            src={`https://source.unsplash.com/400x300/?${destination.correctAnswer}`}
            alt={destination.correctAnswer}
          />
          <p>✨ You guessed it right! Here's a glimpse of {destination.correctAnswer}. ✨</p>
        </motion.div>
      )}

      <div className="motivational-text">
        <p>🌍 Explore the world, one clue at a time!</p>
        <p>🚀 Can you guess all the destinations?</p>
      </div>

      {/* Challenge Friend Button */}
      <div className="challenge-friend-container">
        <button onClick={shareChallenge} className="challenge-friend-button">
          <FaShareAlt /> Challenge a Friend
        </button>
      </div>
    </motion.div>
  );
};

export default Game;
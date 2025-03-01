import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaPlane, FaTrophy } from 'react-icons/fa';
import Game from './Game';
import ChallengeButton from './components/ChallengeButton';
import './App.css';

function App() {
  const [showGame, setShowGame] = useState(false);
  const [username, setUsername] = useState('');
  const [previousScore, setPreviousScore] = useState({ correct: 0, wrong: 0 });

  // Retrieve previous score from local storage
  React.useEffect(() => {
    const score = JSON.parse(localStorage.getItem('previousScore')) || { correct: 0, wrong: 0 };
    setPreviousScore(score);
  }, []);

  return (
    <motion.div
      className="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Left Half: Destination Images Collage */}
      <div className="left-half">
        <div className="image-collage">
          <img src="https://img.freepik.com/free-photo/happy-couple-having-wine-with-view-eiffel-tower_181624-33226.jpg?uid=R100183381&ga=GA1.1.1601750906.1721025026&semt=ais_hybrid" alt="Paris" />
          <img src="https://img.freepik.com/free-photo/tall-sky-district-tokyo-light_1203-4589.jpg?t=st=1740821704~exp=1740825304~hmac=5bbf606b2c7f5c90d8a8ad92f32f7d88fbd5c09b1aba52a80c9193c0e927f040&w=740" alt="Tokyo" />
          <img src="https://img.freepik.com/free-photo/woman-front-empire-state-building_23-2150897463.jpg?t=st=1740821808~exp=1740825408~hmac=a0583235a9b2079e491373affbe1da9e6a9c4704f700c656425b23a7eccb7956&w=740" alt="New York" />
          <img src="https://img.freepik.com/free-photo/front-view-woman-posing-amusement-park_23-2148693073.jpg?t=st=1740821866~exp=1740825466~hmac=cecb95bb3a2a314b3516b45d4b9dab4627a0d5c7806699281140390c97338a42&w=740" alt="London" />
          <img src="https://img.freepik.com/free-photo/portrait-woman-visiting-luxurious-city-dubai_23-2151328494.jpg?t=st=1740821957~exp=1740825557~hmac=e0ff49f574f345df82fd607f22e2c0f294f810e77a8a25c58493302ffce6920c&w=740" alt="Dubai" />
          <img src="https://img.freepik.com/premium-photo/beautiful-girl-walks-by-famous-sydney-opera-house-sunrise_926199-4250354.jpg?w=740" alt="Sydney" />
        </div>
      </div>

      {/* Right Half: Game UI */}
      <div className="right-half">
        <header className="header">
          <motion.h1
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            <FaGlobeAmericas /> Globetrotter Challenge
          </motion.h1>
        </header>

        {showGame ? (
          <Game />
        ) : (
          <motion.div
            className="start-screen"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="name-input"
            />
            <motion.button
              onClick={() => setShowGame(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="start-button"
            >
              <FaPlane /> Start Your Adventure
            </motion.button>
            <ChallengeButton />
            <div className="previous-score">
              <FaTrophy /> Previous Wins: {previousScore.correct}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default App;
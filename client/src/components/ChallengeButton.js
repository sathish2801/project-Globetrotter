import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const ChallengeButton = () => {
  const [challengeLink, setChallengeLink] = useState('');
  const [previousScore, setPreviousScore] = useState({ correct: 0, wrong: 0 });

  // Retrieve previous score from local storage
  useEffect(() => {
    try {
      const score = JSON.parse(localStorage.getItem('previousScore')) || { correct: 0, wrong: 0 };
      setPreviousScore(score);
      console.log('Retrieved Score:', score); // Log the score
    } catch (error) {
      console.error('Error retrieving score from local storage:', error);
      setPreviousScore({ correct: 0, wrong: 0 });
    }
  }, []);

  const createChallenge = async () => {
    try {
      console.log('Sending Score:', previousScore.correct); // Log the score being sent
      const response = await axios.post('http://localhost:5000/api/challenge', {
        score: previousScore.correct
      });

      console.log('Challenge Response:', response.data); // Log the response
      const link = `http://localhost:3000/challenge/${response.data.challengeId}`;
      setChallengeLink(link);

      // Open WhatsApp share dialog
      window.open(
        `https://wa.me/?text=Can%20you%20beat%20my%20score%20of%20${previousScore.correct}%20in%20Globetrotter?%20${link}`,
        '_blank'
      );
    } catch (error) {
      console.error('Challenge creation failed:', error);
      alert('Failed to create challenge. Please try again.');
    }
  };

  return (
    <div className="challenge-wrapper">
      <button
        onClick={createChallenge}
        className="challenge-button"
        aria-label="Challenge Friends"
      >
        🎯 Challenge Friends
      </button>

      {challengeLink && (
        <div className="share-link">
          <p>Share this link: {challengeLink}</p>
        </div>
      )}

      <div className="previous-score">
        <p>Your previous wins: ✅ {previousScore.correct}</p>
      </div>
    </div>
  );
};

export default ChallengeButton;
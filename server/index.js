const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/globetrotter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define Challenge Schema
const challengeSchema = new mongoose.Schema({
  score: Number,
  createdAt: { type: Date, default: Date.now },
});

const Challenge = mongoose.model('Challenge', challengeSchema);

// Sample destinations data
const destinations = {
  destinations: [
    {
      city: "Paris",
      country: "France",
      clues: [
        "This city is home to a famous tower that sparkles every night.",
        "Known as the 'City of Love' and a hub for fashion and art."
      ],
      fun_fact: [
        "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
        "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
      ],
      trivia: [
        "This city is famous for its croissants and macarons. Bon appétit!",
        "Paris was originally a Roman city called Lutetia."
      ]
    },
    {
      city: "Tokyo",
      country: "Japan",
      clues: [
        "This city has the busiest pedestrian crossing in the world.",
        "You can visit an entire district dedicated to anime, manga, and gaming."
      ],
      fun_fact: [
        "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
        "More than 14 million people live in Tokyo, making it one of the most populous cities in the world."
      ],
      trivia: [
        "The city has over 160,000 restaurants, more than any other city in the world.",
        "Tokyo’s subway system is so efficient that train delays of just a few minutes come with formal apologies."
      ]
    },
    {
      city: "New York",
      country: "USA",
      clues: [
        "Home to a green statue gifted by France in the 1800s.",
        "Nicknamed 'The Big Apple' and known for its Broadway theaters."
      ],
      fun_fact: [
        "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
        "Times Square was once called Longacre Square before being renamed in 1904."
      ],
      trivia: [
        "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
        "The Empire State Building has its own zip code: 10118."
      ]
    }
    
  ]
};

// Get random destination
app.get('/api/destination', async (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * destinations.destinations.length);
    const destination = destinations.destinations[randomIndex];

    if (!destination) {
      return res.status(404).json({ error: 'No destinations found' });
    }

    const options = destinations.destinations
      .map(d => d.city)
      .filter(city => city !== destination.city)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    options.push(destination.city);
    options.sort(() => Math.random() - 0.5);

    res.json({
      clues: destination.clues.slice(0, 2),
      options,
      correctAnswer: destination.city,
      funFact: destination.fun_fact[0],
      trivia: destination.trivia[0]
    });
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// Create a new challenge
app.post('/api/challenge', async (req, res) => {
  try {
    const { score } = req.body;

    if (score === undefined) {
      return res.status(400).json({ error: 'Score is required' });
    }

    const challenge = new Challenge({ score });
    await challenge.save();

    res.json({
      challengeId: challenge._id,
      link: `http://localhost:3000/challenge/${challenge._id}`
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// Get challenge details
app.get('/api/challenge/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json({
      score: challenge.score
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// Generate challenge image
app.get('/api/challenge-image/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#6a11cb';
    ctx.fillRect(0, 0, 800, 400);

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.fillText(`Challenge Score: ${challenge.score}`, 50, 100);

    // Convert to image
    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
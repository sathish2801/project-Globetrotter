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

// Corrected destinations data structure
const destinations = [
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
  },
  {
    city: "London",
    country: "United Kingdom",
    clues: [
      "This city is home to a famous clock tower called Big Ben.",
      "Known for its iconic red double-decker buses and black cabs."
    ],
    fun_fact: [
      "London has over 170 museums, many of which are free to enter!",
      "The London Underground is the oldest metro system in the world, opening in 1863."
    ],
    trivia: [
      "The city has more than 8 million trees, making it one of the greenest cities in the world.",
      "London Bridge was sold to an American businessman in 1968, who thought he was buying Tower Bridge!"
    ]
  },
  {
    city: "Rome",
    country: "Italy",
    clues: [
      "This city is home to the Colosseum, where gladiators once fought.",
      "Known as the 'Eternal City' and the birthplace of pizza and pasta."
    ],
    fun_fact: [
      "Rome has a museum dedicated entirely to pasta!",
      "The Trevi Fountain collects over €1 million in coins each year, which is donated to charity."
    ],
    trivia: [
      "Rome is built on seven hills, which are still part of the city's landscape today.",
      "The Pantheon in Rome has the world's largest unreinforced concrete dome."
    ]
  },
  {
    city: "Sydney",
    country: "Australia",
    clues: [
      "This city is home to the iconic Sydney Opera House.",
      "Known for its stunning harbor and the Sydney Harbour Bridge."
    ],
    fun_fact: [
      "The Sydney Opera House roof is made up of over 1 million tiles!",
      "Sydney has over 100 beaches, including the famous Bondi Beach."
    ],
    trivia: [
      "The Sydney Harbour Bridge is nicknamed 'The Coathanger' due to its arch-based design.",
      "Sydney was originally established as a penal colony in 1788."
    ]
  },
  {
    city: "Cairo",
    country: "Egypt",
    clues: [
      "This city is home to the Great Pyramid of Giza, one of the Seven Wonders of the Ancient World.",
      "Known as the 'City of a Thousand Minarets' due to its many mosques."
    ],
    fun_fact: [
      "Cairo is the largest city in Africa and the Middle East!",
      "The Great Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years."
    ],
    trivia: [
      "Cairo is located near the Nile River, the longest river in the world.",
      "The city has a 'City of the Dead,' a historic cemetery where people still live and work."
    ]
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    clues: [
      "This city is home to the world's tallest building, the Burj Khalifa.",
      "Known for its luxury shopping, ultramodern architecture, and vibrant nightlife."
    ],
    fun_fact: [
      "Dubai has a police force that uses supercars like Lamborghinis and Ferraris!",
      "The Burj Khalifa has over 160 stories and is twice as tall as the Empire State Building."
    ],
    trivia: [
      "Dubai has an indoor ski resort in the middle of the desert.",
      "The city has a man-made island shaped like a palm tree, called Palm Jumeirah."
    ]
  },
  {
    city: "Berlin",
    country: "Germany",
    clues: [
      "This city is home to the Brandenburg Gate and the Berlin Wall.",
      "Known for its vibrant art scene and techno music culture."
    ],
    fun_fact: [
      "Berlin has more bridges than Venice, with over 1,700 bridges!",
      "The Berlin Wall was 155 kilometers long and divided the city for 28 years."
    ],
    trivia: [
      "Berlin is nine times larger than Paris in terms of area.",
      "The city has more museums than rainy days per year."
    ]
  },
  {
    city: "Barcelona",
    country: "Spain",
    clues: [
      "This city is home to the famous Sagrada Familia church designed by Antoni Gaudí.",
      "Known for its beautiful beaches and vibrant street life."
    ],
    fun_fact: [
      "The Sagrada Familia has been under construction for over 140 years and is still not finished!",
      "Barcelona has 12 abandoned underground stations, some of which are used for film sets."
    ],
    trivia: [
      "The city hosted the 1992 Summer Olympics, which transformed its coastline.",
      "Barcelona's Park Güell is a UNESCO World Heritage Site and a masterpiece of Gaudí's work."
    ]
  },
  {
    city: "Moscow",
    country: "Russia",
    clues: [
      "This city is home to the iconic Red Square and the Kremlin.",
      "Known for its onion-domed cathedrals and harsh winters."
    ],
    fun_fact: [
      "Moscow has the largest number of billionaires in the world!",
      "The Moscow Metro is one of the most beautiful subway systems, with chandeliers and mosaics."
    ],
    trivia: [
      "Red Square's name has nothing to do with communism; it comes from the old Russian word for 'beautiful.'",
      "Moscow is home to the largest McDonald's in the world, which can serve 700 people at once."
    ]
  },
  {
    city: "Rio de Janeiro",
    country: "Brazil",
    clues: [
      "This city is home to the famous Christ the Redeemer statue.",
      "Known for its Carnival festival and stunning beaches like Copacabana and Ipanema."
    ],
    fun_fact: [
      "Rio de Janeiro was the capital of Brazil until 1960 when it was moved to Brasília.",
      "The Christ the Redeemer statue was voted one of the New Seven Wonders of the World."
    ],
    trivia: [
      "Rio's Carnival is the largest carnival in the world, attracting over 2 million people daily.",
      "The city is surrounded by lush mountains and rainforests, including Tijuca National Park."
    ]
  },
  {
    city: "Bangkok",
    country: "Thailand",
    clues: [
      "This city is home to the Grand Palace and Wat Arun.",
      "Known for its bustling street markets and vibrant nightlife."
    ],
    fun_fact: [
      "Bangkok's full ceremonial name is the longest city name in the world, with 169 letters!",
      "The city has over 400 temples, each with intricate designs and cultural significance."
    ],
    trivia: [
      "Bangkok is one of the hottest cities in the world, with an average temperature of 28°C (82°F).",
      "The city is known as the 'Venice of the East' due to its network of canals."
    ]
  }
];

// Get random destination
app.get('/api/destination', async (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * destinations.length);
    const destination = destinations[randomIndex];

    if (!destination) {
      return res.status(404).json({ error: 'No destinations found' });
    }

    const options = destinations
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
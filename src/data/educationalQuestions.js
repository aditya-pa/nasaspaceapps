// Educational NASA Space Questions - 7 Wave Progression System
// Wave corresponds directly to game level: Wave 1 = Level 1, Wave 2 = Level 2, etc.
// Each question has exactly 3 answer options

export const EDUCATIONAL_QUESTIONS = {
  // WAVE 1: Earth (Level 1)
  1: [
    {
      question: "Which planet is the only one to have life?",
      answers: ["Earth", "Mars", "Venus"],
      correctAnswer: 0,
      points: 100,
      explanation: "Earth is the only known planet with life due to its perfect distance from the Sun, liquid water, and protective atmosphere."
    },
    {
      question: "What causes day and night on earth?",
      answers: ["The sun turning off", "The earth turning on its own axis", "The moon covering the sun"],
      correctAnswer: 1,
      points: 100,
      explanation: "Earth rotates on its axis once every 24 hours, causing different parts to face the Sun (day) or face away (night)."
    },
    {
      question: "How many planets are there in our solar system?",
      answers: ["12", "7", "8"],
      correctAnswer: 2,
      points: 100,
      explanation: "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune."
    },
    {
      question: "Which of these planets is a gas planet?",
      answers: ["Jupiter", "Saturn", "Mars"],
      correctAnswer: 0,
      points: 100,
      explanation: "Jupiter is a gas giant made mostly of hydrogen and helium, with no solid surface like Earth."
    },
    {
      question: "What does earth mostly have on its surface?",
      answers: ["Water", "Regolith", "Clouds"],
      correctAnswer: 0,
      points: 100,
      explanation: "About 71% of Earth's surface is covered by water in oceans, seas, lakes, and rivers."
    },
    {
      question: "What gives earth its blue colour from space?",
      answers: ["Sky", "Oceans", "Ice caps"],
      correctAnswer: 1,
      points: 100,
      explanation: "Earth appears blue from space because sunlight reflects off the vast oceans covering most of the planet's surface."
    },
    {
      question: "Why is the earth a sphere?",
      answers: ["Gravity", "Air", "Moon"],
      correctAnswer: 0,
      points: 100,
      explanation: "Gravity pulls all matter toward the center of the Earth, creating a spherical shape over time."
    },
    {
      question: "What does the sun give humans?",
      answers: ["Rain", "Height", "Heat and light"],
      correctAnswer: 2,
      points: 100,
      explanation: "The Sun provides heat and light energy that makes life possible on Earth and drives our weather systems."
    },
    {
      question: "What do we call the invisible line earth spins around?",
      answers: ["Axis", "Equator", "Parallelogram"],
      correctAnswer: 0,
      points: 100,
      explanation: "Earth's axis is an imaginary line running through the North and South poles around which Earth rotates."
    }
  ],

  // WAVE 2: Moon (Level 2)
  2: [
    {
      question: "What is the moon?",
      answers: ["A planet", "Earth's natural satellite", "Cheese"],
      correctAnswer: 1,
      points: 120,
      explanation: "The Moon is Earth's only natural satellite, orbiting our planet about once every 27.3 days."
    },
    {
      question: "How long does it take the moon to go around earth once?",
      answers: ["About 1 month", "About a week", "About a year"],
      correctAnswer: 0,
      points: 120,
      explanation: "The Moon completes one orbit around Earth approximately every 27.3 days, or about one month."
    },
    {
      question: "Why does the Moon shine?",
      answers: ["It creates light", "It reflects sunlight", "It has fire inside"],
      correctAnswer: 1,
      points: 120,
      explanation: "The Moon doesn't produce its own light. It shines because it reflects light from the Sun back to Earth."
    },
    {
      question: "The Moon is sometimes seen as round, sometimes as a crescent shape. Why?",
      answers: ["It changes shape", "The side facing the sun isn't always facing us", "The earth regularly blocks the light"],
      correctAnswer: 1,
      points: 120,
      explanation: "The Moon's phases occur because we see different amounts of the sunlit side as the Moon orbits Earth."
    },
    {
      question: "What is a full moon?",
      answers: ["When the Moon is closest to Earth", "When we see the whole lit side of the Moon", "When there is no light on the Moon"],
      correctAnswer: 1,
      points: 120,
      explanation: "A full moon happens when Earth is between the Sun and Moon, so we see the entire illuminated side."
    },
    {
      question: "What is a new moon?",
      answers: ["When the Moon disappears because the Sun is behind it", "When it's full and bright", "When astronauts first visited it"],
      correctAnswer: 0,
      points: 120,
      explanation: "During a new moon, the Moon is between Earth and the Sun, so the sunlit side faces away from us."
    },
    {
      question: "How many people have walked on the Moon (so far)?",
      answers: ["6", "18", "12"],
      correctAnswer: 2,
      points: 120,
      explanation: "Twelve astronauts have walked on the Moon during the Apollo missions between 1969 and 1972."
    },
    {
      question: "What was the name of the first mission to land humans on the Moon?",
      answers: ["Apollo 11", "Apollo 13", "Apollo 8"],
      correctAnswer: 0,
      points: 120,
      explanation: "Apollo 11 was the first mission to successfully land humans on the Moon in July 1969."
    },
    {
      question: "What causes craters on the Moon's surface?",
      answers: ["Wind and rain", "Asteroids and rocks hitting it", "Moonquakes"],
      correctAnswer: 1,
      points: 120,
      explanation: "Moon craters are formed by asteroids, meteoroids, and comets hitting the surface over billions of years."
    },
    {
      question: "Why don't footprints on the Moon disappear?",
      answers: ["There's no wind or rain", "The moon is too solid", "There were no feet on the moon"],
      correctAnswer: 0,
      points: 120,
      explanation: "Without atmosphere, there's no wind or weather to erase footprints, so they can last for millions of years."
    }
  ],

  // WAVE 3: Sun & Solar System (Level 3)
  3: [
    {
      question: "What is the Sun?",
      answers: ["A laser", "A star", "A planet"],
      correctAnswer: 1,
      points: 140,
      explanation: "The Sun is a star - a massive ball of hot gas that produces energy through nuclear fusion."
    },
    {
      question: "What force keeps planets orbiting around the Sun?",
      answers: ["Magnetism", "Gravity", "Solar wind"],
      correctAnswer: 1,
      points: 140,
      explanation: "The Sun's gravity pulls on the planets, keeping them in orbit around it."
    },
    {
      question: "How many planets are in our Solar System (not counting dwarf planets)?",
      answers: ["7", "8", "9"],
      correctAnswer: 1,
      points: 140,
      explanation: "There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune."
    },
    {
      question: "Which planet is closest to the Sun?",
      answers: ["Earth", "Mercury", "Mars"],
      correctAnswer: 1,
      points: 140,
      explanation: "Mercury is the closest planet to the Sun, with extremely hot days and cold nights."
    },
    {
      question: "Which planet is known as the \"Red Planet\"?",
      answers: ["Jupiter", "Mars", "Venus"],
      correctAnswer: 1,
      points: 140,
      explanation: "Mars appears red due to iron oxide (rust) on its surface, giving it a reddish color."
    },
    {
      question: "Which planet has prominent rings around it?",
      answers: ["Neptune", "Jupiter", "Saturn"],
      correctAnswer: 2,
      points: 140,
      explanation: "Saturn has the most visible and spectacular ring system made of ice and rock particles."
    },
    {
      question: "Which two planets are called \"gas giants\"?",
      answers: ["Mercury and Venus", "Jupiter and Saturn", "Uranus and Neptune"],
      correctAnswer: 1,
      points: 140,
      explanation: "Jupiter and Saturn are gas giants - massive planets made mostly of hydrogen and helium."
    },
    {
      question: "What planet has the strongest gravity in the Solar System?",
      answers: ["Jupiter", "Earth", "Mars"],
      correctAnswer: 0,
      points: 140,
      explanation: "Jupiter has the strongest gravity due to its massive size - about 2.5 times stronger than Earth's."
    },
    {
      question: "Which planet is the hottest?",
      answers: ["Venus", "Mercury", "Mars"],
      correctAnswer: 0,
      points: 140,
      explanation: "Venus is the hottest planet due to its thick atmosphere that traps heat in a runaway greenhouse effect."
    },
    {
      question: "How long does it take the earth to make a complete trip around the sun?",
      answers: ["1 day", "100 years", "1 year"],
      correctAnswer: 2,
      points: 140,
      explanation: "Earth takes 365.25 days (one year) to complete one orbit around the Sun."
    }
  ],

  // WAVE 4: Space Travel & Astronauts (Level 4)
  4: [
    {
      question: "What do astronauts travel in to reach space?",
      answers: ["Airplane", "Rocket", "Space balloon"],
      correctAnswer: 1,
      points: 160,
      explanation: "Rockets provide the tremendous power needed to escape Earth's gravity and reach space."
    },
    {
      question: "What is the name of the space laboratory orbiting Earth where astronauts live and work?",
      answers: ["Apollo 9", "International Space Station (ISS)", "Mars Station"],
      correctAnswer: 1,
      points: 160,
      explanation: "The ISS is a large spacecraft where astronauts from different countries live and conduct experiments."
    },
    {
      question: "How long does it take a rocket to reach space from Earth?",
      answers: ["Around 8 minutes", "Around 8 hours", "Around 8 days"],
      correctAnswer: 0,
      points: 160,
      explanation: "Most rockets reach the edge of space (100 km altitude) in about 8-10 minutes after launch."
    },
    {
      question: "How many times does the ISS orbit Earth in one day?",
      answers: ["4", "16", "24"],
      correctAnswer: 1,
      points: 160,
      explanation: "The ISS orbits Earth approximately every 90 minutes, completing about 16 orbits per day."
    },
    {
      question: "Why do astronauts float inside the ISS?",
      answers: ["There's no air", "The ISS is moving free falling around Earth in orbit", "Gravity disappears in space"],
      correctAnswer: 1,
      points: 160,
      explanation: "Astronauts float because they're in continuous free fall, constantly falling around Earth in orbit."
    },
    {
      question: "In the vacuum of space, what is least likely to kill you?",
      answers: ["Cold", "Vibration", "Lack of oxygen"],
      correctAnswer: 1,
      points: 160,
      explanation: "Vibration poses minimal threat in space's vacuum, while cold and lack of oxygen are immediate dangers."
    },
    {
      question: "What is the escape velocity of earth (the minimum speed needed to escape Earth's gravity)?",
      answers: ["11.2 m/s", "11.2 km/s", "No minimum needed"],
      correctAnswer: 1,
      points: 160,
      explanation: "Objects must reach 11.2 kilometers per second to completely escape Earth's gravitational pull."
    },
    {
      question: "What does NASA stand for?",
      answers: ["National Airplane and Science Agency", "National Aeronautics and Space Administration", "North American Space Association"],
      correctAnswer: 1,
      points: 160,
      explanation: "NASA is the National Aeronautics and Space Administration, America's space agency founded in 1958."
    },
    {
      question: "What do astronauts eat on the ISS?",
      answers: ["Only liquid food", "Packaged meals", "Plants grown in the bio-lab"],
      correctAnswer: 1,
      points: 160,
      explanation: "Astronauts eat specially packaged, freeze-dried, and thermostabilized meals designed for space."
    },
    {
      question: "What is the Artemis Program?",
      answers: ["A video game", "NASA's plan to return astronauts to the Moon", "A manned mission to Mars"],
      correctAnswer: 1,
      points: 160,
      explanation: "Artemis is NASA's program to land the first woman and next man on the Moon by the mid-2020s."
    }
  ],

  // WAVE 5: Stars & Galaxies (Level 5)
  5: [
    {
      question: "What does a star burn?",
      answers: ["Hydrogen", "Oxygen", "Carbon"],
      correctAnswer: 0,
      points: 180,
      explanation: "Stars burn hydrogen through nuclear fusion, converting it to helium and releasing tremendous energy."
    },
    {
      question: "What is the name of our galaxy?",
      answers: ["Andromeda", "Milky Way", "The solar system"],
      correctAnswer: 1,
      points: 180,
      explanation: "Our galaxy is called the Milky Way, containing over 100 billion stars including our Sun."
    },
    {
      question: "What are constellations?",
      answers: ["Planets grouped together", "Patterns of stars in the sky", "Groups of stars near each other"],
      correctAnswer: 1,
      points: 180,
      explanation: "Constellations are patterns of stars that appear connected from Earth, used for navigation and storytelling."
    },
    {
      question: "How many stars are there in our Galaxy?",
      answers: ["Hundreds of billions", "Hundreds of thousands", "Trillions and trillions"],
      correctAnswer: 0,
      points: 180,
      explanation: "The Milky Way contains an estimated 100-400 billion stars spread across its spiral arms."
    },
    {
      question: "What is the name of the North Star?",
      answers: ["Sirius", "Polaris", "Orion"],
      correctAnswer: 1,
      points: 180,
      explanation: "Polaris, the North Star, appears stationary in the sky and has been used for navigation for centuries."
    },
    {
      question: "What is a galaxy?",
      answers: ["A big group of stars, gas, and dust held together by gravity", "A cluster of planets", "A very large star"],
      correctAnswer: 0,
      points: 180,
      explanation: "A galaxy is a massive collection of stars, gas, dust, and dark matter bound together by gravity."
    },
    {
      question: "What is an exoplanet?",
      answers: ["A planet outside our Solar System", "A planet that exploded", "A moon of another planet"],
      correctAnswer: 0,
      points: 180,
      explanation: "Exoplanets are planets that orbit stars other than our Sun, thousands have been discovered."
    },
    {
      question: "What makes the North Star seem to \"stay still\" in the sky?",
      answers: ["It doesn't move", "It's exactly above Earth's axis of rotation", "It's the closest star to Earth"],
      correctAnswer: 1,
      points: 180,
      explanation: "Polaris appears stationary because it's nearly aligned with Earth's rotational axis."
    },
    {
      question: "What is the James Webb Space Telescope known for?",
      answers: ["Taking selfies of astronauts", "Seeing the first galaxies formed after the Big Bang", "Watching comets near Earth"],
      correctAnswer: 1,
      points: 180,
      explanation: "The James Webb Space Telescope can observe the most distant and oldest galaxies in the universe."
    },
    {
      question: "What do scientists call everything that exists — all space, time, matter, and energy?",
      answers: ["Galaxy", "Universe", "The Big Bang"],
      correctAnswer: 1,
      points: 180,
      explanation: "The Universe encompasses all matter, energy, space, and time that exists."
    }
  ],

  // WAVE 6: Comets, Meteors & Asteroids (Level 6)
  6: [
    {
      question: "What is a comet made of?",
      answers: ["Ice, dust, and rock", "Metal and rock", "Gas"],
      correctAnswer: 0,
      points: 200,
      explanation: "Comets are 'dirty snowballs' made of ice, dust, and rocky material from the outer solar system."
    },
    {
      question: "What causes a comet's bright tail?",
      answers: ["The comet's speed through the atmosphere", "Sunlight heating the ice", "Fire inside the comet"],
      correctAnswer: 1,
      points: 200,
      explanation: "Solar radiation heats the comet's ice, creating a glowing tail of gas and dust."
    },
    {
      question: "Where do most asteroids orbit the Sun?",
      answers: ["Between Mars and Jupiter", "Between Earth and Venus", "Almost following Pluto's orbit"],
      correctAnswer: 0,
      points: 200,
      explanation: "The asteroid belt between Mars and Jupiter contains most of the solar system's asteroids."
    },
    {
      question: "What are asteroids?",
      answers: ["Small rocky objects that orbit the Sun", "Broken stars", "Satellite debris"],
      correctAnswer: 0,
      points: 200,
      explanation: "Asteroids are rocky objects orbiting the Sun, left over from the solar system's formation."
    },
    {
      question: "What is a meteor?",
      answers: ["A large meteorite", "An asteroid that burns up in Earth's atmosphere", "A tiny comet"],
      correctAnswer: 1,
      points: 200,
      explanation: "A meteor is the bright streak of light created when a space rock burns up in our atmosphere."
    },
    {
      question: "What is a meteorite?",
      answers: ["A rock that lands on Earth from space", "A rock in space", "A space dust cloud"],
      correctAnswer: 0,
      points: 200,
      explanation: "A meteorite is a piece of asteroid or comet that survives the journey through atmosphere and lands on Earth."
    },
    {
      question: "What is the correct sequence of names for a rock from space that makes it through our atmosphere and lands on earth?",
      answers: ["Meteoroid, meteor, meteorite", "Meteor, meteoroid, meteorite", "Meteorite, meteoroid, meteor"],
      correctAnswer: 0,
      points: 200,
      explanation: "Meteoroid (in space) → meteor (burning in atmosphere) → meteorite (landed on ground)."
    },
    {
      question: "What is the name of NASA's mission that tested deflecting an asteroid?",
      answers: ["DART", "STAR", "AIM"],
      correctAnswer: 0,
      points: 200,
      explanation: "DART (Double Asteroid Redirection Test) successfully changed an asteroid's orbit in 2022."
    },
    {
      question: "What are Near-Earth Objects (NEOs)?",
      answers: ["Asteroids and comets that come close to Earth", "Anything in space visible from Earth", "Satellites"],
      correctAnswer: 0,
      points: 200,
      explanation: "NEOs are asteroids and comets with orbits that bring them close to Earth's path around the Sun."
    },
    {
      question: "Is there commercial interest in asteroids? If so, for what purpose?",
      answers: ["No, no commercial interest", "Yes, mining of minerals such as Nickel, iron, and platinum", "Yes, tourism"],
      correctAnswer: 1,
      points: 200,
      explanation: "Asteroids contain valuable metals like platinum, nickel, and rare earth elements that could be mined."
    }
  ],

  // WAVE 7: The Universe & Space Telescopes (Level 7)
  7: [
    {
      question: "What do we call everything that exists — all space, time, and matter?",
      answers: ["Galaxy", "Universe", "Solar System"],
      correctAnswer: 1,
      points: 220,
      explanation: "The Universe encompasses all matter, energy, space, and time that exists."
    },
    {
      question: "What was the event that started the Universe?",
      answers: ["Star Burst", "Big Bang", "First Light"],
      correctAnswer: 1,
      points: 220,
      explanation: "The Big Bang was the rapid expansion of space that began the universe about 13.8 billion years ago."
    },
    {
      question: "What is a galaxy?",
      answers: ["A big group of stars, gas, and dust held together by gravity", "A single star", "A type of comet"],
      correctAnswer: 0,
      points: 220,
      explanation: "A galaxy is a massive collection of stars, gas, dust, and dark matter bound together by gravity."
    },
    {
      question: "What is the name of NASA's most powerful space telescope?",
      answers: ["Hubble", "James Webb Space Telescope", "Galileo"],
      correctAnswer: 1,
      points: 220,
      explanation: "The James Webb Space Telescope is NASA's largest and most powerful space observatory."
    },
    {
      question: "What makes the James Webb Space Telescope special?",
      answers: ["It's the first telescope on Mars", "It can see light from the first galaxies after the Big Bang", "It takes photos of astronauts"],
      correctAnswer: 1,
      points: 220,
      explanation: "JWST can observe infrared light from the most distant and oldest galaxies in the universe."
    },
    {
      question: "What did the Hubble Space Telescope help us discover?",
      answers: ["The Sun's rings", "That the Universe is expanding", "That the Moon has air"],
      correctAnswer: 1,
      points: 220,
      explanation: "Hubble's observations provided key evidence that the universe is expanding at an accelerating rate."
    },
    {
      question: "What is a black hole?",
      answers: ["A dense point where gravity pulls in everything even light", "A planet made of black minerals", "A point in space where nothing is"],
      correctAnswer: 0,
      points: 220,
      explanation: "A black hole is a region where gravity is so strong that nothing, not even light, can escape."
    },
    {
      question: "What do we call the huge explosion that happens when a star dies?",
      answers: ["Starfall", "Supernova", "Starburn"],
      correctAnswer: 1,
      points: 220,
      explanation: "A supernova is the explosive death of a massive star, briefly outshining an entire galaxy."
    },
    {
      question: "What are light-years used to measure?",
      answers: ["Time", "Distance", "Brightness"],
      correctAnswer: 1,
      points: 220,
      explanation: "A light-year measures distance - how far light travels in one year (about 6 trillion miles)."
    },
    {
      question: "What do telescopes in space help scientists do better than those on Earth?",
      answers: ["Avoid clouds and atmosphere", "Take selfies", "Move faster"],
      correctAnswer: 0,
      points: 220,
      explanation: "Space telescopes avoid atmospheric interference, allowing clearer observations of distant objects."
    }
  ]
}

// Wave information metadata
export const WAVE_INFO = {
  1: {
    topic: "Earth",
    difficulty: "Beginner",
    description: "Learn about our home planet and its basic properties"
  },
  2: {
    topic: "Moon",
    difficulty: "Easy",
    description: "Explore Earth's natural satellite and lunar missions"
  },
  3: {
    topic: "Sun & Solar System", 
    difficulty: "Easy-Medium",
    description: "Discover our solar system's star and planets"
  },
  4: {
    topic: "Space Travel & Astronauts",
    difficulty: "Medium", 
    description: "Learn about rockets, space missions, and life in space"
  },
  5: {
    topic: "Stars & Galaxies",
    difficulty: "Medium-Hard",
    description: "Explore stellar evolution and galactic structures"
  },
  6: {
    topic: "Comets, Meteors & Asteroids",
    difficulty: "Hard",
    description: "Study small solar system bodies and impact threats"
  },
  7: {
    topic: "Universe & Space Telescopes",
    difficulty: "Expert",
    description: "Understand cosmology and advanced space observations"
  }
}

// Helper function to get questions for a specific wave
export const getWaveQuestions = (waveNumber, questionCount = 10) => {
  const waveQuestions = EDUCATIONAL_QUESTIONS[waveNumber] || EDUCATIONAL_QUESTIONS[1]
  
  // Shuffle questions and return the requested number
  const shuffled = [...waveQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(questionCount, shuffled.length))
}

// Helper function to get a random question from a specific wave
export const getRandomQuestion = (waveNumber = 1) => {
  const waveQuestions = EDUCATIONAL_QUESTIONS[waveNumber] || EDUCATIONAL_QUESTIONS[1]
  return waveQuestions[Math.floor(Math.random() * waveQuestions.length)]
}
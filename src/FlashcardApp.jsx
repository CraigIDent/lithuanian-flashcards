import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Papa from 'papaparse';

// Reusable UI components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border shadow bg-white ${className}`}>{children}</div>
);
const CardContent = ({ children }) => <div className="p-6">{children}</div>;
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-6 py-2 rounded-xl font-semibold shadow transition hover:scale-105 text-white text-lg ${className}`}
    {...props}
  >
    {children}
  </button>
);

import tsvText from './data/InitialSet.tsv?raw';

// Parse TSV file into JavaScript objects
function parseTSV(raw) {
  const rows = Papa.parse(raw.trim(), {
    delimiter: '\t',
    skipEmptyLines: true,
  }).data;

  // Remove the header row
  const [header, ...dataRows] = rows;

  return dataRows.map(([number, lithuanian, type, english, example1, example2, example1English, example2English]) => ({
    number: Number(number),
    lithuanian,
    type,
    english,
    example1,
    example1English,
    example2,
    example2English,
  }));
}

// Load initial flashcard words
const initialWords = parseTSV(tsvText);

// Utility: Randomly shuffle an array
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Precompute random rotation angles for pile stack visuals
const JITTER_COUNT = 2000;
const jitterAngles = Array.from({ length: JITTER_COUNT }, () => (Math.random() * 6 - 3).toFixed(2));

// Main app component
export default function FlashcardApp() {
  // State for word and sentence pools, piles, modes, etc.
  const [pool, setPool] = useState(() => shuffle(initialWords));
  const [sentencePool, setSentencePool] = useState([]);
  const [current, setCurrent] = useState(null);
  const [correctPile, setCorrectPile] = useState([]);
  const [wrongPile, setWrongPile] = useState([]);
  const [showEnglish, setShowEnglish] = useState(false);
  const [exampleSentence, setExampleSentence] = useState("");
  const [celebrated, setCelebrated] = useState(false);
  const [mode, setMode] = useState("LT-EN"); // Flashcard direction
  const [cardType, setCardType] = useState("word"); // "word" or "sentence"
  const [cameFromWrongPile, setCameFromWrongPile] = useState(false);
  const [initialSetEnabled, setInitialSetEnabled] = useState(true); // (currently unused)
  const [audioEnabled, setAudioEnabled] = useState(false);


  // On mount: extract all example sentences and shuffle
  useEffect(() => {
    const sentences = [];
    initialWords.forEach(entry => {
      sentences.push({ lithuanian: entry.example1, english: entry.example1English, type: 'sentence', number: entry.number, exampleKey: "example1" });
      sentences.push({ lithuanian: entry.example2, english: entry.example2English, type: 'sentence', number: entry.number, exampleKey: "example2" });
    });
    setSentencePool(shuffle(sentences));
  }, []);

  // Whenever card type changes, draw a new card
  useEffect(() => {
    setCelebrated(false); 
    setCorrectPile([]);
    setWrongPile([]);
    setExampleSentence("");
    setShowEnglish(false);
    
    setCurrent(null); // 🔥 Invalidate current card first
  
      if (cardType === "word") {
        setPool(shuffle(initialWords));
        setCurrent(initialWords.length > 0 ? initialWords[Math.floor(Math.random() * initialWords.length)] : null);
      } else {
        const sentences = [];
        initialWords.forEach(entry => {
          sentences.push({ lithuanian: entry.example1, english: entry.example1English, type: 'sentence', number: entry.number, exampleKey: "example1" });
          sentences.push({ lithuanian: entry.example2, english: entry.example2English, type: 'sentence', number: entry.number, exampleKey: "example2" });
        });
        const shuffledSentences = shuffle(sentences);
        setSentencePool(shuffledSentences);
        setCurrent(shuffledSentences.length > 0 ? shuffledSentences[Math.floor(Math.random() * shuffledSentences.length)] : null);
      }
  }, [cardType]);

  
  // Whenever pool updates (after correct guesses), draw a new card
  //useEffect(() => { drawNextCard(); }, [pool]);

  // Celebrate with confetti once all words are answered correctly
  useEffect(() => {
    if (correctPile.length > 0 && pool.length === 0 && wrongPile.length === 0 && !celebrated) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setCelebrated(true);
    }
  }, [pool, wrongPile, correctPile, celebrated]);

  // Play the audio
  function playAudio(number, type = "word") {
    if (!audioEnabled) return; // Respect toggle
  
    const url = `./data/audio/${number}_${type}.mp3`;
    //const url = `./data/audio/blaster.mp3`;
    const audio = new Audio(url);
  
    audio.play()
      .then(() => {
        console.log(`Playing audio: ${url}`);
      })
      .catch(err => {
        console.error(`Audio play failed for ${url}:`, err);
      });
  }

  // Choose the next flashcard
  function drawNextCard() {
    const dataPool = cardType === "word" ? pool : sentencePool;
    let next = null;
    const shouldDrawFromWrong = wrongPile.length > 0 && Math.random() < 0.2;
    const hasPool = dataPool.length > 0;
  
    if (shouldDrawFromWrong) {
      next = wrongPile[Math.floor(Math.random() * wrongPile.length)];
      setCameFromWrongPile(true);
    } else if (hasPool) {
      next = dataPool[Math.floor(Math.random() * dataPool.length)];
      setCameFromWrongPile(false);
    } else if (wrongPile.length > 0) {
      next = wrongPile[Math.floor(Math.random() * wrongPile.length)];
      setCameFromWrongPile(true);
    }
  
    setCurrent(next);
    setShowEnglish(false);
    setExampleSentence("");
  
    // 🔥 Play audio immediately if Lithuanian side is shown
    if (next &&  audioEnabled && mode === "LT-EN") {
      setTimeout(() => {
        if (cardType === "word") {
          playAudio(next.number || next.lithuanianNumber, "word");
        } else {
          // Sentence mode
          playAudio(next.number || next.lithuanianNumber, next.exampleKey || "word");
        }
      }, 400); // <-- smooth delay matching your motion.div animation duration
    }
  }

  const updatePoolWithSets = (initialEnabled) => {
    setCelebrated(false); // reset confetti
  
    // Build the new list of initialWords
    let newWordPool = [];
    if (initialEnabled) {
      newWordPool = [...initialWords]; // Just use the full set (adjust if you add more later)
    }
  
    // Build corresponding sentences
    let newSentencePool = [];
    newWordPool.forEach(entry => {
      newSentencePool.push({ lithuanian: entry.example1, english: entry.example1English, type: 'sentence' });
      newSentencePool.push({ lithuanian: entry.example2, english: entry.example2English, type: 'sentence' });
    });
  
    // Filter correct/wrong piles to only keep cards in the new set
    const newWordSet = new Set(newWordPool);
  
    setCorrectPile(prev => prev.filter(word => newWordSet.has(word)));
    setWrongPile(prev => prev.filter(word => newWordSet.has(word)));
  
    // Set the new shuffled pools
    setPool(shuffle(newWordPool));
    setSentencePool(shuffle(newSentencePool));
  
    // Redraw the first card
    if (cardType === "word") {
      setCurrent(newWordPool.length > 0 ? newWordPool[0] : null);
    } else {
      setCurrent(newSentencePool.length > 0 ? newSentencePool[0] : null);
    }
  };


  // Reveal the translation (and optionally show example)
  function handleReveal() {
    if (!current) return;
    setShowEnglish(true);
  
    if (cardType === "word") {
      const exampleKey = Math.random() < 0.5 ? "example1" : "example2";
      setExampleSentence(current[exampleKey]);
  
      if (mode === "EN-LT") {
        setTimeout(() => {
          playAudio(current.number, "word");
        }, 400);
      }
    } else { // if cardType == "sentence"
      if (mode === "EN-LT") {
        setTimeout(() => {
          playAudio(current.number, current.exampleKey || "word");
        }, 400);
      }
    }
  }
  

  // Show a random example sentence without revealing the translation
  function handleExample() {
    if (!current) return;
    const chosen = Math.random() < 0.5 ? current.example1 : current.example2;
    setExampleSentence(chosen);
  }

  // After user self-assesses if they knew the card
  function handleSelfAssess(knewIt) {
    if (knewIt) {
      setCorrectPile(prev => [...prev, current]);
      if (cameFromWrongPile) {
        setWrongPile(prev => prev.filter(card => card !== current));
      }
    } else {
      if (!cameFromWrongPile) {
        setWrongPile(prev => [...prev, current]);
      }
    }
  
    if (!cameFromWrongPile) {
      if (cardType === "word") {
        setPool(prev => prev.filter(word => word !== current));
      } else {
        setSentencePool(prev => prev.filter(sentence => sentence !== current));
      }
    }
  
    setTimeout(() => {
      drawNextCard();
    }, 75); // just 50ms delay is enough
  }


  // Render a small pile (remaining, correct, wrong) with stacked bars
  const renderPile = (pile, color, label, position) => (
    <div className={`absolute bottom-4 ${position} flex flex-col items-center z-10`}>
      <p className="text-sm font-medium mb-1 z-50">{label}: {pile.length}</p>
      <div className="relative w-10 h-12 z-11">
        {pile.map((_, i) => (
          <div
            key={i}
            className={`absolute w-full h-6 ${color} rounded shadow-sm`}
            style={{ transform: `rotate(${jitterAngles[i % JITTER_COUNT]}deg) translateY(-${i * 2}px)`, zIndex: i }}
          />
        ))}
      </div>
    </div>
  );

  // Main UI
  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center p-4 bg-gray-100 text-gray-800">

      {/* Toggles for mode, card type, and initial set */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
        {/* Language direction toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm">EN → LT</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={mode === "LT-EN"}
              onChange={(e) => setMode(e.target.checked ? "LT-EN" : "EN-LT")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
          <span className="text-sm">LT → EN</span>
        </div>
      
        {/* Word vs Sentence toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Word</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={cardType === "sentence"}
              onChange={(e) => setCardType(e.target.checked ? "sentence" : "word")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
          <span className="text-sm">Sentence</span>
        </div>
      
        {/* Initial set toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            checked={initialSetEnabled}
            onChange={(e) => {
              const val = e.target.checked;
              setInitialSetEnabled(val);
              updatePoolWithSets(val);
            }}
          />
          <span className="text-sm">Initial Set (1–25)</span>
        </label>
      </div>
      {/* Audio toggle */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 items-center">
        <span className="text-sm">Audio</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={audioEnabled}
            onChange={(e) => setAudioEnabled(e.target.checked)}
          />
          <div className={`w-11 h-6 rounded-full bg-gray-200 transition-all duration-300 
            ${audioEnabled ? "ring-2 ring-green-500" : ""}  
            after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
            after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}>
          </div>
        </label>
        <span className="text-sm">{audioEnabled ? "On" : "Off"}</span>
      </div>



      {/* Flashcard view */}
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={(current ? current.lithuanian : "blank") + "-" + cardType + "-" + mode + (showEnglish ? "-a" : "-q")}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm z-50"
          >
            <Card className="text-center text-lg sm:text-xl">
              <CardContent>
                {/* Question side */}
                {!showEnglish && (
                  <>
                    <p className="text-2xl mb-4">
                      {mode === "LT-EN" ? current.lithuanian : current.english}
                    </p>
                    {exampleSentence && cardType === "word" && mode === "LT-EN" && (
                      <p className="text-md italic text-gray-600 mt-4">"{exampleSentence}"</p>
                    )}
                    <div className="flex flex-col gap-4 justify-around mt-6">
                      <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleReveal}>Reveal</Button>
                      {cardType === "word" && mode === "LT-EN" && (
                        <Button className="bg-purple-500 hover:bg-purple-600" onClick={handleExample}>Example sentence</Button>
                      )}
                    </div>
                  </>
                )}

                {/* Answer side */}
                {showEnglish && (
                  <>
                    <p className="text-2xl font-bold mb-4">
                      {mode === "LT-EN" ? current.english : current.lithuanian}
                    </p>
                    <div className="flex flex-row gap-3 justify-around mt-4">
                      <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleSelfAssess(true)}>Žinau</Button>
                      <Button className="bg-red-500 hover:bg-red-600" onClick={() => handleSelfAssess(false)}>Nežinau</Button>
                    </div>
                    {exampleSentence && cardType === "word" && (
                      <p className="text-md italic text-gray-600 mt-4">"{exampleSentence}"</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {/*
      <Button className="bg-yellow-500 hover:bg-yellow-600 mt-4" onClick={() => {
        const audioStr = './data/audio/blaster.mp3'
        const audio = new Audio(audioStr);
        audio.play().then(() => {
          console.log("Manual play success");
        }).catch(err => {
          console.error("Manual play failed:", err,audioStr);
        });
      }}>
        Test Play 1_word.mp3
      </Button>
      */}
      {/* Piles at the bottom */}
      {renderPile(correctPile, "bg-green-100", "Correct", "left-4")}
      {renderPile(wrongPile, "bg-red-100", "Wrong", "right-4")}
      {renderPile(cardType === "word" ? pool : sentencePool, "bg-white border border-gray-300", "Remaining", "left-1/2 transform -translate-x-1/2")}
    </div>
  );
}

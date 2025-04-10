import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const initialWords = [
  { english: "Time", german: "Die Zeit", plural: "Die Zeiten" },
  { english: "Man", german: "Der Mann", plural: "Die Männer" },
  { english: "Hand", german: "Die Hand", plural: "Die Hände" },
  { english: "Day", german: "Der Tag", plural: "Die Tage" },
  { english: "Way", german: "Der Weg", plural: "Die Wege" },
  { english: "Eye", german: "Das Auge", plural: "Die Augen" },
  { english: "Thing", german: "Die Sache", plural: "Die Sachen" },
  { english: "Head", german: "Der Kopf", plural: "Die Köpfe" },
  { english: "Year", german: "Das Jahr", plural: "Die Jahre" },
  { english: "Room", german: "Das Zimmer", plural: "Die Zimmer" },
  { english: "Door", german: "Die Tür", plural: "Die Türen" },
  { english: "Woman", german: "Die Frau", plural: "Die Frauen" },
  { english: "Face", german: "Das Gesicht", plural: "Die Gesichter" },
  { english: "Mother", german: "Die Mutter", plural: "Die Mütter" },
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function extractGender(germanWord) {
  return germanWord.split(" ")[0].toLowerCase();
}

function extractNoun(germanWord) {
  return germanWord.split(" ").slice(1).join(" ");
}

export default function FlashcardApp() {
  const [pool, setPool] = useState(() => shuffle(initialWords));
  const [wrongPile, setWrongPile] = useState([]);
  const [correctPile, setCorrectPile] = useState([]);
  const [current, setCurrent] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const drawNextCard = () => {
    let next = null;
    if (wrongPile.length > 0 && Math.random() < 0.2) {
      next = wrongPile[Math.floor(Math.random() * wrongPile.length)];
    } else if (pool.length > 0) {
      next = pool[Math.floor(Math.random() * pool.length)];
    }
    setCurrent(next);
  };

  useEffect(() => {
    if (!showAnswer) drawNextCard();
  }, [showAnswer]);

  const correctGender = current ? extractGender(current.german) : "";
  const nounOnly = current ? extractNoun(current.german) : "";

  const handleGuess = (guess) => {
    const isCorrect = guess.toLowerCase() === correctGender;
    if (isCorrect) {
      setCorrectPile([...correctPile, current]);
      setWrongPile(wrongPile.filter((word) => word !== current));
      setPool(pool.filter((word) => word !== current));
    } else {
      if (!wrongPile.includes(current)) {
        setWrongPile([...wrongPile, current]);
      }
    }
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
    }, 1000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-gray-800">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.german + (showAnswer ? "-a" : "-q")}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm z-10"
          >
            <Card className="text-center text-lg sm:text-xl">
              <CardContent>
                {showAnswer ? (
                  <>
                    <p className="text-gray-500">Correct answer:</p>
                    <p className="text-3xl font-bold mt-2">
                      {current.german.split(" ")[0].toLowerCase() + " " + extractNoun(current.german)}
                    </p>
                    <p className="text-sm mt-1">({current.english})</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold mb-4">{nounOnly}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-around mt-4">
                      <Button className="bg-red-500 hover:bg-red-600" onClick={() => handleGuess("der")}>der</Button>
                      <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => handleGuess("die")}>die</Button>
                      <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleGuess("das")}>das</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex flex-col sm:flex-row gap-6 text-center text-sm">
        <div>
          <p className="text-gray-600">Correct</p>
          <p className="text-green-600 text-xl font-bold">{correctPile.length}</p>
        </div>
        <div>
          <p className="text-gray-600">Wrong</p>
          <p className="text-red-600 text-xl font-bold">{wrongPile.length}</p>
        </div>
        <div>
          <p className="text-gray-600">Remaining</p>
          <p className="text-black text-xl font-bold">{pool.length}</p>
        </div>
      </div>
    </div>
  );
}

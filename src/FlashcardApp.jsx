import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import confetti from 'canvas-confetti';

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



// Local import for static file
import tsvText from './data/InitialSet.tsv?raw';
import tsvText1 from './data/Set1.tsv?raw';
import tsvText2 from './data/Set2.tsv?raw';
import tsvText3 from './data/Set3.tsv?raw';
import tsvText4 from './data/Set4.tsv?raw';
import tsvText5 from './data/Set5.tsv?raw';
import tsvText6 from './data/Set6.tsv?raw';
import tsvText7 from './data/Set7.tsv?raw';
import tsvText8 from './data/Set8.tsv?raw';
import tsvText9 from './data/Set9.tsv?raw';
import tsvText10 from './data/Set10.tsv?raw';
import tsvText11 from './data/Set11.tsv?raw';

function parseTSV(raw) {
  const rows = Papa.parse(raw.trim(), {
    delimiter: '\t',
    skipEmptyLines: true,
  }).data;

  return rows.map(([english, german, plural]) => ({
    english,
    german,
    plural,
  }));
}


const initialWords = parseTSV(tsvText);
const set1Words = parseTSV(tsvText1);
const set2Words = parseTSV(tsvText2);
const set3Words = parseTSV(tsvText3);
const set4Words = parseTSV(tsvText4);
const set5Words = parseTSV(tsvText5);
const set6Words = parseTSV(tsvText6);
const set7Words = parseTSV(tsvText7);
const set8Words = parseTSV(tsvText8);
const set9Words = parseTSV(tsvText9);
const set10Words = parseTSV(tsvText10);
const set11Words = parseTSV(tsvText11);

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
  const [initialSetEnabled, setInitialSetEnabled] = useState(true);
  const [set1Enabled, setSet1Enabled] = useState(false);
  const [set2Enabled, setSet2Enabled] = useState(false);
  const [set3Enabled, setSet3Enabled] = useState(false);
  const [set4Enabled, setSet4Enabled] = useState(false);
  const [set5Enabled, setSet5Enabled] = useState(false);
  const [set6Enabled, setSet6Enabled] = useState(false);
  const [set7Enabled, setSet7Enabled] = useState(false);
  const [set8Enabled, setSet8Enabled] = useState(false);
  const [set9Enabled, setSet9Enabled] = useState(false);
  const [set10Enabled, setSet10Enabled] = useState(false);
  const [set11Enabled, setSet11Enabled] = useState(false);
  const [celebrated, setCelebrated] = useState(false);


  const updatePoolWithSets = (initialEnabled, set1Enabled, set2Enabled, set3Enabled, set4Enabled, set5Enabled, set6Enabled,set7Enabled, set8Enabled, set9Enabled,set10Enabled,set11Enabled) => {
    let newPool = [];
    if (initialEnabled) newPool = [...newPool, ...initialWords];
    if (set1Enabled) newPool = [...newPool, ...set1Words];
    if (set2Enabled) newPool = [...newPool, ...set2Words];
    if (set3Enabled) newPool = [...newPool, ...set3Words];
    if (set4Enabled) newPool = [...newPool, ...set4Words];
    if (set5Enabled) newPool = [...newPool, ...set5Words];
    if (set6Enabled) newPool = [...newPool, ...set6Words];
    if (set7Enabled) newPool = [...newPool, ...set7Words];
    if (set8Enabled) newPool = [...newPool, ...set8Words];
    if (set9Enabled) newPool = [...newPool, ...set9Words];
    if (set10Enabled) newPool = [...newPool, ...set10Words];
    if (set11Enabled) newPool = [...newPool, ...set11Words];


    const newPoolSet = new Set(newPool);
    setCorrectPile(prev => prev.filter(word => newPoolSet.has(word)));
    setWrongPile(prev => prev.filter(word => newPoolSet.has(word)));
    const activePool = shuffle(newPool.filter(word =>
      !correctPile.includes(word) &&
      !wrongPile.includes(word)
    ));
    setPool(activePool);
    setCurrent(activePool[0] || null);
  };

const drawNextCard = () => {
  let next = null;

  const shouldDrawFromWrong = wrongPile.length > 0 && Math.random() < 0.2;
  const hasPool = pool.length > 0;

  if (shouldDrawFromWrong) {
    next = wrongPile[Math.floor(Math.random() * wrongPile.length)];
  } else if (hasPool) {
    next = pool[Math.floor(Math.random() * pool.length)];
  } else if (wrongPile.length > 0) {
    // fallback: if pool is empty, keep drawing from wrong
    next = wrongPile[Math.floor(Math.random() * wrongPile.length)];
  }

  setCurrent(next);
};

  useEffect(() => {
    if (!showAnswer) drawNextCard();
  }, [showAnswer]);

  useEffect(() => {
    const allCorrect = correctPile.length >0 && pool.length === 0 && wrongPile.length === 0;

    if (allCorrect) {
     confetti({
       particleCount: 80,
       spread: 70,
       origin: { y: 0.6 },
     });
    }
  }, [pool, wrongPile]);

  const correctGender = current ? extractGender(current.german) : "";
  const nounOnly = current ? extractNoun(current.german) : "";

  const handleGuess = (guess) => {
    const isCorrect = guess.toLowerCase() === correctGender;
    if (isCorrect) {
      setCorrectPile([...correctPile, current]);
      setWrongPile(wrongPile.filter(word => word !== current));
    } else {
      if (!wrongPile.includes(current)) {
        setWrongPile([...wrongPile, current]);
      }
    }
    setPool(pool.filter((word) => word !== current));
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
    }, 1000);
  };

  const renderPile = (pile, color, label, position) => (
    <div className={`absolute bottom-4 ${position} flex flex-col items-center z-10`}>
      <p className="text-sm font-medium mb-1 z-50">{label}: {pile.length}</p>
      <div className="relative w-10 h-12 z-11">
        {pile.map((_, i) => (
          <div
            key={i}
            className={`absolute w-full h-6 ${color} rounded shadow-sm`}
            style={{ transform: `rotate(${(Math.random() * 6 - 3).toFixed(2)}deg) translateY(-${i * 2}px)`, zIndex: i }}
          />
        ))}
      </div>
    </div>
  );

  const getAnswerColor = (gender) => {
    if (gender === "der") return "text-red-600";
    if (gender === "die") return "text-blue-600";
    if (gender === "das") return "text-green-600";
    return "text-black";
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="absolute top-4 left-4 max-h-[80vh] overflow-y-auto grid grid-cols-2 gap-x-6 gap-y-2 text-sm z-50 pr-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={initialSetEnabled}
            onChange={(e) => {
              const val = e.target.checked;
              setInitialSetEnabled(val);
              updatePoolWithSets(val, set1Enabled, set2Enabled, set3Enabled,set4Enabled, set5Enabled, set6Enabled,set7Enabled, set8Enabled, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Initial Set (1-25)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set1Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet1Enabled(val);
              updatePoolWithSets(initialSetEnabled, val, set2Enabled, set3Enabled, set4Enabled, set5Enabled, set6Enabled,set7Enabled, set8Enabled, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Set 1 (26-100)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set2Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet2Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, val, set3Enabled, set4Enabled, set5Enabled, set6Enabled,set7Enabled, set8Enabled, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Set 2 (101-200)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set3Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet3Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, val, set4Enabled, set5Enabled, set6Enabled,set7Enabled, set8Enabled, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Set 3 (201-300)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set4Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet4Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, set3Enabled, val, set5Enabled, set6Enabled,set7Enabled, set8Enabled, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Set 4 (301-400)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set5Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet5Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, set3Enabled, set4Enabled, val, set6Enabled,set7Enabled, set8Enabled, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Set 5 (401-500)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set6Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet6Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, set3Enabled, set4Enabled, set5Enabled, val ,set7Enabled, set8Enabled, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Set 6 (501-600)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set7Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet7Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, set3Enabled, set4Enabled, set5Enabled, set6Enabled, val, set8Enabled, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Set 7 (601-700)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set8Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet8Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, set3Enabled, set4Enabled, set5Enabled, set6Enabled, set7Enabled, val, set9Enabled,set10Enabled,set11Enabled);
            }}
          />
          Set 8 (701-800)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set9Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet9Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, set3Enabled, set4Enabled, set5Enabled, set6Enabled,set7Enabled, set8Enabled, val ,set10Enabled,set11Enabled);
            }}
          />
          Set 9 (801-900)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set10Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet10Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, set3Enabled, set4Enabled, set5Enabled, set6Enabled,set7Enabled, set8Enabled, set9Enabled,val,set11Enabled);
            }}
          />
          Set 10 (901-1000)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={set11Enabled}
            onChange={(e) => {
              const val = e.target.checked;
              setSet11Enabled(val);
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, set3Enabled, set4Enabled, set5Enabled, set6Enabled,set7Enabled, set8Enabled, set9Enabled,set10Enabled,val);
            }}
          />
          Set 11 (1001-1100)
        </label>
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.german + (showAnswer ? "-a" : "-q")}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm z-50"
          >
            <Card className="text-center text-lg sm:text-xl">
              <CardContent>
                {showAnswer ? (
                  <>
                    <p className="text-gray-500">Correct answer:</p>
                    <p className={`text-3xl font-bold mt-2 ${getAnswerColor(correctGender)}`}>
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

      {renderPile(correctPile, "bg-green-100", "Correct", "left-4")}
      {renderPile(wrongPile, "bg-red-100", "Wrong", "right-4")}
      {renderPile(pool, "bg-white border border-gray-300", "Remaining", "left-1/2 transform -translate-x-1/2")}
    </div>
  );
}
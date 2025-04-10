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
  { english: "People", german: "Die Leute", plural: "-" },
  { english: "Night", german: "Die Nacht", plural: "Die Nächte" },
  { english: "House", german: "Das Haus", plural: "Die Häuser" },
  { english: "Father", german: "Der Vater", plural: "Die Väter" },
  { english: "Life", german: "Das Leben", plural: "Die Leben" },
  { english: "Back", german: "Der Rücken", plural: "Die Rücken" },
  { english: "Voice", german: "Die Stimme", plural: "Die Stimmen" },
  { english: "Girl", german: "Das Mädchen", plural: "Die Mädchen" },
  { english: "Place", german: "Der Ort", plural: "Die Orte" },
  { english: "Boy", german: "Der Junge", plural: "Die Jungen" },
  { english: "Car", german: "Das Auto", plural: "Die Autos" }
];

const set1Words = [
  { english: "Side", german: "Die Seite", plural: "Die Seiten" },
  { english: "Arm", german: "Der Arm", plural: "Die Arme" },
  { english: "Child", german: "Das Kind", plural: "Die Kinder" },
  { english: "Word", german: "Das Wort", plural: "Die Wörter" },
  { english: "Moment", german: "Der Moment", plural: "Die Momente" },
  { english: "Hair", german: "Das Haar", plural: "Die Haare" },
  { english: "Foot", german: "Der Fuß", plural: "Die Füße" },
  { english: "Water", german: "Das Wasser", plural: "-" },
  { english: "Light", german: "Das Licht", plural: "Die Lichter" },
  { english: "World", german: "Die Welt", plural: "Die Welten" },
  { english: "Name", german: "Der Name", plural: "Die Namen" },
  { english: "Friend", german: "Der Freund", plural: "Die Freunde" },
  { english: "Window", german: "Das Fenster", plural: "Die Fenster" },
  { english: "Body", german: "Der Körper", plural: "Die Körper" },
  { english: "Table", german: "Der Tisch", plural: "Die Tische" },
  { english: "Morning", german: "Der Morgen", plural: "Die Morgen" },
  { english: "Bed", german: "Das Bett", plural: "Die Betten" },
  { english: "Wall", german: "Die Wand", plural: "Die Wände" },
  { english: "Street", german: "Die Straße", plural: "Die Straßen" },
  { english: "School", german: "Die Schule", plural: "Die Schulen" },
  { english: "Air", german: "Die Luft", plural: "-" },
  { english: "Floor", german: "Der Boden", plural: "Die Böden" },
  { english: "Hour", german: "Die Stunde", plural: "Die Stunden" },
  { english: "End", german: "Das Ende", plural: "Die Enden" },
  { english: "Family", german: "Die Familie", plural: "Die Familien" },
  { english: "Guy", german: "Der Kerl", plural: "Die Kerle" },
  { english: "Kind", german: "Das Kind", plural: "Die Kinder" },
  { english: "Minute", german: "Die Minute", plural: "Die Minuten" },
  { english: "Story", german: "Die Geschichte", plural: "Die Geschichten" },
  { english: "God", german: "Der Gott", plural: "Die Götter" },
  { english: "Week", german: "Die Woche", plural: "Die Wochen" },
  { english: "Work", german: "Die Arbeit", plural: "-" },
  { english: "Shoulder", german: "Die Schulter", plural: "Die Schultern" },
  { english: "Part", german: "Der Teil", plural: "Die Teile" },
  { english: "Mind", german: "Der Verstand", plural: "-" },
  { english: "Book", german: "Das Buch", plural: "Die Bücher" },
  { english: "Finger", german: "Der Finger", plural: "Die Finger" },
  { english: "Mouth", german: "Der Mund", plural: "Die Münder" },
  { english: "Kid", german: "Das Kind", plural: "Die Kinder" },
  { english: "Glass", german: "Das Glas", plural: "Die Gläser" },
  { english: "Tree", german: "Der Baum", plural: "Die Bäume" },
  { english: "Sound", german: "Der Klang", plural: "Die Klänge" },
  { english: "Line", german: "Die Linie", plural: "Die Linien" },
  { english: "Wife", german: "Die Ehefrau", plural: "Die Ehefrauen" },
  { english: "Heart", german: "Das Herz", plural: "Die Herzen" },
  { english: "Money", german: "Das Geld", plural: "-" },
  { english: "Phone", german: "Das Telefon", plural: "Die Telefone" },
  { english: "Look", german: "Der Blick", plural: "Die Blicke" },
  { english: "Leg", german: "Das Bein", plural: "Die Beine" },
  { english: "Chair", german: "Der Stuhl", plural: "Die Stühle" },
  { english: "Office", german: "Das Büro", plural: "Die Büros" },
  { english: "Brother", german: "Der Bruder", plural: "Die Brüder" },
  { english: "Question", german: "Die Frage", plural: "Die Fragen" },
  { english: "City", german: "Die Stadt", plural: "Die Städte" },
  { english: "Month", german: "Der Monat", plural: "Die Monate" },
  { english: "Baby", german: "Das Baby", plural: "Die Babys" },
  { english: "Home", german: "Das Zuhause", plural: "Die Zuhause" },
  { english: "Dog", german: "Der Hund", plural: "Die Hunde" },
  { english: "Road", german: "Die Straße", plural: "Die Straßen" },
  { english: "Idea", german: "Die Idee", plural: "Die Ideen" },
  { english: "Kitchen", german: "Die Küche", plural: "Die Küchen" },
  { english: "Lot", german: "Das Grundstück", plural: "Die Grundstücke" },
  { english: "Son", german: "Der Sohn", plural: "Die Söhne" },
  { english: "Job", german: "Der Job", plural: "Die Jobs" },
  { english: "Paper", german: "Das Papier", plural: "Die Papiere" },
  { english: "Sister", german: "Die Schwester", plural: "Die Schwestern" },
  { english: "Smile", german: "Das Lächeln", plural: "Die Lächeln" },
  { english: "Point", german: "Der Punkt", plural: "Die Punkte" },
  { english: "Thought", german: "Der Gedanke", plural: "Die Gedanken" },
  { english: "Love", german: "Die Liebe", plural: "-" },
  { english: "Town", german: "Die Stadt", plural: "Die Städte" },
  { english: "Death", german: "Der Tod", plural: "Die Tode" },
  { english: "Ground", german: "Der Boden", plural: "Die Böden" },
  { english: "Others", german: "Die Anderen", plural: "-" },
  { english: "Fire", german: "Das Feuer", plural: "Die Feuer" }
];

const set2Words = [
  { english: "Step", german: "Der Schritt", plural: "Die Schritte" },
  { english: "Blood", german: "Das Blut", plural: "-" },
  { english: "Fact", german: "Die Tatsache", plural: "Die Tatsachen" },
  { english: "Breath", german: "Der Atem", plural: "Die Atemzüge" },
  { english: "Lip", german: "Die Lippe", plural: "Die Lippen" },
  { english: "Sun", german: "Die Sonne", plural: "Die Sonnen" },
  { english: "Building", german: "Das Gebäude", plural: "Die Gebäude" },
  { english: "Number", german: "Die Nummer", plural: "Die Nummern" },
  { english: "Husband", german: "Der Ehemann", plural: "Die Ehemänner" },
  { english: "Parent", german: "Der Elternteil", plural: "Die Elternteile" },
  { english: "Corner", german: "Die Ecke", plural: "Die Ecken" },
  { english: "Problem", german: "Das Problem", plural: "Die Probleme" },
  { english: "Couple", german: "Das Paar", plural: "Die Paare" },
  { english: "Daughter", german: "Die Tochter", plural: "Die Töchter" },
  { english: "Bag", german: "Die Tasche", plural: "Die Taschen" },
  { english: "Hell", german: "Die Hölle", plural: "-" },
  { english: "Rest", german: "Die Ruhe", plural: "-" },
  { english: "Business", german: "Das Geschäft", plural: "Die Geschäfte" },
  { english: "Sky", german: "Der Himmel", plural: "Die Himmel" },
  { english: "Box", german: "Die Schachtel", plural: "Die Schachteln" },
  { english: "Person", german: "Die Person", plural: "Die Personen" },
  { english: "Reason", german: "Der Grund", plural: "Die Gründe" },
  { english: "Right", german: "Das Recht", plural: "-" },
  { english: "Skin", german: "Die Haut", plural: "Die Häute" },
  { english: "Dad", german: "Der Vater", plural: "Die Väter" },
  { english: "Case", german: "Der Fall", plural: "Die Fälle" },
  { english: "Piece", german: "Das Stück", plural: "Die Stücke" },
  { english: "Doctor", german: "Der Arzt", plural: "Die Ärzte" },
  { english: "Edge", german: "Der Rand", plural: "Die Ränder" },
  { english: "Mom", german: "Die Mutter", plural: "Die Mütter" },
  { english: "Picture", german: "Das Bild", plural: "Die Bilder" },
  { english: "Sense", german: "Der Sinn", plural: "Die Sinne" },
  { english: "Ear", german: "Das Ohr", plural: "Die Ohren" },
  { english: "Second", german: "Die Sekunde", plural: "Die Sekunden" },
  { english: "Lady", german: "Die Dame", plural: "Die Damen" },
  { english: "Neck", german: "Der Hals", plural: "Die Hälse" },
  { english: "Wind", german: "Der Wind", plural: "Die Winde" },
  { english: "Desk", german: "Der Schreibtisch", plural: "Die Schreibtische" },
  { english: "Gun", german: "Die Waffe", plural: "Die Waffen" },
  { english: "Stone", german: "Der Stein", plural: "Die Steine" },
  { english: "Coffee", german: "Der Kaffee", plural: "Die Kaffees" },
  { english: "Ship", german: "Das Schiff", plural: "Die Schiffe" },
  { english: "Earth", german: "Die Erde", plural: "-" },
  { english: "Food", german: "Das Essen", plural: "-" },
  { english: "Horse", german: "Das Pferd", plural: "Die Pferde" },
  { english: "Field", german: "Das Feld", plural: "Die Felder" },
  { english: "War", german: "Der Krieg", plural: "Die Kriege" },
  { english: "Afternoon", german: "Der Nachmittag", plural: "Die Nachmittage" },
  { english: "Sir", german: "Der Herr", plural: "Die Herren" },
  { english: "Space", german: "Der Raum", plural: "Die Räume" },
  { english: "Evening", german: "Der Abend", plural: "Die Abende" },
  { english: "Letter", german: "Der Brief", plural: "Die Briefe" },
  { english: "Bar", german: "Die Bar", plural: "Die Bars" },
  { english: "Dream", german: "Der Traum", plural: "Die Träume" },
  { english: "Apartment", german: "Die Wohnung", plural: "Die Wohnungen" },
  { english: "Chest", german: "Die Brust", plural: "Die Brüste" },
  { english: "Game", german: "Das Spiel", plural: "Die Spiele" },
  { english: "Summer", german: "Der Sommer", plural: "Die Sommer" },
  { english: "Matter", german: "Die Angelegenheit", plural: "Die Angelegenheiten" },
  { english: "Silence", german: "Die Stille", plural: "-" },
  { english: "Top", german: "Die Spitze", plural: "Die Spitzen" },
  { english: "Rock", german: "Der Felsen", plural: "Die Felsen" },
  { english: "Power", german: "Die Macht", plural: "-" },
  { english: "Clothes", german: "Die Kleidung", plural: "-" },
  { english: "Sign", german: "Das Schild", plural: "Die Schilder" },
  { english: "Attention", german: "Die Aufmerksamkeit", plural: "-" },
  { english: "Music", german: "Die Musik", plural: "-" },
  { english: "State", german: "Der Zustand", plural: "Die Zustände" },
  { english: "Pocket", german: "Die Tasche", plural: "Die Taschen" },
  { english: "Dinner", german: "Das Abendessen", plural: "Die Abendessen" },
  { english: "Hall", german: "Der Saal", plural: "Die Säle" },
  { english: "Pain", german: "Der Schmerz", plural: "Die Schmerzen" },
  { english: "Age", german: "Das Alter", plural: "-" },
  { english: "River", german: "Der Fluss", plural: "Die Flüsse" },
  { english: "Chance", german: "Die Chance", plural: "Die Chancen" },
  { english: "Nose", german: "Die Nase", plural: "Die Nasen" },
  { english: "Shadow", german: "Der Schatten", plural: "Die Schatten" },
  { english: "Police", german: "Die Polizei", plural: "-" },
  { english: "Memory", german: "Die Erinnerung", plural: "Die Erinnerungen" },
  { english: "Color", german: "Die Farbe", plural: "Die Farben" },
  { english: "Knee", german: "Das Knie", plural: "Die Knie" },
  { english: "Wood", german: "Das Holz", plural: "-" },
  { english: "Shirt", german: "Das Hemd", plural: "Die Hemden" },
  { english: "Party", german: "Die Party", plural: "Die Partys" },
  { english: "Country", german: "Das Land", plural: "Die Länder" },
  { english: "Truck", german: "Der Lastwagen", plural: "Die Lastwagen" },
  { english: "Tooth", german: "Der Zahn", plural: "Die Zähne" },
  { english: "Bill", german: "Die Rechnung", plural: "Die Rechnungen" },
  { english: "Scene", german: "Die Szene", plural: "Die Szenen" },
  { english: "Land", german: "Das Land", plural: "Die Länder" },
  { english: "Star", german: "Der Stern", plural: "Die Sterne" },
  { english: "Bird", german: "Der Vogel", plural: "Die Vögel" },
  { english: "Bedroom", german: "Das Schlafzimmer", plural: "Die Schlafzimmer" },
  { english: "Uncle", german: "Der Onkel", plural: "Die Onkel" },
  { english: "Sort", german: "Die Art", plural: "-" },
  { english: "Group", german: "Die Gruppe", plural: "Die Gruppen" },
  { english: "Truth", german: "Die Wahrheit", plural: "Die Wahrheiten" },
  { english: "Trouble", german: "Die Schwierigkeit", plural: "-" },
  { english: "Crowd", german: "Die Menschenmenge", plural: "Die Menschenmengen" },
  { english: "Station", german: "Der Bahnhof", plural: "Die Bahnhöfe" }
];

const set3Words = [
  { english: "Tear", german: "Die Träne", plural: "Die Tränen" },
  { english: "Class", german: "Die Klasse", plural: "Die Klassen" },
  { english: "Sea", german: "Das Meer", plural: "Die Meere" },
  { english: "Animal", german: "Das Tier", plural: "Die Tiere" },
  { english: "Center", german: "Das Zentrum", plural: "Die Zentren" },
  { english: "Feeling", german: "Das Gefühl", plural: "Die Gefühle" },
  { english: "Store", german: "Das Geschäft", plural: "Die Geschäfte" },
  { english: "Mountain", german: "Der Berg", plural: "Die Berge" },
  { english: "News", german: "Die Nachrichten", plural: "-" },
  { english: "Shoe", german: "Der Schuh", plural: "Die Schuhe" },
  { english: "Cat", german: "Die Katze", plural: "Die Katzen" },
  { english: "Screen", german: "Der Bildschirm", plural: "Die Bildschirme" },
  { english: "Bottle", german: "Die Flasche", plural: "Die Flaschen" },
  { english: "Call", german: "Der Anruf", plural: "Die Anrufe" },
  { english: "Living", german: "Das Wohnzimmer", plural: "Die Wohnzimmer" },
  { english: "Cheek", german: "Die Wange", plural: "Die Wangen" },
  { english: "Student", german: "Der Student", plural: "Die Studenten" },
  { english: "Ball", german: "Der Ball", plural: "Die Bälle" },
  { english: "Sight", german: "Der Anblick", plural: "Die Anblicke" },
  { english: "Hill", german: "Der Hügel", plural: "Die Hügel" },
  { english: "Company", german: "Das Unternehmen", plural: "Die Unternehmen" },
  { english: "Church", german: "Die Kirche", plural: "Die Kirchen" },
  { english: "Rain", german: "Der Regen", plural: "Die Regen" },
  { english: "Suit", german: "Der Anzug", plural: "Die Anzüge" },
  { english: "One", german: "Die Eins", plural: "-" },
  { english: "Direction", german: "Die Richtung", plural: "Die Richtungen" },
  { english: "Will", german: "Der Wille", plural: "-" },
  { english: "Throat", german: "Der Hals", plural: "Die Hälse" },
  { english: "Middle", german: "Die Mitte", plural: "-" },
  { english: "Answer", german: "Die Antwort", plural: "Die Antworten" },
  { english: "Stuff", german: "Das Zeug", plural: "-" },
  { english: "Hospital", german: "Das Krankenhaus", plural: "Die Krankenhäuser" },
  { english: "Camera", german: "Die Kamera", plural: "Die Kameras" },
  { english: "Dress", german: "Das Kleid", plural: "Die Kleider" },
  { english: "Card", german: "Die Karte", plural: "Die Karten" },
  { english: "Yard", german: "Der Hof", plural: "Die Höfe" },
  { english: "Dark", german: "Die Dunkelheit", plural: "-" },
  { english: "Shit", german: "Die Scheiße", plural: "-" },
  { english: "Image", german: "Das Bild", plural: "Die Bilder" },
  { english: "Machine", german: "Die Maschine", plural: "Die Maschinen" },
  { english: "Distance", german: "Die Entfernung", plural: "Die Entfernungen" },
  { english: "Area", german: "Das Gebiet", plural: "Die Gebiete" },
  { english: "Narrator", german: "Der Erzähler", plural: "Die Erzähler" },
  { english: "Ice", german: "Das Eis", plural: "Die Eis" },
  { english: "Snow", german: "Der Schnee", plural: "-" },
  { english: "Note", german: "Die Notiz", plural: "Die Notizen" },
  { english: "Mirror", german: "Der Spiegel", plural: "Die Spiegel" },
  { english: "King", german: "Der König", plural: "Die Könige" },
  { english: "Fear", german: "Die Angst", plural: "-" },
  { english: "Officer", german: "Der Beamte", plural: "Die Beamten" },
  { english: "Hole", german: "Das Loch", plural: "Die Löcher" },
  { english: "Shot", german: "Der Schuss", plural: "Die Schüsse" },
  { english: "Guard", german: "Der Wächter", plural: "Die Wächter" },
  { english: "Conversation", german: "Das Gespräch", plural: "Die Gespräche" },
  { english: "Boat", german: "Das Boot", plural: "Die Boote" },
  { english: "System", german: "Das System", plural: "Die Systeme" },
  { english: "Care", german: "Die Sorge", plural: "Die Sorgen" },
  { english: "Bit", german: "Das Bit", plural: "Die Bits" },
  { english: "Movie", german: "Der Film", plural: "Die Filme" },
  { english: "Bone", german: "Der Knochen", plural: "Die Knochen" },
  { english: "Page", german: "Die Seite", plural: "Die Seiten" },
  { english: "Captain", german: "Der Kapitän", plural: "Die Kapitäne" },
  { english: "Aunt", german: "Die Tante", plural: "Die Tanten" },
  { english: "Darkness", german: "Die Dunkelheit", plural: "-" },
  { english: "Control", german: "Die Kontrolle", plural: "Die Kontrollen" },
  { english: "Drink", german: "Das Getränk", plural: "Die Getränke" },
  { english: "Hotel", german: "Das Hotel", plural: "Die Hotels" },
  { english: "Coat", german: "Der Mantel", plural: "Die Mäntel" },
  { english: "Stair", german: "Die Treppe", plural: "Die Treppen" },
  { english: "Order", german: "Die Bestellung", plural: "Die Bestellungen" },
  { english: "Rose", german: "Die Rose", plural: "Die Rosen" },
  { english: "Miss", german: "Die Miss", plural: "-" },
  { english: "Hat", german: "Der Hut", plural: "Die Hüte" },
  { english: "Gold", german: "Das Gold", plural: "-" },
  { english: "Cigarette", german: "Die Zigarette", plural: "Die Zigaretten" },
  { english: "Cloud", german: "Die Wolke", plural: "Die Wolken" },
  { english: "View", german: "Die Aussicht", plural: "Die Aussichten" },
  { english: "Driver", german: "Der Fahrer", plural: "Die Fahrer" },
  { english: "Cup", german: "Die Tasse", plural: "Die Tassen" },
  { english: "Figure", german: "Die Figur", plural: "Die Figuren" },
  { english: "Expression", german: "Der Ausdruck", plural: "Die Ausdrücke" },
  { english: "Path", german: "Der Weg", plural: "Die Wege" },
  { english: "Key", german: "Der Schlüssel", plural: "Die Schlüssel" },
  { english: "Computer", german: "Der Computer", plural: "Die Computer" },
  { english: "Flower", german: "Die Blume", plural: "Die Blumen" },
  { english: "Ring", german: "Der Ring", plural: "Die Ringe" },
  { english: "Bathroom", german: "Das Badezimmer", plural: "Die Badezimmer" },
  { english: "Metal", german: "Das Metall", plural: "Die Metalle" },
  { english: "Moon", german: "Der Mond", plural: "Die Monde" },
  { english: "Song", german: "Das Lied", plural: "Die Lieder" },
  { english: "Soldier", german: "Der Soldat", plural: "Die Soldaten" },
  { english: "Radio", german: "Das Radio", plural: "Die Radios" },
  { english: "History", german: "Die Geschichte", plural: "Die Geschichten" },
  { english: "Wave", german: "Die Welle", plural: "Die Wellen" },
  { english: "Plan", german: "Der Plan", plural: "Die Pläne" },
  { english: "College", german: "Das College", plural: "Die Colleges" },
  { english: "Fish", german: "Der Fisch", plural: "Die Fische" },
  { english: "Garden", german: "Der Garten", plural: "Die Gärten" },
  { english: "Train", german: "Der Zug", plural: "Die Züge" },
  { english: "Shop", german: "Das Geschäft", plural: "Die Geschäfte" }
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
  const [initialSetEnabled, setInitialSetEnabled] = useState(true);
  const [set1Enabled, setSet1Enabled] = useState(false);
  const [set2Enabled, setSet2Enabled] = useState(false);
  const [set3Enabled, setSet3Enabled] = useState(false);

  const updatePoolWithSets = (initialEnabled, set1Enabled, set2Enabled, set3Enabled) => {
    let newPool = [];
    if (initialEnabled) newPool = [...newPool, ...initialWords];
    if (set1Enabled) newPool = [...newPool, ...set1Words];
    if (set2Enabled) newPool = [...newPool, ...set2Words];
    if (set3Enabled) newPool = [...newPool, ...set3Words];

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
      <p className="text-sm font-medium mb-1 z-20">{label}: {pile.length}</p>
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
      <div className="absolute top-4 left-4 flex flex-col gap-2 text-sm z-50">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={initialSetEnabled}
            onChange={(e) => {
              const val = e.target.checked;
              setInitialSetEnabled(val);
              updatePoolWithSets(val, set1Enabled, set2Enabled, set3Enabled);
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
              updatePoolWithSets(initialSetEnabled, val, set2Enabled, set3Enabled);
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
              updatePoolWithSets(initialSetEnabled, set1Enabled, val, set3Enabled);
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
              updatePoolWithSets(initialSetEnabled, set1Enabled, set2Enabled, val);
            }}
          />
          Set 3 (201-300)
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
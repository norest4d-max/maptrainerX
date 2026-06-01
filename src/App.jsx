import React, { useMemo, useState } from 'react';
import { generateCards, lessonSlides, zoneGuide } from './data/validatedCardFactory.js';
import { getRank, pickAdaptiveCard, updateStats } from './utils/adaptiveTrainer.js';

function MiniMap() {
  const blocks = [
    ['BI1', 'BI2', 'SR1'],
    ['CR1', 'DROP', 'CS1'],
    ['BO3', 'BO4', 'CS2'],
    ['BO5', 'BO6', 'HYDROGEN'],
    ['OFFICE', 'A-Z AISLES', 'GUARD']
  ];
  return <div className="map-card">
    <div className="map-title">MAP BREAKDOWN</div>
    <div className="map-grid">{blocks.flat().map((b) => <div className="map-cell" key={b}>{b}</div>)}</div>
    <p className="tiny">Simple map first. Real map later. Brain first, pacer second.</p>
  </div>;
}

function Lesson({ slide, setSlide, startPractice }) {
  const lesson = lessonSlides[slide];
  return <section className="panel lesson">
    <div className="card-id">TEACH MODE • Slide {slide + 1} of {lessonSlides.length}</div>
    <h2>{lesson.title}</h2>
    <p>{lesson.body}</p>
    <div className="rule">RULE: {lesson.rule}</div>
    <div className="lesson-buttons">
      <button onClick={() => setSlide(Math.max(0, slide - 1))}>Back</button>
      {slide < lessonSlides.length - 1 ? <button onClick={() => setSlide(slide + 1)}>Next Lesson</button> : <button onClick={startPractice}>Start Practice</button>}
    </div>
  </section>;
}

function Guide() {
  return <section className="panel guide">
    <h2>Zone + Stack Guide</h2>
    {Object.entries(zoneGuide).map(([key, item]) => <div className="guide-row" key={key}>
      <strong>{key}</strong><span>{item.name}</span><em>{item.purpose}<br />Stack: {item.stack}</em>
    </div>)}
  </section>;
}

export default function App() {
  const cards = useMemo(() => generateCards(1000), []);
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('maptrainer-stats') || '{}'));
  const [xp, setXp] = useState(() => Number(localStorage.getItem('maptrainer-xp') || 0));
  const [level, setLevel] = useState('all');
  const [mode, setMode] = useState('teach');
  const [slide, setSlide] = useState(0);
  const [card, setCard] = useState(() => cards[0]);
  const [feedback, setFeedback] = useState('Teach first. Then practice. Every card has one correct answer only.');

  function startPractice() {
    setMode('practice');
    setCard(pickAdaptiveCard(cards, stats, level));
  }

  function nextCard(nextStats = stats) {
    setCard(pickAdaptiveCard(cards, nextStats, level));
  }

  function answer(choice, index) {
    const correct = index === card.answerIndex;
    const nextStats = updateStats(stats, card.id, correct);
    setStats(nextStats);
    localStorage.setItem('maptrainer-stats', JSON.stringify(nextStats));
    if (correct) {
      const nextXp = xp + 10;
      setXp(nextXp);
      localStorage.setItem('maptrainer-xp', String(nextXp));
      setFeedback(card.correctMessage);
      playTone(880);
    } else {
      setFeedback(card.wrongMessage + ' ' + card.explanation);
      playTone(180);
    }
    setTimeout(() => nextCard(nextStats), 1200);
  }

  function playTone(freq) {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  const missed = Object.values(stats).reduce((sum, s) => sum + (s.wrong || 0), 0);
  const right = Object.values(stats).reduce((sum, s) => sum + (s.right || 0), 0);

  return <main className="shell">
    <header className="hero">
      <div>
        <p className="eyebrow">MAPTRAINERX // GBA PAPER WHITE</p>
        <h1>Warehouse Stack Logic</h1>
        <p>Learn the map as a 3D warehouse: zone purpose, product family, 4-stack safety, customer access, and clear travel paths.</p>
      </div>
      <MiniMap />
    </header>

    <section className="hud">
      <span>Mode: {mode.toUpperCase()}</span><span>XP: {xp}</span><span>Rank: {getRank(xp)}</span><span>Right: {right}</span><span>Wrong: {missed}</span>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="all">All Practice</option><option value="2">Support Areas</option><option value="3">Bulk + 4 Stack</option><option value="4">Customer Flow</option><option value="5">Hard Decisions</option>
      </select>
      <button onClick={() => setMode('teach')}>Teach</button><button onClick={startPractice}>Practice</button>
    </section>

    {mode === 'teach' ? <Lesson slide={slide} setSlide={setSlide} startPractice={startPractice} /> : <section className="panel quiz">
      <div className="card-id">{card.id} • {card.skill} • Level {card.level} • Target: {card.zone}</div>
      <h2>{card.prompt}</h2>
      <div className="choices">{card.choices.map((choice, index) => <button key={choice} onClick={() => answer(choice, index)}>{String.fromCharCode(65 + index)}) {choice}</button>)}</div>
      <div className="feedback">{feedback}</div>
    </section>}

    <Guide />
  </main>;
}

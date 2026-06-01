import React, { useMemo, useState } from 'react';
import { generateCards, zoneGuide } from './data/cardFactory.js';
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
    <div className="map-title">PAPER MAP MODE</div>
    <div className="map-grid">{blocks.flat().map((b) => <div className="map-cell" key={b}>{b}</div>)}</div>
  </div>;
}

function Guide() {
  return <section className="panel guide">
    <h2>Map Logic</h2>
    {Object.entries(zoneGuide).map(([key, item]) => <div className="guide-row" key={key}>
      <strong>{key}</strong><span>{item.name}</span><em>{item.memory}</em>
    </div>)}
  </section>;
}

export default function App() {
  const cards = useMemo(() => generateCards(1000), []);
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('maptrainer-stats') || '{}'));
  const [xp, setXp] = useState(() => Number(localStorage.getItem('maptrainer-xp') || 0));
  const [level, setLevel] = useState('all');
  const [card, setCard] = useState(() => cards[0]);
  const [feedback, setFeedback] = useState('Press an answer. Correct goes DING. Wrong goes BUZZ and tells you why.');

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
    setTimeout(() => nextCard(nextStats), 900);
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
        <h1>Warehouse Memory Cartridge</h1>
        <p>Learn the map by purpose: BI, BO, CS, CR, SR, Drop, Office, and Hydrogen. The app repeats what you miss until your brain stops wandering like a loose pallet.</p>
      </div>
      <MiniMap />
    </header>

    <section className="hud">
      <span>XP: {xp}</span><span>Rank: {getRank(xp)}</span><span>Right: {right}</span><span>Wrong: {missed}</span>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="all">All Levels</option><option value="2">Support Areas</option><option value="3">Bulk Zones</option><option value="4">Customer Zones</option><option value="5">Hard Mode</option>
      </select>
    </section>

    <section className="panel quiz">
      <div className="card-id">{card.id} • Level {card.level} • Target: {card.zone}</div>
      <h2>{card.prompt}</h2>
      <div className="choices">{card.choices.map((choice, index) => <button key={choice} onClick={() => answer(choice, index)}>{String.fromCharCode(65 + index)}) {choice}</button>)}</div>
      <div className="feedback">{feedback}</div>
    </section>

    <Guide />
  </main>;
}

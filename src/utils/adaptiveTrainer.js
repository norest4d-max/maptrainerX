export function getCardWeight(card, stats = {}) {
  const record = stats[card.id] || { right: 0, wrong: 0 };
  return 1 + record.wrong * 4 + Math.max(0, 3 - record.right);
}

export function pickAdaptiveCard(cards, stats = {}, level = 'all') {
  const pool = level === 'all' ? cards : cards.filter((card) => String(card.level) === String(level));
  const safePool = pool.length ? pool : cards;
  const weighted = safePool.map((card) => ({ card, weight: getCardWeight(card, stats) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;

  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.card;
  }

  return safePool[0];
}

export function updateStats(stats, cardId, wasCorrect) {
  const current = stats[cardId] || { right: 0, wrong: 0, streak: 0 };
  const next = {
    right: current.right + (wasCorrect ? 1 : 0),
    wrong: current.wrong + (wasCorrect ? 0 : 1),
    streak: wasCorrect ? current.streak + 1 : 0,
    lastResult: wasCorrect ? 'right' : 'wrong',
    lastSeen: Date.now()
  };

  return { ...stats, [cardId]: next };
}

export function getRank(xp) {
  if (xp >= 1000) return 'Warehouse Legend';
  if (xp >= 750) return 'Inventory Wizard';
  if (xp >= 500) return 'Forklift Knight';
  if (xp >= 250) return 'Rack Ranger';
  if (xp >= 100) return 'Pallet Scout';
  return 'Rookie With A Clipboard';
}

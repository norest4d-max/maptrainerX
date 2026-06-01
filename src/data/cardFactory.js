const zones = {
  BI1: { name: 'Bulk Inside 1', purpose: 'big indoor bulk product', memory: 'BI = Big Inside', examples: ['flooring pallet', 'large appliance', 'lumber bundle', 'boxed patio set'] },
  BI2: { name: 'Bulk Inside 2', purpose: 'overflow indoor bulk product', memory: 'BI2 is still Big Inside, just the sequel', examples: ['tile pallet', 'doors', 'large boxed stock', 'indoor heavy product'] },
  BO3: { name: 'Bulk Outside 3', purpose: 'outdoor heavy product', memory: 'BO = Big Outside', examples: ['concrete bags', 'pavers', 'bricks', 'mulch pallet'] },
  BO4: { name: 'Bulk Outside 4', purpose: 'outdoor heavy product', memory: 'Outside stuff that would laugh at rain', examples: ['soil pallet', 'stone', 'retaining blocks', 'bagged rock'] },
  BO5: { name: 'Bulk Outside 5', purpose: 'outdoor bulk overflow', memory: 'BO5 is outdoor bulk, not customer pickup daycare', examples: ['garden block pallet', 'sand bags', 'landscape material', 'large outdoor stock'] },
  BO6: { name: 'Bulk Outside 6', purpose: 'far outside bulk storage', memory: 'The outer lands of bulky outside stuff', examples: ['extra pavers', 'concrete overflow', 'bulk seasonal outdoor stock', 'bagged gravel'] },
  CS1: { name: 'Customer Staging 1', purpose: 'completed customer orders waiting for pickup', memory: 'CS = Customer Says: where is my order?', examples: ['online pickup order', 'will-call appliance', 'completed flooring order', 'customer toilet order'] },
  CS2: { name: 'Customer Staging 2', purpose: 'more customer order staging', memory: 'CS2 = Customer Staging sequel', examples: ['second pickup order', 'staged delivery item', 'finished BOPIS order', 'customer special order'] },
  CR1: { name: 'Customer Rack 1', purpose: 'customer-related rack storage', memory: 'CR = Customer Rack, not Concrete Realm', examples: ['customer rack pallet', 'organized customer stock', 'order-related rack item', 'customer hold item'] },
  SR1: { name: 'Select Rack 1', purpose: 'fast-pick selected inventory', memory: 'SR = Speedy Retrieval', examples: ['frequently picked box', 'quick access stock', 'repeatedly selected item', 'fast moving SKU'] },
  DROP: { name: 'Drop Waiting Area', purpose: 'temporary pallet parking while deciding next move', memory: 'Drop means pause, not forever-home', examples: ['unknown pallet', 'waiting-to-be-assigned pallet', 'short-term staging pallet', 'pallet needing direction'] },
  HYDROGEN: { name: 'Hydrogen Charger', purpose: 'equipment refuel or charge area, not product storage', memory: 'Forklifts eat here. Pallets do not.', examples: ['equipment recharge', 'pacer power stop', 'hydrogen fuel area', 'MHE charging'] },
  OFFICE: { name: 'Office / Guard Shack', purpose: 'people, paperwork, check-in, not pallet storage', memory: 'Clipboards live here. Concrete does not.', examples: ['driver check-in', 'paperwork', 'supervisor question', 'security check'] }
};

const wrongPool = ['BI1','BI2','BO3','BO4','BO5','BO6','CS1','CS2','CR1','SR1','DROP','HYDROGEN','OFFICE'];

function choicesFor(answer) {
  const choices = [answer];
  while (choices.length < 4) {
    const pick = wrongPool[Math.floor(Math.random() * wrongPool.length)];
    if (!choices.includes(pick)) choices.push(pick);
  }
  return choices.sort(() => Math.random() - 0.5);
}

function makeCard(id, level, zoneKey, prompt, funnyWrong = '') {
  const zone = zones[zoneKey];
  const choices = choicesFor(zoneKey);
  return {
    id: `MAP-${String(id).padStart(4, '0')}`,
    level,
    zone: zoneKey,
    prompt,
    choices,
    answer: zoneKey,
    answerIndex: choices.indexOf(zoneKey),
    correctMessage: `🔔 DING! ${zoneKey} is right. ${zone.memory}. +10 XP. You avoided becoming a lost pallet NPC.`,
    wrongMessage: `❌ BUZZ! Not quite. Correct answer: ${zoneKey}. ${zone.name} is for ${zone.purpose}. ${funnyWrong || 'The warehouse goblins have been notified.'}`,
    explanation: `${zoneKey}: ${zone.name}. Purpose: ${zone.purpose}. Memory hook: ${zone.memory}.`
  };
}

export function generateCards(total = 1000) {
  let id = 1;
  const cards = [];
  const zoneKeys = Object.keys(zones);

  const templates = [
    (z, item) => `Scenario: ${item} arrives. Where is the most logical home for it?`,
    (z, item) => `A teammate asks where to place a ${item}. What zone should you send them to?`,
    (z) => `What is the main purpose of ${z}?`,
    (z) => `You are speed-checking the map. Which zone matches this purpose: ${zones[z].purpose}?`,
    (z, item) => `Boss says: “Do not make this weird.” You have ${item}. Pick the correct zone.`,
    (z, item) => `A ${item} is sitting in the wrong spot looking embarrassed. Where should it actually go?`,
    (z) => `Memory hook check: ${zones[z].memory}. Which map label does this describe?`,
    (z, item) => `Warehouse goblin challenge: place ${item} without creating chaos.`
  ];

  while (cards.length < total) {
    for (const z of zoneKeys) {
      const info = zones[z];
      for (const item of info.examples) {
        const level = z === 'HYDROGEN' || z === 'OFFICE' ? 2 : z.startsWith('BO') ? 3 : z.startsWith('CS') ? 4 : z === 'DROP' ? 5 : z === 'SR1' || z === 'CR1' ? 5 : 3;
        const template = templates[id % templates.length];
        cards.push(makeCard(id++, level, z, template(z, item), `Do not send ${item} on a side quest.`));
        if (cards.length >= total) return cards;
      }
    }
  }
  return cards;
}

export const zoneGuide = zones;

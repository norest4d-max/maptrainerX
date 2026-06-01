const zones = {
  BI1: { name: 'Bulk Inside 1', purpose: 'big indoor bulk product', memory: 'BI = Big Inside', stack: 'Stack stable matching indoor pallets only when the site allows it.', examples: ['flooring pallet', 'large appliance', 'lumber bundle', 'boxed patio set'] },
  BI2: { name: 'Bulk Inside 2', purpose: 'overflow indoor bulk product', memory: 'BI2 is still Big Inside, just the sequel', stack: 'Use as indoor bulk overflow. Match product families before stacking.', examples: ['tile pallet', 'doors', 'large boxed stock', 'indoor heavy product'] },
  BO3: { name: 'Bulk Outside 3', purpose: 'outdoor heavy product', memory: 'BO = Big Outside', stack: 'Outdoor bulk can often stack well when heavy, square, matching, and stable.', examples: ['concrete bags', 'pavers', 'bricks', 'mulch pallet'] },
  BO4: { name: 'Bulk Outside 4', purpose: 'outdoor heavy product', memory: 'Outside stuff that would laugh at rain', stack: 'Good for outdoor product groups. Do not mix random products just because space exists.', examples: ['soil pallet', 'stone', 'retaining blocks', 'bagged rock'] },
  BO5: { name: 'Bulk Outside 5', purpose: 'outdoor bulk overflow', memory: 'BO5 is outdoor bulk, not customer pickup daycare', stack: 'Think 4-stack only if same product, stable pallet, clear path, and supervisor rules allow it.', examples: ['garden block pallet', 'sand bags', 'landscape material', 'large outdoor stock'] },
  BO6: { name: 'Bulk Outside 6', purpose: 'far outside bulk storage', memory: 'The outer lands of bulky outside stuff', stack: 'Far outside bulk storage. Great for overflow, bad for customer order hide-and-seek.', examples: ['extra pavers', 'concrete overflow', 'bulk seasonal outdoor stock', 'bagged gravel'] },
  CS1: { name: 'Customer Staging 1', purpose: 'completed customer orders waiting for pickup', memory: 'CS = Customer Says: where is my order?', stack: 'Customer orders should stay findable. Do not bury them in a 4-stack unless told.', examples: ['online pickup order', 'will-call appliance', 'completed flooring order', 'customer toilet order'] },
  CS2: { name: 'Customer Staging 2', purpose: 'more customer order staging', memory: 'CS2 = Customer Staging sequel', stack: 'Staged orders need labels visible and fast access. Customer pickup is not a treasure hunt.', examples: ['second pickup order', 'staged delivery item', 'finished BOPIS order', 'customer special order'] },
  CR1: { name: 'Customer Rack 1', purpose: 'customer-related rack storage', memory: 'CR = Customer Rack, not Concrete Realm', stack: 'Rack logic means organized and findable. Match the customer/order flow.', examples: ['customer rack pallet', 'organized customer stock', 'order-related rack item', 'customer hold item'] },
  SR1: { name: 'Select Rack 1', purpose: 'fast-pick selected inventory', memory: 'SR = Speedy Retrieval', stack: 'Fast-pick areas should not be blocked by huge stacks. Keep access easy.', examples: ['frequently picked box', 'quick access stock', 'repeatedly selected item', 'fast moving SKU'] },
  DROP: { name: 'Drop Waiting Area', purpose: 'temporary pallet parking while deciding next move', memory: 'Drop means pause, not forever-home', stack: 'Temporary means temporary. Do not build a pallet castle here.', examples: ['unknown pallet', 'waiting-to-be-assigned pallet', 'short-term staging pallet', 'pallet needing direction'] },
  HYDROGEN: { name: 'Hydrogen Charger', purpose: 'equipment refuel or charge area, not product storage', memory: 'Forklifts eat here. Pallets do not.', stack: 'No stacking product here. This is for equipment support.', examples: ['equipment recharge', 'pacer power stop', 'hydrogen fuel area', 'MHE charging'] },
  OFFICE: { name: 'Office / Guard Shack', purpose: 'people, paperwork, check-in, not pallet storage', memory: 'Clipboards live here. Concrete does not.', stack: 'No product stacking here. People and paperwork only.', examples: ['driver check-in', 'paperwork', 'supervisor question', 'security check'] }
};

const wrongPool = Object.keys(zones);

export const lessonSlides = [
  { title: '1. Read the map by purpose first', body: 'Do not start with every tiny line. First ask: is this bulk, customer, fast-pick, temporary, or support?', rule: 'Purpose first. Exact spot second.' },
  { title: '2. Add the 4-stack rule', body: 'Stacks make the warehouse 3D. A pallet belongs to a zone, then it belongs with matching product, then it must be safe to stack.', rule: 'Zone first. Product match second. Stack safety third. Clear path always.' },
  { title: '3. Customer areas stay findable', body: 'CS and CR are about customer flow. Do not hide customer orders under a mountain unless your lead tells you.', rule: 'Customer order = easy to locate.' },
  { title: '4. Bulk areas hold the heavy families', body: 'BI is indoor bulk. BO is outside bulk. These are the most likely places for repeated 4-stacks of similar product.', rule: 'Bulk zones like families, not random soup.' },
  { title: '5. Drop areas are pauses', body: 'A drop area is not a forever home. It is a waiting room for pallets that still need a decision.', rule: 'Drop means pause, then move.' }
];

function choicesFor(answer) {
  const choices = [answer];
  while (choices.length < 4) {
    const pick = wrongPool[Math.floor(Math.random() * wrongPool.length)];
    if (!choices.includes(pick)) choices.push(pick);
  }
  return choices.sort(() => Math.random() - 0.5);
}

function makeCard(id, level, zoneKey, prompt, funnyWrong = '', skill = 'zone') {
  const zone = zones[zoneKey];
  const choices = choicesFor(zoneKey);
  return {
    id: `MAP-${String(id).padStart(4, '0')}`,
    level,
    skill,
    zone: zoneKey,
    prompt,
    choices,
    answer: zoneKey,
    answerIndex: choices.indexOf(zoneKey),
    correctMessage: `DING! ${zoneKey} is right. ${zone.memory}. +10 XP. Solid pallet brain.`,
    wrongMessage: `BUZZ! Correct answer: ${zoneKey}. ${zone.name} is for ${zone.purpose}. ${funnyWrong || 'The pallet took the scenic route.'}`,
    explanation: `${zoneKey}: ${zone.name}. Purpose: ${zone.purpose}. Stack logic: ${zone.stack}`
  };
}

function levelFor(z) {
  if (z === 'HYDROGEN' || z === 'OFFICE') return 2;
  if (z.startsWith('BO') || z.startsWith('BI')) return 3;
  if (z.startsWith('CS')) return 4;
  return 5;
}

export function generateCards(total = 1000) {
  let id = 1;
  const cards = [];
  const zoneKeys = Object.keys(zones);
  const templates = [
    (z, item) => [`Scenario: ${item} arrives. What zone is its logical home?`, 'zone'],
    (z, item) => [`4-stack check: there are 3 matching stable pallets of ${item}. Where does the 4th most likely belong?`, 'stack'],
    (z) => [`Purpose check: which zone matches this purpose: ${zones[z].purpose}?`, 'purpose'],
    (z) => [`Memory hook: ${zones[z].memory}. Which map label is this?`, 'memory'],
    (z, item) => [`A ${item} is in the wrong place looking ashamed. Where should it actually go?`, 'scenario'],
    (z) => [`Stack rule check: ${zones[z].stack} Which zone does this rule describe?`, 'stack'],
    (z, item) => [`Lead says: keep paths clear and group similar pallets. You have ${item}. Pick the best zone.`, 'workflow'],
    (z, item) => [`Customer/pallet logic: ${item}. Do not make a warehouse side quest. Where goes it?`, 'scenario']
  ];

  while (cards.length < total) {
    for (const z of zoneKeys) {
      const info = zones[z];
      for (const item of info.examples) {
        const template = templates[id % templates.length];
        const [prompt, skill] = template(z, item);
        cards.push(makeCard(id++, levelFor(z), z, prompt, `Do not send ${item} to the wrong kingdom.`, skill));
        if (cards.length >= total) return cards;
      }
    }
  }
  return cards;
}

export const zoneGuide = zones;

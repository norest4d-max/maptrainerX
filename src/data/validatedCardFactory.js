const zones = {
  BI1: { name: 'Bulk Inside 1', purpose: 'indoor bulk storage', stack: 'Stable matching indoor pallets may be stacked only when allowed.', items: ['flooring pallet', 'lumber bundle', 'large appliance', 'boxed patio set'] },
  BI2: { name: 'Bulk Inside 2', purpose: 'indoor bulk overflow', stack: 'Use for indoor overflow and matching product families.', items: ['tile pallet', 'doors', 'large boxed stock', 'heavy indoor stock'] },
  BO3: { name: 'Bulk Outside 3', purpose: 'outside bulk storage', stack: 'Outdoor heavy product can stack when stable and matching.', items: ['concrete bags', 'pavers', 'bricks', 'mulch pallet'] },
  BO4: { name: 'Bulk Outside 4', purpose: 'outside bulk storage', stack: 'Group outdoor families together. Do not mix random products.', items: ['soil pallet', 'stone pallet', 'retaining blocks', 'bagged rock'] },
  BO5: { name: 'Bulk Outside 5', purpose: 'outside bulk overflow', stack: 'Good for matching outdoor overflow stacks.', items: ['garden block pallet', 'sand bags', 'landscape material', 'outdoor stock'] },
  BO6: { name: 'Bulk Outside 6', purpose: 'far outside bulk overflow', stack: 'Use for extra outside bulk, not customer hide-and-seek.', items: ['extra pavers', 'concrete overflow', 'seasonal outdoor bulk', 'bagged gravel'] },
  CS1: { name: 'Customer Staging 1', purpose: 'completed customer pickup orders', stack: 'Customer orders must stay findable and label-visible.', items: ['online pickup order', 'will-call appliance', 'completed flooring order', 'customer toilet order'] },
  CS2: { name: 'Customer Staging 2', purpose: 'extra completed customer staging', stack: 'Keep customer orders accessible, not buried.', items: ['second pickup order', 'staged delivery item', 'finished BOPIS order', 'special order'] },
  CR1: { name: 'Customer Rack 1', purpose: 'customer-related rack storage', stack: 'Rack means organized customer flow, not random bulk.', items: ['customer rack pallet', 'customer hold item', 'order-related rack item', 'organized customer stock'] },
  SR1: { name: 'Select Rack 1', purpose: 'fast-pick inventory', stack: 'Do not block fast-pick access with bulky stacks.', items: ['fast moving SKU', 'quick access box', 'frequently picked item', 'select rack product'] },
  DROP: { name: 'Drop Waiting Area', purpose: 'temporary pallet holding', stack: 'Temporary pause only. No pallet castle.', items: ['unknown pallet', 'waiting assignment pallet', 'short-term holding pallet', 'pallet needing direction'] },
  HYDROGEN: { name: 'Hydrogen Charger', purpose: 'equipment fuel or charge area', stack: 'No product storage. Equipment support only.', items: ['pacer recharge', 'hydrogen fuel stop', 'MHE charging', 'equipment support'] },
  OFFICE: { name: 'Office / Guard Shack', purpose: 'people, paperwork, and check-in', stack: 'No product storage. People and paperwork only.', items: ['driver check-in', 'paperwork', 'supervisor question', 'security check'] }
};

const lessonSlides = [
  { title: '1. Purpose before position', body: 'Ask what the pallet is doing: bulk storage, customer pickup, fast-pick, temporary hold, or support area.', rule: 'A location exists for a job, not just empty space.' },
  { title: '2. Four-stack thinking', body: 'Four-stacking does not make every spot correct. It only works after the zone is right and the product family matches.', rule: 'Zone first. Match product second. Stack safety third.' },
  { title: '3. Customer orders are not bulk', body: 'CS and CR are customer-flow areas. The goal is findability, labels, and fast pickup.', rule: 'Do not bury customer orders in bulk stacks.' },
  { title: '4. Bulk likes families', body: 'BI and BO are where matching heavy product groups live. Indoor product goes BI. Outdoor product goes BO.', rule: 'Bulk zones are grouped by product family.' },
  { title: '5. Drop is not storage', body: 'Drop Waiting is a temporary decision area. Use it to pause, then move the pallet to its real home.', rule: 'Drop means wait, not live there forever.' }
];

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function card(id, level, skill, prompt, choices, answer, why) {
  const cleanChoices = [...new Set(choices)];
  if (cleanChoices.length !== 4) throw new Error('Card must have exactly 4 unique choices.');
  if (!cleanChoices.includes(answer)) throw new Error('Answer must be one of the choices.');
  return {
    id: `MAP-${String(id).padStart(4, '0')}`,
    level,
    skill,
    zone: answer,
    prompt,
    choices: cleanChoices,
    answer,
    answerIndex: cleanChoices.indexOf(answer),
    correctMessage: `DING! ${answer} is correct. +10 XP. Pallet brain upgraded.`,
    wrongMessage: `BUZZ! Correct answer: ${answer}. ${why}`,
    explanation: why
  };
}

function zoneChoiceCard(id, zoneKey, item) {
  const z = zones[zoneKey];
  const choices = shuffle([zoneKey, ...wrongZones(zoneKey, 3)]);
  return card(id, levelFor(zoneKey), 'zone', `Where should this go: ${item}?`, choices, zoneKey, `${zoneKey} is ${z.name}: ${z.purpose}. Stack note: ${z.stack}`);
}

function purposeCard(id, zoneKey) {
  const z = zones[zoneKey];
  const choices = shuffle([zoneKey, ...wrongZones(zoneKey, 3)]);
  return card(id, levelFor(zoneKey), 'purpose', `Which map label best matches this purpose: ${z.purpose}?`, choices, zoneKey, `${zoneKey} means ${z.name}. It is used for ${z.purpose}.`);
}

function stackDecisionCard(id, zoneKey, item) {
  const z = zones[zoneKey];
  let prompt = `There are 3 matching, stable pallets of ${item} already in ${zoneKey}. A 4th matching pallet arrives. What is the best answer?`;
  let choices = [
    'Stack in the same correct zone if site rules and safety allow it',
    'Move it to Customer Staging because it is closer',
    'Put it by Hydrogen because equipment is nearby',
    'Leave it blocking the aisle because you are busy'
  ];
  let answer = choices[0];
  let why = `Four-stacking is only logical when the zone is already correct, products match, the pallet is stable, labels/access are okay, and paths stay clear. For ${zoneKey}: ${z.stack}`;

  if (zoneKey.startsWith('CS') || zoneKey === 'SR1' || zoneKey === 'CR1') {
    prompt = `You have ${item} in ${zoneKey}. Someone wants to bury it under a random 4-stack. What is best?`;
    choices = ['Keep it accessible and findable', 'Bury it under random bulk', 'Send it to BO6 automatically', 'Put it in the office'];
    answer = choices[0];
    why = `${zoneKey} needs access and organization. Customer and fast-pick areas are not random bulk-stack zones.`;
  }

  if (zoneKey === 'DROP' || zoneKey === 'HYDROGEN' || zoneKey === 'OFFICE') {
    prompt = `${item} is in ${zoneKey}. Should this become a 4-stack storage home?`;
    choices = ['No, this area is not permanent product storage', 'Yes, stack anything here', 'Only if it blocks the path', 'Only if nobody is watching'];
    answer = choices[0];
    why = `${zoneKey} is for ${z.purpose}. It is not a normal permanent stack-storage home.`;
  }

  return card(id, 5, 'stack decision', prompt, choices, answer, why);
}

function wrongZones(answer, count) {
  const keys = Object.keys(zones).filter((k) => k !== answer);
  return shuffle(keys).slice(0, count);
}

function levelFor(z) {
  if (z === 'HYDROGEN' || z === 'OFFICE') return 2;
  if (z.startsWith('BI') || z.startsWith('BO')) return 3;
  if (z.startsWith('CS')) return 4;
  return 5;
}

export function generateCards(total = 1000) {
  const cards = [];
  let id = 1;
  const keys = Object.keys(zones);
  while (cards.length < total) {
    for (const key of keys) {
      for (const item of zones[key].items) {
        cards.push(zoneChoiceCard(id++, key, item));
        if (cards.length >= total) return cards;
        cards.push(purposeCard(id++, key));
        if (cards.length >= total) return cards;
        cards.push(stackDecisionCard(id++, key, item));
        if (cards.length >= total) return cards;
      }
    }
  }
  return cards;
}

export const zoneGuide = zones;
export { lessonSlides };

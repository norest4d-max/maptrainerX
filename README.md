# MapTrainerX

A minimalist black and paper-white GBA-style warehouse map trainer.

## What it teaches

- BI = Bulk Inside
- BO = Bulk Outside
- CS = Customer Staging
- CR = Customer Rack
- SR = Select Rack
- Drop Waiting Area = temporary pallet parking
- Hydrogen Charger = equipment fuel or charge zone
- Office and Guard Shack = people and paperwork zones

## Game loop

- 1,000 generated repetition cards
- 4 choices, 1 correct answer
- Correct answers ding and give XP
- Wrong answers buzz and explain why
- Missed cards become more likely to repeat

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

Import this repo into Vercel and use the default Vite build settings:

- Build command: `npm run build`
- Output directory: `dist`

# Life Receipts

*After the Song: A Life in Receipts*

A living archive exploring the rhythm of digital life from 2015—2018. This project visualizes a collection of ordinary receipts—music moments and purchases—as evidence of small convergences and repeating patterns that make a digital life feel human.

## Features

- **Data Insights:** Discover what keeps repeating in your digital life, identifying patterns visible only where receipts agree.
- **Life Threads:** Explore small clusters of connected events held together by shared dates, close timestamps, or shared evidence. Includes a visual Connection Graph.
- **Receipt Explorer:** Filter and search through your entire archive of receipts, viewing details like source, date, amount, and duration played.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Contains the main Next.js application pages and layouts.
- `/components`: Reusable UI components like `ReceiptCard`, `InsightCard`, `ConnectionGraph`, and `Filters`.
- `/lib`: Engine logic, including `connection-engine` for building threads and `pattern-engine` for deriving insights.
- `/types`: TypeScript type definitions.
- `/public/data`: Contains the `receipts.json` file which powers the visualizations.

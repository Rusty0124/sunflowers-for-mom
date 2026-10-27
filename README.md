# 🌻 Sunflowers for Mom

A small Express app that shows my mom five sunflower paintings from the [Metropolitan Museum of Art](https://www.metmuseum.org/) every day. Each picture links to its page on the Met's website. When she has seen them all, she gets a little message from me.

## How it works

- The paintings are a hand-picked list of object IDs from the [Met Collection API](https://metmuseum.github.io/).
- Each day (by Eastern time) shows the next 5 IDs from the list, starting on `START_DATE` in `index.js`.
- The first visit each day fetches that day's images from the Met. Later visits that day reuse them.
- Once the list runs out, the page shows a "Love you ma" message.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:1030.

## Deploy

Deploys to [Vercel](https://vercel.com) as is: import the repo, and Vercel runs the exported Express app.

## Customize

- **Add paintings:** add Met object IDs to `ObjectIDs` in `index.js`. Each extra 5 IDs adds another day.
- **Change the start day:** edit `START_DATE` (months are 0-indexed, so `9` is October).
- **Change the timezone:** edit `TIME_ZONE`.

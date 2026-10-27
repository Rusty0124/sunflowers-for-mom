import express from "express"
import morgan from "morgan"
import bodyParser, { json } from 'body-parser'
import path from "path"
import { fileURLToPath } from 'url';
import { error } from "console";
import { arrayBuffer } from "stream/consumers";


// first day mom sees paintings (months are 0-indexed, so 9 = October)
const START_DATE = Date.UTC(2026, 9, 27)
// mom's timezone, so the new paintings show up at her midnight (handles EST/EDT)
const TIME_ZONE = "America/New_York"
const PER_DAY = 5
const app = express();
const PORT = process.env.PORT || 1030;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
let todaySlice = []
let todaysInfo = []
let fetchedDay = null

// how many whole days since START_DATE (0 on the first day)
function daysSinceStart() {
    // today's date as mom sees it, e.g. "2026-10-27"
    const [year, month, date] = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE })
        .format(new Date())
        .split("-")
        .map(Number)
    return Math.round((Date.UTC(year, month - 1, date) - START_DATE) / 86400000)
}

async function fetchData(dayNumber) {
    ///Fix needs to be itterable 
    const ObjectIDs = [
  360837,
  707887,
  363282,
  400581,
  423400,
  423237,
  436524,
  208554,
  20141,
  207869,
  13644,
  700610,
  208218,
  814626,
  761731,
  705155,
  223828,
  823744,
  193938,
  13595,
  158456,
  205022,
  2634,
  923724,
  343052,
  1502,
  205071,
  218258,
  218288,
  2195,
  406541,
  66998,
  768
]
    const start = dayNumber * PER_DAY
    let todaySliceId = ObjectIDs.slice(start, start + PER_DAY)
    todaySlice = []
    todaysInfo = []

    for(let i = 0; i < todaySliceId.length; i++){
        const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${todaySliceId[i]}`;
        
        const details = await fetch(objectUrl).then(r => r.json());
        todaySlice[i] = details.primaryImage
        todaysInfo[i] = details.objectURL

    }
    fetchedDay = dayNumber
    }
    

   

  
app.post("/submit", async (req, res) => {
  const dayNumber = daysSinceStart()
  if (dayNumber !== fetchedDay) {
    await fetchData(dayNumber)
  }

  const html = todaySlice.length === 0
    ? `<p class="done">Love you ma, text me and I'll get you more sunflowers :D</p>`
    : todaySlice
      .map((src, i) => `<figure><img src="${src}" alt="Sunflower artwork"><a href="${todaysInfo[i]}" target="_blank">More Info on ^</a></figure>`)
      .join("");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sunflowers for mom</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px 16px; background: #fff8e7; color: #3b2a12; font-family: "Nunito", system-ui, sans-serif; }
    h1 { font-family: "Fraunces", Georgia, serif; text-align: center; font-size: clamp(1.6rem, 4vw, 2.4rem); margin: 0 0 32px; }
    .gallery { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; align-items: start; }
    figure { margin: 0; padding: 12px 12px 0; background: #fffdf6; border-radius: 4px; box-shadow: 0 12px 30px rgba(90, 58, 18, 0.12); }
    img { display: block; width: 100%; height: auto; }
    figure a { display: block; padding: 14px 16px; color: #8a5a00; font-weight: 700; text-decoration: none; }
    figure a:hover { text-decoration: underline; }
    .done { grid-column: 1 / -1; margin: 40px auto; max-width: 600px; padding: 40px 32px; text-align: center; background: #fffdf6; border-radius: 16px; box-shadow: 0 12px 30px rgba(90, 58, 18, 0.12); font-family: "Fraunces", Georgia, serif; font-size: clamp(1.4rem, 3.5vw, 2rem); line-height: 1.4; }
    .done::before { content: "🌻"; display: block; font-size: 56px; margin-bottom: 12px; }
    .back { display: block; width: fit-content; margin: 40px auto 0; padding: 12px 28px; border-radius: 999px; background: #f5b700; color: #5a3a12; font-weight: 700; text-decoration: none; box-shadow: 0 5px 0 #d99a00; }
  </style>
</head>
<body>
  <h1>🌻 Sunflowers for you 🌻</h1>
  <div class="gallery">${html}</div>
  <a class="back" href="/">Back</a>
</body>
</html>`);
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/public", "index.html"))
});

// Vercel runs the exported app; app.listen above is for running locally
export default app




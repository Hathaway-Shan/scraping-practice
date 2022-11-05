//Steps to complete
//go to the specified movie page selected by movie id
//wait for content to load
//use evaluate to tap into html of the the current page open in Puppeteer
//extract the specific strings/text we want using query selectors

const puppeteer = require("puppeteer");
const IMDB_URL = (movie_id) => `https://www.imdb.com/title/${movie_id}`;
const MOVIE_ID = `tt0116136`;

(async () => {
  /* Initiate the Puppeteer browser */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  /* Go to the IMDB Movie page and wait for it to load */
  await page.goto(IMDB_URL(MOVIE_ID), { waitUntil: "networkidle0" });

  /* Run javascript inside of the page */
  let data = await page.evaluate(() => {
    let title = document.querySelector(
      'div[class="sc-80d4314-1.fbQftq"] > h1'
    ).innerText;

    /* Returning an object filled with the scraped data */
    return {
      title,
    };
  });
  /* Outputting what we scraped */
  console.log(data);
  await browser.close();
})();

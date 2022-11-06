const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const PORT = 8000;

app.get("/", function (req, res) {
  res.json("web scraper test home");
});

app.get("/mons", function (req, res) {
  //this is a self running async function, hence the weird syntax
  (async () => {
    /* Initiate the Puppeteer browser */
    // check with { headless : false } arg
    const browser = await puppeteer.launch();

    // create a newPage instance to have access to page methods
    const page = await browser.newPage();

    // we cannot console log in the browser instance without this code
    // check element values in the console instance using headless
    page.on("console", async (e) => {
      const args = await Promise.all(e.args().map((a) => a.jsonValue()));
      console[e.type() === "warning" ? "warn" : e.type()](...args);
    });

    //now we can navigate to our intended page
    await page.goto("https://pokedex.org/", { waitUntil: "networkidle0" });
    //call evaluate method to select specific information from the page

    const data = await page.evaluate(() => {
      const mons = document.querySelectorAll("#monsters-list li span");
      const arr = [];

      for (i = 0; i < mons.length; i++) {
        arr.push({
          name: mons[i].innerText,
        });
      }
      return arr;
    });
    // console.log("data is: ", data); //returns expected list of pokemon names
    await browser.close();
    res.json(data);
  })();
});

//the localhost 8000 breaks without this line
//check with: app.listen(8000, "0.0.0.0", () => console.log('listening on port 8000'));
app.listen(8000, "0.0.0.0"); //returns expected

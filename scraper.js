/* External dependancies */
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

/* Internal dependancies */
const Movie = require("./Movie");
const Theatre = require("./Theatre");
const Showtime = require("./Showtime");
const ScraperError = require("./ScraperError");

/* URL builders */
const THEATRES_URL = () =>
  `https://www.cineplex.com/Theatres/CineplexLocations`;
const NOW_PLAYING_URL = pageNum =>
  `https://www.cineplex.com/Movies/NowPlaying?cmpid=MainSubNavEN_now-playing&page=${pageNum}`;
const SHOWTIMES_URL = (movieNameURL, theatreNameURL, date) =>
  `https://www.cineplex.com/Showtimes/${movieNameURL}/${theatreNameURL}?Date=${date}`;

/**
 * Get a lst of all the theatres in Canada
 */
const theatres = async function() {
  try {
    /**
     * Get the HTML elements of the theatres in Canada
     * @return { HTMLCollection } The collection of elements matching theatres
     */
    const getTheatresPage = async function() {
      let rawHTML = await fetch(THEATRES_URL()); // fetch web page
      rawHTML = await rawHTML.text(); // convert to text

      // the theatres are hard coded in an inline script on the page, so search for that line to the end and parse it as json
      const startIndex = rawHTML.search(/var participatingTheatres=/g);
      const endIndex = rawHTML.search(/}]\s*\/\/[\w,\s]*var lang='en-us';/g);
      const theatresText = rawHTML.substring(startIndex + 26, endIndex + 2);
      return JSON.parse(theatresText);
    };

    const rawTheatres = await getTheatresPage();
    const theatres = [];

    for (let i = 0; i < rawTheatres.length; i++) {
      theatres.push(new Theatre(rawTheatres[i])); // convert to Theatre list
    }

    return theatres;
  } catch (e) {
    return new ScraperError(`Failed to parse theatres due to ${e.message}`);
  }
};

/**
 * Get a list of all the movies that are in theatres, scraped from Cineplex's now playing page
 * @return { Movie[] }
 */
const movies = async function() {
  try {
    /**
     * Get the HTML elements that have the 'showtime-card' class on the now playing page specified by the given page number
     * @param { number } pageNum The page number to search through
     * @return { HTMLCollection } The collection of elements matching the class. If the page index is out of bounds, there will be an empty collection returned
     */
    const getContentByPage = async function(pageNum) {
      let rawHTML = await fetch(NOW_PLAYING_URL(pageNum)); // make the http request
      rawHTML = await rawHTML.text(); // convert buffered response to text

      const content = new JSDOM(rawHTML); // create DOM tree out of the page
      const showtimeCards = content.window.document.getElementsByClassName(
        "showtime-card"
      ); // search the DOM tree for the showtime cards
      return showtimeCards;
    };

    let pageNum = 1; // increment page number until there are no results on the page (reach end)
    let contents = []; // container to hold the Movies we collect

    // loop getting pages until the pages are empty
    let pageContents = await getContentByPage(pageNum);
    while (pageContents.length != 0) {
      // add all items of the pageContents to the array
      for (let i = 0; i < pageContents.length; i++) {
        let movie = new Movie(pageContents.item(i)); // convert the movie showtime card element to a Movie
        contents.push(movie); // add the Movie to the list
      }

      // get the next page
      pageNum++;
      pageContents = await getContentByPage(pageNum);
    }

    return contents;
  } catch (e) {
    return new ScraperError(`Failed to parse movies due to ${e.message}`);
  }
};

/**
 * Get the showtime for the given movie and theatre on the given date
 * @param { string } movieNameURL The URL name of the movie, for example the movie name: 'Spiderman: Into the Spiderverse' has the movie name URL of 'spiderman-into-the-spiderverse'
 * @param { string } theatreNameURL the URL name of the theatre, for example the theatre name 'SilverCity London Cinemas' has the theatre name URL of 'silvercity-london-cinemas'
 * @param { string } date The datet that showtimes are for, in the format MM/DD/YYYY
 */
const showtimes = async function(movieNameURL, theatreNameURL, date) {
  try {
    const getShowtimePage = async function() {
      let rawHTML = await fetch(
        SHOWTIMES_URL(movieNameURL, theatreNameURL, date)
      ); // get the web page for showtimes
      rawHTML = await rawHTML.text(); // convert to text

      const content = new JSDOM(rawHTML); // create DOM to parse
      const showtimes = content.window.document.querySelectorAll(
        "div.showtime-card div.grid div.grid__item.one-whole a.showtime"
      ); // get the showtime elements
      return showtimes;
    };

    const rawShowtimes = await getShowtimePage();
    const showtimes = [];
    for (let i = 0; i < rawShowtimes.length; i++) {
      const showtime = new Showtime(
        movieNameURL,
        theatreNameURL,
        date,
        rawShowtimes[i]
      ); // turn the parsed data into showtimes
      showtimes.push(showtime);
    }

    return showtimes;
  } catch (e) {
    return new ScraperError(`Failed to parse showtimes due to ${e.message}`);
  }
};

module.exports = {
  theatres,
  movies,
  showtimes
};

# Cineplex Scraper
https://www.npmjs.com/package/cineplex-scraper

`npm install cineplex-scraper`

Scrape Cineplex.com for data on Theatres, Movies and Showtimes. It uses live data but is often not very fast so it is encouraged to use the API to create a database of records to index from in your own use. See an [example](#example) for a better understanding.

# API
## theatres()
Returns a list of all the [Theatres](#theatre) found from Cineplex.

## movies()
Returns a list of all the [Movies](#movie) found from Cineplex. The movies returned are the ones found under the 'now playing' tab, and do not include old movies or movies that have not come out yet.

## showtimes(movieNameURL, theatreNameURL, date)
Returns a list of [Showtimes](#showtime) for the given movie and theatre on the given date.

- `movieNameURL`: Correpsonds to a string matching `Movie.movieNameURL`
- `theatreNameURL`: Corresponds to a string matching `Theatre.theatreNameURL`
- `date`: String in the format 'MM/DD/YYYY'

## Theatre
```
{
  name: string,
  nameURL: string,
  address: string,
  city: string,
  province: string,
  postalCode: string
}
```

## Movie
```
{
  name: string,
  nameURL: string,
  genre: string,
  runTime: number,
  posterURL: string
}
```

## Showtime
```
{
  movieNameURL: string,
  theatreNameURL: string,
  date: string,
  time: string
}
```

# Example
```
const cineplexScraper = require('cineplex-scraper');

let theatres = [];
let movies = [];

async function initTheatres(){
  theatres = await cineplexScraper.theatres();
}

async function initMovies(){
  movies = await cineplexScraper.movies();
}

async function searchShowtimes(movie, theatre){
  const movieNameURL = movie.movieNameURL;
  const theatreNameURL = theatre.theatreNameURL;
  const date = new Date().toLocaleString('en-US').split(' ')[0]; // today's date formatted to MM/DD/YYYY

  return cineplexScraper.showtimes(movieNameURL, theatreNameURL, date);
}

// main
initTheatres()
.then(() => {
  initMovies();
})
.then(() => {
  // find theatres in Toronto
  let myTheatre = theatres.find(theatre => theatre.name.search(/Toronto/) != -1);

  // find specific movie
  let myMovie = movies.find(movie => movies.name.search(/Spiderman/) != -1);

  let searchResult = searchShowtimes(myTheatre, myMovie);
  // do something with search result...
})
.catch(err => {
  console.error(err);
  // error handling...
})
```

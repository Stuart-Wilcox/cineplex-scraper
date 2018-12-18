class Showtime {
  constructor(movieNameURL, theatreNameURL, date, showTimeData){
    this.movieNameURL = movieNameURL;
    this.theatreNameURL = theatreNameURL;
    this.date = date;
    this.time = showTimeData.textContent.trim();
  }
}

module.exports = Showtime;

class Movie{
  constructor(showtimeCard){
    this.posterURL = showtimeCard.querySelector('.dbsmallposter').src;
    this.name = showtimeCard.querySelector('.showtime-card--title a').innerHTML;
    this.nameURL = showtimeCard.querySelector('.showtime-card--title a').href.split('/').pop();
    this.runTime = showtimeCard.querySelector('p.movie-details').textContent.split('|')[0].trim();
    this.genre = showtimeCard.querySelector('p.movie-details').textContent.split('|')[1].trim();
  }
}

module.exports = Movie;

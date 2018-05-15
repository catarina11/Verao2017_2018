module.exports ={
    CinemaSearchDto,
    MovieSearchDto,
    RoomsSerachDto,
    SessionSearchDto,
    MovieDto
}

function CinemaSearchDto(obj){
    this.name = obj.name
    this.city = obj.city
    this.rooms = []
    var room = obj.rooms
    room.forEach(element=>{
        this.rooms.push(new RoomsSerachDto(element))
    })

}
function MovieDto(obj){
    this.id = obj.id
    this.original_title = obj.original_title
    this.release_date = obj.release_date
    this.runtime = obj.runtime //duration
    this.img = obj.poster_path == undefined? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1024px-No_image_3x4.svg.png'
        :'https://image.tmdb.org/t/p/w500'+ obj.poster_path
    //duration???? doesn't exists in API
}

function MovieSearchDto(obj){
    this.results = []
    var result = obj.results
    result.forEach(element => {
        this.results.push(new MovieDto(element))
    })
}

function RoomsSerachDto(obj){
    this.cinemaName = obj.cinemaName;
    this.number_room = obj.number_room
    this.numberOfRows = obj.numberOfRows;
    this.numberOfSeats = obj.numberOfSeats;
    this.Sessions = []
    var Session = obj.Sessions
    Session.forEach(element=>{
        this.Sessions.push(new SessionSearchDto(element))
    })
}

function SessionSearchDto(obj){
    this.movieTitle = obj.movieTitle;
    this.date = obj.date;
    this.room = obj.room;
    this.Movies = []
    var movie = obj.Movies
    movie.forEach(element=>{
        this.Movies.push(new MovieSearchDto(element))
    })
}
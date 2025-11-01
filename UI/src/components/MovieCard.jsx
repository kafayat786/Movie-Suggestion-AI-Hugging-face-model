import { Link, useNavigate } from 'react-router-dom';

function MovieCard({ movie }) {
    console.log(movie)
    const navigate = useNavigate();
    const navigateToMovieDetail = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    const handleCardClick = (movieId) => {
        console.log('Card clicked');
         ///navigate(`/movies/${movieId}`);
        // to={`/movies/${movie._id}`}
        window.open(`/movies/${movieId}`, '_blank', 'noopener,noreferrer');
    };

  return (
        <div
            key={movie._id}
            className={`card`}
            onClick={()=>navigateToMovieDetail(movie._id)}
        >
            <img src={movie.Poster} />
            {movie.Title}
            {movie.Genre}
            {/* <p className="">{movie.plot.slice(0, 100)}...</p> */}
            {/* <Link to={`/movies/${movie._id}`} className="text-blue-500 hover:underline mt-2 inline-block">View Details</Link> */}
        </div>
  );
} 

export default MovieCard;
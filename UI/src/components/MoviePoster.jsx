import { Link, useNavigate } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

function MoviePoster({ index, movie }) {
    const navigate = useNavigate();
    const navigateToMovieDetail = (movieId) => {
        console.log('navigate --', movieId);
        // navigate(`/movies/${movieId}`);
         window.open(`/movies/${movieId}`, '_blank', 'noopener,noreferrer');
    };
  return (
    <Link key={movie._id} 
        onClick={() => navigateToMovieDetail(movie._id)} className="">
      <div className="relative">
        <ImageWithFallback
          className="min-w-64 max-w-64 h-96 object-cover rounded-lg shadow-lg"
          src={movie.Poster}
          alt={movie.Title}
        />

        {movie.score && (
          <div className="absolute w-14 h-14 flex items-center justify-center bottom-0 right-0 bg-orange-300 bg-opacity-90 p-2 rounded-full m-5 font-bold">
            {(movie.score * 100).toFixed(2)}%
          </div>
        )}

        {index && (
          <div className="absolute text-gray-100 top-32 -left-10 text-9xl font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {index}
          </div>
        )}
      </div>

      <div className="py-2">
        <p className="text-lg font-semibold line-clamp-1 w-64">{movie.Title}</p>
        <p className="text-gray-500 line-clamp-1">{movie.Genre}</p>
      </div>
    </Link>
  );
}

export default MoviePoster;

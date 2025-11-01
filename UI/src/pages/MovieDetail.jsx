
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MoviePoster from '../components/MoviePoster';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/movies/recommend/${id}`)
      .then(res => setRecommendations(res.data.data))
      .catch(console.error);
  }, [id]);
  useEffect(() => {
    axios.get(`http://localhost:3000/movies/${id}`)
      .then(res => setMovie(res.data.data))
      .catch(console.error);
  }, [id]);

//   useEffect(() => {
//     axios.get(`http://localhost:3000/movies/search?query=${id}`) // Simulate getting single movie detail
//       .then(res => setMovie(res.data.data[0]))
//       .catch(console.error);
//   }, [id]);

  if (!movie) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>
      <img src={movie.Poster} className="w-full max-h-[500px] object-cover rounded-xl mb-4" alt={movie.title} />
      <p className="mb-4 text-gray-700">{movie.Plot}</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Recommended Movies</h2>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendations.map(movie => <MovieCard key={movie._id} movie={movie} />)}
      </div> */}
      <div className="movies-container">
        {recommendations.map((movie) => (
          movie.Poster && <MoviePoster key={movie._id} movie={movie}/>
        ))}
      </div>
    </div>
  );
}

export default MovieDetail;
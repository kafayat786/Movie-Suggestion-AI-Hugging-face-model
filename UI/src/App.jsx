import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import './App.css'
import MoviesList from './Pages/MoviesList';
import MovieDetail from './Pages/MovieDetail';
import Search from './Pages/Search';

function App() {
  return (
    <Router>
      {/* <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">🎬 MovieBase</Link>
        <Link to="/search" className="text-blue-500">Search</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<MoviesList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  )
}

export default App

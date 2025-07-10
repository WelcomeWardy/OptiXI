
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import AboutUs from './pages/AboutUs';
import Custom from './pages/Custom';
import Team from './pages/Team';
import Output from './pages/Output';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/team" element={<Team />} />
          <Route path="/output" element={<Output />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

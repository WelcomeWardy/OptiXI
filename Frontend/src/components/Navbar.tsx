import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar ipl-navbar">
            <div className="nav-brand ipl-nav-brand">
                <Link to="/" className="ipl-nav-link">18-11</Link>
            </div>
            <div className="nav-links ipl-nav-links nav-left">
                <Link to="/" className="ipl-nav-link">Home</Link>
                <Link to="/about" className="ipl-nav-link">Model</Link>
            </div>
            <div className="nav-links ipl-nav-links nav-right">
                <Link to="/aboutus" className="ipl-nav-link">About Us</Link>
            </div>
        </nav>
    );
};

export default Navbar;

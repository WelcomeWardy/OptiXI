import { Link } from 'react-router-dom';
import './Home.css';
import './Home.fadein.css';

const Home = () => {
    return (
        <div className="home">
            <div className="home-bg-graphics">
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
                <div className="ball ball4"></div>
                <div className="ball ball5"></div>
            </div>
            <div className="hero-text">
                <h1>Welcome to 18 to 11: Your AI-Powered IPL XI Selector</h1>
                <div className="hero-subheading" style={{ fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif' }}>Build your dream IPL squad with advanced AI, real stats, and cricketing intuition.</div>
                <div className="hero-features-grid fade-in">
                    <div className="hero-feature-card fade-in-card" style={{ animationDelay: '0.1s' }}>
                        <span className="hero-feature-emoji" role="img" aria-label="robot">🤖</span>
                        <div className="hero-feature-title" style={{ fontFamily: 'Bebas Neue, Titillium Web, Arial, sans-serif' }}>AI Squad Builder</div>
                        <div className="hero-feature-desc" style={{ fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif' }}>Smartly selects your best XI using machine learning and genetic algorithms.</div>
                    </div>
                    <div className="hero-feature-card fade-in-card" style={{ animationDelay: '0.3s' }}>
                        <span className="hero-feature-emoji" role="img" aria-label="cricket">🏏</span>
                        <div className="hero-feature-title" style={{ fontFamily: 'Bebas Neue, Titillium Web, Arial, sans-serif' }}>Real IPL Data</div>
                        <div className="hero-feature-desc" style={{ fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif' }}>Considers player form, injuries, DLS, and home ground advantage.</div>
                    </div>
                    <div className="hero-feature-card fade-in-card" style={{ animationDelay: '0.5s' }}>
                        <span className="hero-feature-emoji" role="img" aria-label="trophy">🏆</span>
                        <div className="hero-feature-title" style={{ fontFamily: 'Bebas Neue, Titillium Web, Arial, sans-serif' }}>Win More</div>
                        <div className="hero-feature-desc" style={{ fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif' }}>Outsmart your friends with data-driven picks and strategy.</div>
                    </div>
                    <div className="hero-feature-card fade-in-card" style={{ animationDelay: '0.7s' }}>
                        <span className="hero-feature-emoji" role="img" aria-label="sparkles">✨</span>
                        <div className="hero-feature-title" style={{ fontFamily: 'Bebas Neue, Titillium Web, Arial, sans-serif' }}>Easy & Fun</div>
                        <div className="hero-feature-desc" style={{ fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif' }}>Fast, interactive, and mobile-friendly experience.</div>
                    </div>
                </div>
                <div className="hero-cta-buttons fade-in-btns">
                    <Link to="/about" className="hero-btn hero-btn-primary fade-in-btn" style={{ fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif', background: '#1756a9', color: '#fff', border: '2px solid #fff', animationDelay: '1s' }}>Try the Model</Link>
                    {/* <Link to="/aboutus" className="hero-btn hero-btn-secondary fade-in-btn" style={{ fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif', background: '#fff', color: '#1756a9', border: '2px solid #1756a9', animationDelay: '1.2s' }}>Learn More</Link> */}
                </div>
                <div className="slogan" style={{ fontFamily: 'Bebas Neue, Titillium Web, Arial, sans-serif' }}>🎯Outsmart. Outpick. Outplay</div>
            </div>
        </div>
    );
}

export default Home;

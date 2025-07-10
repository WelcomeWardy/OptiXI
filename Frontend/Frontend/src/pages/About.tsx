
import './About.css';
import './About.fadein.css';
import { Link } from 'react-router-dom';


const About = () => {
    return (
        <div className="about home">
            <div className="home-bg-graphics">
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
                <div className="ball ball4"></div>
                <div className="ball ball5"></div>
            </div>
            <div className="about-main-card fade-in-card" style={{ animationDelay: '0.1s' }}>
                <div className="about-content" style={{ color: '#fff', marginBottom: '2.2rem', fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 700, paddingLeft: '0.2rem', paddingRight: '0.2rem', boxSizing: 'border-box' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.7rem', marginBottom: '1.2rem', color: '#ffd700', fontFamily: 'Bebas Neue, Titillium Web, Inter, Arial, sans-serif', letterSpacing: '1.2px', textWrap: 'balance', maxWidth: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span role="img" aria-label="cricket" style={{ fontSize: '1.7rem', verticalAlign: 'middle', marginRight: '0.4rem', display: 'inline-block', lineHeight: 1 }}>🏏</span> About the Model
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#e0e0e0', marginBottom: '1.2rem', fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif', textWrap: 'balance', maxWidth: 700 }}>
                        Ever imagined crafting your own dream IPL XI backed by real data intelligence?
                        <br />
                        <span style={{ fontWeight: 400 }}>
                            This project transforms that idea into reality factoring in rain-affected matches (DLS), injury-hit squads, home ground dynamics, and similar playing conditions. It’s not just stats, it’s strategy, adaptability, and cricketing intuition encoded into a model.
                        </span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.7rem', marginBottom: '1.2rem', color: '#ffd700', fontFamily: 'Bebas Neue, Titillium Web, Inter, Arial, sans-serif', letterSpacing: '1.2px', textWrap: 'balance', maxWidth: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span role="img" aria-label="settings" style={{ fontSize: '1.7rem', verticalAlign: 'middle', marginRight: '0.4rem', display: 'inline-block', lineHeight: 1 }}>⚙️</span> How It Works
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#e0e0e0', fontFamily: 'Inter, Poppins, Montserrat, Arial, sans-serif', textWrap: 'balance', maxWidth: 700 }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontWeight: 700, fontFamily: 'Bebas Neue, Titillium Web, Inter, Arial, sans-serif', fontSize: '1.25rem', letterSpacing: '1.1px', textWrap: 'balance', maxWidth: 700 }}>PLAYER INTELLIGENCE LAYER</span><br />
                            <span style={{ fontSize: '1.05rem' }}>We calculate player potential using smart clustering and simulation techniques like K-Means and Recursive Random Forests.</span>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontWeight: 700, fontFamily: 'Bebas Neue, Titillium Web, Inter, Arial, sans-serif', fontSize: '1.25rem', letterSpacing: '1.1px', textWrap: 'balance', maxWidth: 700 }}>TEAM OPTIMIZATION</span><br />
                            <span style={{ fontSize: '1.05rem' }}>Multi-Generational Genetic Algorithm (MGA) balances player roles, overseas limits, and ground-specific boosts.</span>
                        </div>
                        <div>
                            <span style={{ fontWeight: 700, fontFamily: 'Bebas Neue, Titillium Web, Inter, Arial, sans-serif', fontSize: '1.25rem', letterSpacing: '1.1px', textWrap: 'balance', maxWidth: 700 }}>SMART REFINEMENTS</span><br />
                            <span style={{ fontSize: '1.05rem' }}>Anchor batter validation, bowling specialist checks, and fallback recovery when constraints can’t be strictly met.</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '2.2rem' }}>
                    <div className="about-slogan fade-in-card" style={{ color: '#ffd700', fontWeight: 800, fontSize: '1.7rem', marginBottom: '1.1rem', fontFamily: 'Bebas Neue, Titillium Web, Inter, Arial, sans-serif', letterSpacing: '1.2px', textAlign: 'center', textShadow: '0 4px 18px #000a', animationDelay: '0.3s', textWrap: 'balance', maxWidth: 700 }}>
                        Build your best XI. Outsmart the odds. Play like a champion.
                    </div>
                    <div className="about-cta-buttons fade-in-btns" style={{ justifyContent: 'center', paddingRight: 0, marginBottom: 0, width: '100%' }}>
                        <Link to="/custom" className="about-btn about-btn-primary fade-in-btn" style={{ animationDelay: '0.5s', letterSpacing: '1.1px', fontSize: '1.05rem', fontWeight: 700 }}>Create from Custom Squad</Link>
                        <Link to="/team" className="about-btn about-btn-secondary fade-in-btn" style={{ animationDelay: '0.7s', letterSpacing: '1.1px', fontSize: '1.05rem', fontWeight: 700 }}>Auto-Build from Full Squad</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

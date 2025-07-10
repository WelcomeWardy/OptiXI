import './AboutUs.css';
import './AboutUs.fadein.css';


const AboutUs = () => {
    return (
        <div className="aboutus home">
            <div className="aboutus-bg-graphics">
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
                <div className="ball ball4"></div>
                <div className="ball ball5"></div>
            </div>
            <div className="aboutus-main-card fade-in-card" style={{ position: 'relative', zIndex: 2, animationDelay: '0.1s' }}>
                <h1 className="aboutus-content-title"><span className="aboutus-emoji" role="img" aria-label="about"></span>About Us</h1>
                <div className="aboutus-team-vertical fade-in-card" style={{ animationDelay: '0.3s', width: '100%', marginBottom: '1rem' }}>
                    <div className="aboutus-member-row fade-in-card" style={{ animationDelay: '0.5s', marginBottom: '0.7rem' }}>
                        <img src="../public/Madhav Koduvayur.jpg" alt="Member 1" className="aboutus-member-img" />
                        <div className="aboutus-member-info">
                            <div className="aboutus-member-name">Madhav Koduvayur</div>
                            <div className="aboutus-member-role">Developer</div>
                            <div className="aboutus-member-links">
                                <a href="https://www.linkedin.com/in/madhav-koduvayur-9464b8293/" className="aboutus-link linkedin" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" style={{ width: '1.5em', height: '1.5em', verticalAlign: 'middle' }} />
                                </a>
                                <a href="https://github.com/WelcomeWardy" className="aboutus-link github" title="GitHub" target="_blank" rel="noopener noreferrer">
                                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={{ width: '1.5em', height: '1.5em', verticalAlign: 'middle' }} />
                                </a>
                            </div>
                            {/* Member description removed as requested */}
                        </div>
                    </div>
                    <div className="aboutus-member-row fade-in-card" style={{ animationDelay: '0.7s', marginBottom: '0.2rem' }}>
                        <img src="../public/Rahul Ramesh.jpg" alt="Member 2" className="aboutus-member-img" />
                        <div className="aboutus-member-info">
                            <div className="aboutus-member-name">Rahul Ramesh</div>
                            <div className="aboutus-member-role">Developer</div>
                            <div className="aboutus-member-links">
                                <a href="https://www.linkedin.com/in/rahul-ramesh96" className="aboutus-link linkedin" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" style={{ width: '1.5em', height: '1.5em', verticalAlign: 'middle' }} />
                                </a>
                                <a href="https://github.com/rahul225-7" className="aboutus-link github" title="GitHub" target="_blank" rel="noopener noreferrer">
                                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={{ width: '1.5em', height: '1.5em', verticalAlign: 'middle' }} />
                                </a>
                            </div>
                            {/* Member description removed as requested */}
                        </div>
                    </div>
                </div>
                <div className="aboutus-content fade-in-card" style={{ animationDelay: '0.9s' }}>
                    <h2><span className="aboutus-emoji" role="img" aria-label="thanks"></span>Thank You</h2>
                    <p>
                        Two cricket-obsessed developers with a shared passion for technology and sport came together with one goal to change how teams are built. We saw franchises relying on scattered data, guesswork, and rigid metrics, often missing the bigger picture. So, we built something smarter.
                    </p>
                    <p>
                        We started by asking: Can a machine understand strategy?<br />
                        We spent weeks analyzing match conditions, player roles, injuries, and unpredictable moments like rain-hit games. Then we asked: What if selection could adapt just like the game itself?
                    </p>
                    <h3 className="aboutus-problem-heading"><span className="aboutus-emoji" role="img" aria-label="problem"></span>The Problem We Solved</h3>
                    <p>
                        Cricket data was everywhere but insight wasn’t. Teams lacked tools to simulate matchday realities: ground conditions, player unavailability, or tactical matchups. Our model bridges that gap using a blend of AI, home-ground intelligence, injury/rain adaptability, and real-time optimization helping users build their Best Playing XI, smarter and faster.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
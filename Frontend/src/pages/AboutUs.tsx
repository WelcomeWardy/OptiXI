
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
                        <img src="/member1.jpg" alt="Member 1" className="aboutus-member-img" />
                        <div className="aboutus-member-info">
                            <div className="aboutus-member-name">Member 1</div>
                            <div className="aboutus-member-role">Developer</div>
                            <div className="aboutus-member-links">
                                <a href="#" className="aboutus-link linkedin" title="LinkedIn" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></a>
                                <a href="#" className="aboutus-link github" title="GitHub" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                            </div>
                            <div className="aboutus-member-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.</div>
                        </div>
                    </div>
                    <div className="aboutus-member-row fade-in-card" style={{ animationDelay: '0.7s', marginBottom: '0.2rem' }}>
                        <img src="/public/member2.jpg" alt="Member 2" className="aboutus-member-img" />
                        <div className="aboutus-member-info">
                            <div className="aboutus-member-name">Member 2</div>
                            <div className="aboutus-member-role">Developer</div>
                            <div className="aboutus-member-links">
                                <a href="#" className="aboutus-link linkedin" title="LinkedIn" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></a>
                                <a href="#" className="aboutus-link github" title="GitHub" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
                            </div>
                            <div className="aboutus-member-desc">Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</div>
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

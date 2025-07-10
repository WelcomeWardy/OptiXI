import React from "react";
import { useLocation } from 'react-router-dom';
import './output.css';
import { useEffect, useState } from 'react';

// Avatar CSS and background overlay can be added here or in output.css
const avatarStyle = {
    background: '#ffc107',
    color: '#000',
    borderRadius: '50%',
    padding: '4px 8px',
    marginRight: 8,
    fontSize: '0.75rem',
    display: 'inline-block',
    fontWeight: 700,
    letterSpacing: '0.03em',
};

const generateBtnStyle = {
    background: 'linear-gradient(to right, #ffcc00, #ff9900)',
    color: 'black',
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease',
    fontSize: '1rem',
    marginTop: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px 0 rgba(255, 193, 7, 0.10)',
};

const generateBtnHoverStyle = {
    transform: 'scale(1.05)',
};

const Output: React.FC = () => {
  const [teamResult, setTeamResult] = useState<string[]>([]);
  const [aiResult, setAIResult] = useState<string | null>(null)
  const [teamName, setTeamName] = useState<string | null>(null)
  useEffect(() => {
  const fetchGeneratedTeam = async () => {
    try {
      const response = await fetch("http://localhost:5000/generatedTeam", {
        method: "POST", // Use POST as you intended
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      setTeamResult(data.result); // assuming result is an array
    } catch (error) {
      console.error("Failed to fetch generated team:", error);
    }
  };

  fetchGeneratedTeam();
}, []);

useEffect(() => {
  const fetchTeamName = async () => {
    try {
      const response = await fetch("http://localhost:5000/teamName", {
        method: "POST", // Use POST as you intended
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      setTeamName(data.result); // assuming result is an array
    } catch (error) {
      console.error("Failed to fetch generated team:", error);
    }
  };

  fetchTeamName();
}, []);


useEffect(() => {
  if (teamResult.length === 0) return; // Don't run if teamResult is still empty

  const fetchAIExplanation = async () => {
    try {
      const response = await fetch("http://localhost:5000/generateAIExplanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ results: teamResult })
      });

      const data = await response.json();
      setAIResult(data.result);
    } catch (error) {
      console.error("Failed to fetch AI explanation:", error);
    }
  };

  fetchAIExplanation();
}, [teamResult]); // re-run this effect only when teamResult updates

  async function handleClick() {
    console.log("REGENERATING CHECKKKKKK")
      if (teamResult.length === 0) return; // Don't run if teamResult is still empty
      try {
        const response = await fetch("http://localhost:5000/generateAIExplanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ results: teamResult })
      });
      const data = await response.json();
      setAIResult(data.result);
    } catch (error) {
      console.error("Failed to fetch AI explanation:", error);
    }
  };

  // Get state from navigation (if any)
   const selectedPlayers = teamResult.slice(1); // default
const location = useLocation();
const source = (location.state as { source?: string })?.source || 'unknown';

let selectedTeam = '';

if (source === 'team') {
  selectedTeam = teamName; // Assuming first entry is the team name
} else if (source === 'custom') {
  selectedTeam = '';
}

    

    // Team icon mapping (example, update with real icons as needed)
    const teamIcons = {
        'MI': '/public/mi.jpg',
        'CSK': '/public/csk.jpg',
        'RCB': '/public/rcb.jpg',
        'KKR': '/public/kkr.jpg',
        'LSG': '/public/lsg.jpg',
        'GT': '/public/gt.jpg',
        'SRH': '/public/srh.jpg',
        'RR': '/public/rr.jpg',
        'PBKS': '/public/pbks.jpg',
        'DC': '/public/dc.jpg',
    };
    const teamShort = teamName;
    console.log(teamShort)
    console.log(teamName)
    const teamIcon = teamIcons[teamShort] || undefined;
    const [btnHover, setBtnHover] = React.useState(false);


    return (
        <div className="output-root custom-container home min-h-screen w-screen overflow-hidden p-0 relative font-sans">
            {/* 🏟 Subtle SVG/PNG pattern overlay */}
            <div className="background-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: "url('/assets/pattern.svg')",
                opacity: 0.03,
                zIndex: 0,
                pointerEvents: 'none',
            }} />
            {/* Optional: Animated background balls for visual effect */}
            <div className="home-bg-graphics">
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
                <div className="ball ball4"></div>
                <div className="ball ball5"></div>
            </div>
            {/* Main Responsive Layout - reduced padding, tighter grid, more uniform card heights */}
            <div
                className="relative z-10 w-full h-full min-h-[70vh] max-w-6xl mx-auto px-2 md:px-8 py-2 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16"
                style={{ left: '0', position: 'relative', alignItems: 'stretch', display: 'grid', marginTop: '-2.5rem' }}
            >
                {/* Left: Team Info + Selected Players */}
                <div className="flex flex-col gap-4" style={{ marginLeft: '3vw' }}>
                    {/* Selected Players Card - logo and name above title */}
                    <div
                        className={`selected-players-box card-accent animate-slide-in-left bg-white/97 shadow-2xl rounded-3xl flex flex-col justify-start items-center min-h-[420px] md:min-h-[520px] p-10 transition-all duration-300 hover:scale-[1.03] ${selectedPlayers.filter(Boolean).length === 12 ? 'ring-4 ring-[#ffd600] ring-opacity-60 animate-pulse' : ''}`}
                        style={{ color: '#111', alignItems: 'center', justifyContent: 'flex-start', marginTop: 0, width: '100%', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}
                    >
                        {/* Team Logo and Name above title */}
                        <div className="flex flex-col items-center justify-center" style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 0, marginTop: '-2.5rem' }}>
                            {teamIcon && (
                                <img
                                    src={teamIcon}
                                    alt="team"
                                    className="team-logo"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'contain',
                                        display: 'block',
                                        margin: '0 auto 0.5rem auto',
                                        borderRadius: '1.2rem',
                                        boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)',
                                        background: '#fff',
                                        border: '2.5px solid #ffd600',
                                    }}
                                />
                            )}
                            <h1 className="uppercase text-3xl md:text-4xl font-extrabold tracking-wider text-center text-[#2E90FA] font-poppins drop-shadow-lg" style={{ width: '100%', textAlign: 'center', marginTop: 0, marginBottom: 0, letterSpacing: '0.04em' }}>{selectedTeam || 'Custom XI'}</h1>
                        </div>
                        <div className="selected-players-title w-full text-center uppercase font-extrabold tracking-wider text-5xl mb-6 font-poppins relative" style={{ color: '#111', letterSpacing: '0.06em', marginBottom: 28, marginTop: 10, lineHeight: 1.1 }}>
                            12 Selected Players
                            <span className="block mx-auto mt-3 w-32 h-2 bg-[#ffd600] rounded-full"></span>
                        </div>
                        <div className="section-subtitle" style={{ fontSize: '1.15rem', marginBottom: 12, color: '#2E90FA', fontWeight: 500 }}>Your chosen squad for the match</div>
                        <ol className="player-list overflow-y-auto max-h-56 md:max-h-56 w-full px-1" style={{ margin: 0, padding: 0, fontSize: '1.13rem' }}>
                            {[...Array(12)].map((_, idx) => {
                                const player = selectedPlayers[idx];
                                return (
                                  <li
                                    key={idx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      marginBottom: 2,
                                      fontSize: '1rem',
                                      padding: '2px 0',
                                      borderBottom: player ? '1px solid #f3f3f3' : 'none'
                                    }}
                                  >
                                    <span style={{ fontWeight: 500 }}>
                                      {player || `Player ${idx + 1}`}
                                    </span>
                                  </li>
                                );
                            })}
                        </ol>
                        <button
                            className="generate-btn"
                            style={btnHover ? { ...generateBtnStyle, ...generateBtnHoverStyle } : generateBtnStyle}
                            onMouseEnter={() => setBtnHover(true)}
                            onMouseLeave={() => setBtnHover(false)}
                        >
                            <span role="img" aria-label="Copy XI" title="Copy to clipboard">📋</span>Copy XI
                        </button>
                    </div>
                </div>
                {/* Right: Visualization on top, Elucidation below */}
                <div className="right-col flex flex-col gap-4" style={{ marginLeft: '12vw', marginTop: '-3.5rem' }}>
                    {/* Visualization Box */}
                    <div className="selected-players-box card-accent animate-slide-in-right bg-white/97 shadow-2xl rounded-3xl flex flex-col justify-start items-center min-h-[420px] md:min-h-[520px] p-10 transition-all duration-300 hover:scale-[1.03]" style={{ color: '#111', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 0, width: '100%', maxWidth: 650, marginLeft: 'auto', marginRight: 'auto', height: 'auto' }}>
                        <div className="selected-players-title w-full text-center uppercase font-extrabold tracking-wider text-3xl mb-4 font-poppins relative flex items-center justify-center gap-2" style={{ color: '#111', letterSpacing: '0.04em', marginBottom: 18, marginTop: 6 }}>
                            <span className="text-2xl" title="Charts and stats">📊</span> Visualization
                            <span className="block absolute left-1/2 -translate-x-1/2 bottom-0 mt-2 w-24 h-2 bg-[#ffd600] rounded-full"></span>
                        </div>
                        <div className="section-subtitle" style={{ fontSize: '1.15rem', marginBottom: 12, color: '#2E90FA', fontWeight: 500 }}>Charts and stats based on player performance</div>
                        <div className="flex flex-col items-center justify-center w-full h-full flex-1">
                            <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#2E90FA] rounded-xl min-h-[60px] bg-gradient-to-br from-[#fffbe7] to-[#e6f0ff] shadow-inner animate-fade-in" style={{ color: '#111', padding: '0.7rem' }}>
                                <span className="text-2xl mb-1 opacity-60" title="Loading visuals">🔄</span>
                                <span className="loading-text font-semibold text-base" style={{ color: '#111' }}>AI visuals loading... just a bit of cricket math <span role="img" aria-label="brain" title="AI doing some brain work">🧠</span></span>
                            </div>
                        </div>
                    </div>
                    {/* Elucidation Section */}
                    <div className="selected-players-box card-accent animate-fade-in bg-white/97 shadow-2xl rounded-3xl flex flex-col justify-start items-center min-h-[220px] md:min-h-[260px] p-10 transition-all duration-300 hover:scale-[1.03]" style={{ color: '#111', alignItems: 'center', justifyContent: 'flex-start', marginTop: '-2.2rem', width: '100%', maxWidth: 650, marginLeft: 'auto', marginRight: 'auto', height: 'auto' }}>
                        <div className="selected-players-title w-full text-center uppercase font-extrabold tracking-wider text-3xl mb-4 font-poppins relative flex items-center justify-center gap-2" style={{ color: '#111', letterSpacing: '0.04em', marginBottom: 18, marginTop: 6 }}>
                            <span className="text-2xl" title="AI explanation">💡</span> Elucidation
                            <span className="block absolute left-1/2 -translate-x-1/2 bottom-0 mt-2 w-24 h-2 bg-[#2E90FA] rounded-full"></span>
                        </div>
                        <div className="section-subtitle" style={{ fontSize: '1.15rem', marginBottom: 12, color: '#2E90FA', fontWeight: 500 }}>AI-generated insights and explanations</div>
                        <div className="flex flex-col items-center w-full">
                            <p className="min-h-[40px] text-[1.13rem] w-full whitespace-pre-line font-inter animate-typing overflow-x-auto text-black" style={{ color: '#111', padding: '0.5rem 0.5rem',fontWeight: 'bold', textAlign: 'left',   lineHeight: 1.4}}>
                              {aiResult}
                            </p>
                            <button
                                className="mt-4 flex items-center gap-2"
                                onClick={handleClick}
                                style={{
                                    background: 'linear-gradient(to right, #ffcc00, #ff9900)',
                                    color: 'black',
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    transition: 'transform 0.2s ease',
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 8px 0 rgba(255, 193, 7, 0.10)',
                                    marginTop: 0,
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                            >
                                <span role="img" aria-label="regenerate" title="Regenerate explanation">🔁</span>Regenerate Explanation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Output;



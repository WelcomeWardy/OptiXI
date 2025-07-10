import React from "react";
import { useLocation } from 'react-router-dom';
import './output.css';

const Output: React.FC = () => {
    // Get state from navigation (if any)
    const location = useLocation();
    const {
        selectedTeam = '',
        selectedPlayers = [],
        elucidationText = '',
    } = (location.state || {}) as {
        selectedTeam?: string;
        selectedPlayers?: string[];
        elucidationText?: string;
    };

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
    const teamShort = selectedTeam?.toUpperCase?.().replace(/[^A-Z]/g, '').slice(0, 4);
    const teamIcon = teamIcons[teamShort] || undefined;
    const mode = selectedTeam ? 'Team' : 'Custom';
    const playerRoles = {};

    return (
        <div className="output-root custom-container home min-h-screen w-screen overflow-hidden p-0 relative font-sans">
            {/* Optional: Animated background balls for visual effect */}
            <div className="home-bg-graphics">
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
                <div className="ball ball4"></div>
                <div className="ball ball5"></div>
            </div>
            {/* Main Responsive Layout */}
            <div className="relative z-10 w-full h-full min-h-[70vh] max-w-7xl mx-auto px-2 md:px-8 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
                style={{ left: '3vw', position: 'relative' }}>
                {/* Left: Team Info + Selected Players */}
                <div className="flex flex-col gap-8">
                    {/* Header: Team Name, Icon, Mode */}
                    <div className="flex flex-col items-center justify-center" style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        {teamIcon && (
                            <img
                                src={teamIcon}
                                alt="team"
                                className="team-logo"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    objectFit: 'contain',
                                    display: 'block',
                                    margin: '0 auto 1.1rem auto',
                                    borderRadius: '1.1rem',
                                    boxShadow: '0 2px 12px 0 rgba(31, 38, 135, 0.10)',
                                    background: '#fff',
                                    border: '2.5px solid #ffd600',
                                }}
                            />
                        )}
                        <h1 className="uppercase text-3xl md:text-4xl font-extrabold tracking-wider text-center text-[#2E90FA] font-poppins drop-shadow-lg" style={{ width: '100%', textAlign: 'center', marginTop: 0 }}>{selectedTeam || 'Custom XI'}</h1>
                    </div>
                    {/* Selected Players Card */}
                    <div className={`selected-players-box card-accent animate-slide-in-left bg-white/90 shadow-2xl rounded-2xl flex flex-col justify-between items-center min-h-[340px] md:min-h-[420px] p-8 transition-all duration-300 hover:scale-105 ${selectedPlayers.filter(Boolean).length === 12 ? 'ring-4 ring-[#ffd600] ring-opacity-60 animate-pulse' : ''}`}
                        style={{ color: '#111', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <div className="selected-players-title w-full text-center uppercase font-bold tracking-wider text-2xl mb-2 font-poppins relative" style={{ color: '#111' }}>
                            12 Selected Players
                            <span className="block mx-auto mt-2 w-16 h-1 bg-[#ffd600] rounded-full"></span>
                        </div>
                        <div className="section-subtitle">Your chosen squad for the match</div>
                        <ol className="player-list overflow-y-auto max-h-80 md:max-h-[340px]">
                            {[...Array(12)].map((_, idx) => (
                                <li key={idx}>
                                    {selectedPlayers[idx] || `Player ${idx + 1}`}
                                </li>
                            ))}
                        </ol>
                        <button className="mt-6 px-6 py-2 bg-[#2E90FA] text-white rounded-lg shadow hover:bg-[#ffd600] hover:text-[#1a237e] transition-all duration-200 text-base font-semibold flex items-center gap-2"><span>📋</span>Copy XI</button>
                    </div>
                </div>
                {/* Right: Visualization on top, Elucidation below */}
                <div className="right-col">
                    {/* Visualization Box */}
                    <div className="selected-players-box card-accent animate-slide-in-right bg-white/90 shadow-2xl rounded-2xl flex flex-col justify-between items-center min-h-[220px] md:min-h-[260px] p-8 transition-all duration-300 hover:scale-105" style={{ color: '#111', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <div className="selected-players-title w-full text-center uppercase font-bold tracking-wider text-2xl mb-2 font-poppins relative flex items-center justify-center gap-2" style={{ color: '#111' }}>
                            <span className="text-2xl">📊</span> Visualization
                            <span className="block absolute left-1/2 -translate-x-1/2 bottom-0 mt-2 w-16 h-1 bg-[#ffd600] rounded-full"></span>
                        </div>
                        <div className="section-subtitle">Charts and stats based on player performance</div>
                        <div className="flex flex-col items-center justify-center w-full h-full flex-1">
                            <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#2E90FA] rounded-xl min-h-[120px] bg-gradient-to-br from-[#fffbe7] to-[#e6f0ff] shadow-inner animate-fade-in" style={{ color: '#111', padding: '1rem' }}>
                                <span className="text-3xl mb-2 opacity-60">🔄</span>
                                <span className="loading-text font-semibold text-lg" style={{ color: '#111' }}>AI visuals loading... just a bit of cricket math 🧠</span>
                            </div>
                        </div>
                    </div>
                    {/* Elucidation Section */}
                    <div className="selected-players-box card-accent animate-fade-in bg-white/90 shadow-2xl rounded-2xl flex flex-col justify-between items-center min-h-[180px] md:min-h-[180px] p-8 transition-all duration-300 hover:scale-105" style={{ color: '#111', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <div className="selected-players-title w-full text-center uppercase font-bold tracking-wider text-2xl mb-2 font-poppins relative flex items-center justify-center gap-2" style={{ color: '#111' }}>
                            <span className="text-2xl">💡</span> Elucidation
                            <span className="block absolute left-1/2 -translate-x-1/2 bottom-0 mt-2 w-16 h-1 bg-[#2E90FA] rounded-full"></span>
                        </div>
                        <div className="section-subtitle">AI-generated insights and explanations</div>
                        <div className="flex flex-col items-center w-full">
                            <p className="min-h-[60px] text-[1.1rem] w-full whitespace-pre-line font-inter animate-typing overflow-x-auto text-black" style={{ color: '#111', padding: '0.5rem 0.5rem' }}>
                                {elucidationText
                                    ? elucidationText
                                    : <span className="italic text-[#7ba2d6] flex items-center gap-2"><span>🏏</span> Awaiting brilliance from the AI wizard...</span>}
                            </p>
                            <button className="mt-6 px-6 py-2 bg-[#ffd600] text-[#1a237e] rounded-lg shadow hover:bg-[#ffe066] transition-all duration-200 text-base font-semibold flex items-center gap-2"><span>🔁</span>Regenerate Explanation</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Output;
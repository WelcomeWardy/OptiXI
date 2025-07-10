import './Home.css';
import './Team.css';
import '../assets/ipl-theme.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IPL_TEAMS = [
    { name: 'CSK', logo: '/csk.jpg' },
    { name: 'MI', logo: '/mi.jpg' },
    { name: 'KKR', logo: '/kkr.jpg' },
    { name: 'RCB', logo: '/rcb.jpg' },
    { name: 'SRH', logo: '/srh.jpg' },
    { name: 'DC', logo: '/dc.jpg' },
    { name: 'RR', logo: '/rr.jpg' },
    { name: 'LSG', logo: '/lsg.jpg' },
    { name: 'GT', logo: '/gt.jpg' },
    { name: 'PBKS', logo: '/pbks.jpg' },
];



const Team = () => {
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [dlsMode, setDlsMode] = useState(false);
    const [injuryOpt, setInjuryOpt] = useState(false);
    const [injuryOptimizationActive, setInjuryOptimizationActive] = useState(false);
    const [injuredPlayers, setInjuredPlayers] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);


    const handleAddPlayer = (player: string) => {
        if (selectedPlayers.includes(player)) {
            setError('Player already selected!');
            setTimeout(() => setError(null), 1200);
            return;
        }
        setSelectedPlayers((prev) => [...prev, player]);
        setError(null);
    };

    // Edge case: auto-disable injury or DLS mode if all players are checked/removed
    useEffect(() => {
        if (injuryOptimizationActive && selectedPlayers.length === 0 && injuredPlayers.length > 0) {
            setInjuryOptimizationActive(false);
            setInjuryOpt(false);
            setInjuredPlayers([]);
        }
        if (dlsMode && selectedPlayers.length === 0) {
            setDlsMode(false);
        }
    }, [selectedPlayers, injuryOptimizationActive, injuredPlayers, dlsMode]);


    const handleRemovePlayer = (player: string) => {
        setSelectedPlayers((prev) => prev.filter((p) => p !== player));
    };

    const handleClearPlayers = () => {
        setSelectedPlayers([]);
        setInjuredPlayers([]);
    };

    // Dropdown logic for Injury Optimization
    const handleDropdownSelect = (option: string) => {
        if (option === "Injury Optimization") {
            setInjuryOptimizationActive(true);
        } else {
            setInjuryOptimizationActive(false);
            setInjuredPlayers([]); // Clear injured players when mode is off
        }
    };

    // Dropdown close on outside click
    useEffect(() => {
        if (!dropdownOpen) return;
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);

    async function sendTeam(name: string) {
    console.log(name)
    console.log(selectedTeam)
    await fetch("http://localhost:5000/sendTeam", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({team: name} )
    })
    .then(res => res.json())
    .then(data => {
        setSelectedPlayers(data.result)
        console.log(selectedPlayers)
    })
  }
    const handleGenerate = async () => {
        if (!selectedTeam || selectedPlayers.length === 0) {
            setError('Select a team and at least one player!');
            setTimeout(() => setError(null), 1500);
            return;
        }
        setLoading(true);
        setIsGenerating(true);
        // Simulate async work (replace with your actual logic)
        await generateTeam()
        setLoading(false);
        setIsGenerating(false);
        setDropdownOpen(false);
        navigate('/output', { state: { source: 'team' } });
    };

    async function generateTeam() {
    console.log(dlsMode)
    console.log("\n")
    console.log(injuryOpt)
    await fetch("http://localhost:5000/generateTeamMode", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({injuredplayers : injuredPlayers , team: selectedTeam, dlsmode: dlsMode, injuryMode: injuryOpt} )
    })
  }

    return (
        <div className="home">
            <div className="home-bg-graphics">
                <div className="ball ball1"></div>
                <div className="ball ball2"></div>
                <div className="ball ball3"></div>
                <div className="ball ball4"></div>
                <div className="ball ball5"></div>
            </div>
            <div className="custom-container" style={{ position: 'relative',overflow: 'visible',height: 'auto', zIndex: 10
  }}>
                <div className="custom-left">
                    <div className="custom-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        Team Mode
                        <div className="hint-container">
                            <span
                                className="icon"
                                style={{
                                    background: 'rgba(255,214,0,0.13)',
                                    color: '#ffd600',
                                    fontSize: '1.35rem',
                                    borderRadius: '50%',
                                    padding: '0.18rem 0.7rem',
                                    fontWeight: 700,
                                    marginLeft: '0.2rem',
                                    cursor: 'help',
                                    border: '1px solid #ffd60055',
                                    boxShadow: '0 1px 4px #ffd60022',
                                    lineHeight: 1,
                                    width: '2rem',
                                    height: '2rem',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                tabIndex={0}
                                aria-label="Show hint about Team Mode"
                            >
                                ?
                            </span>
                            <p className="hint-paragraph">
                                In Team Mode, the model uses home-ground intelligence to generate more accurate outcomes. To enable this, you’ll need to select a franchise, which will be treated as the home team. The model then factors in pitch conditions, venue history, and franchise-specific dynamics to simulate matches more realistically. This mode is ideal for testing full team performances in real-world contexts.
                            </p>
                        </div>
                    </div>
                    {/* Search bar removed for Team Mode */}
                    {error && (
                        <div style={{ color: '#d32f2f', margin: '0.5rem 0', fontWeight: 500 }}>{error}</div>
                    )}
                    <div
                        className="teams-grid flex overflow-x-auto space-x-4 snap-x snap-mandatory px-2"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        {IPL_TEAMS.map((team) => (
                            <div
                                key={team.name}
                                className={`team-box${selectedTeam === team.name ? ' selected' : ''} snap-start`}
                                onClick={() => {
                                    setSelectedTeam(team.name)
                                    sendTeam(team.name)}}
                                style={{
                                    border: selectedTeam === team.name ? '2px solid #4f8cff' : '1.5px solid #ddd',
                                    boxShadow: selectedTeam === team.name ? '0 2px 12px #4f8cff33' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div className="team-logo">
                                    {team.logo ? (
                                        <img src={team.logo} alt={team.name + ' logo'} />
                                    ) : (
                                        <span style={{ color: '#222', fontWeight: 700, fontSize: 18 }}>{team.name}</span>
                                    )}
                                </div>
                                <div className="team-name">{team.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="custom-right"   style={{position: 'relative',overflow: 'visible',zIndex: 10}}>
                    <div className="selected-players-box" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '18px', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', minHeight: 180, maxHeight: 320, overflowY: 'auto', padding: '1.2rem 1.2rem 1.2rem 1.2rem', marginBottom: '1rem' }}>
                    <div className="selected-players-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                    <span>Selected Players</span>
                    {selectedPlayers.length > 0 && (
                        <button className="clear-btn" onClick={handleClearPlayers} title="Clear all">Clear All</button>
                    )}
                    </div>
                    {selectedPlayers.length === 0 && (
                    <div style={{
                        color: '#7ba2d6',
                        fontSize: '1.08rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.2rem 0 0.7rem 0',
                        minHeight: 70,
                        fontWeight: 500
                    }}>
                        <span style={{ fontSize: '2rem', marginBottom: 4 }}>🏏</span>
                        <span style={{ textAlign: 'center', lineHeight: 1.4 }}>
                        <b>⚠️ No players selected.</b><br />
                        Start building your squad by choosing your franchise and players from the left.
                        </span>
                    </div>
                    )}
                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: 0, margin: 0, listStyle: 'none' }}>
                    {selectedPlayers.map((player) => (
                        <li key={player} className="selected-player-container" style={{ background: '#e6f0ff', borderRadius: '999px', padding: '0.35rem 0.9rem 0.35rem 0.7rem', fontSize: '1rem', color: '#1a237e', boxShadow: '0 1px 4px 0 rgba(44, 62, 80, 0.07)' }}>
                        {injuryOptimizationActive && (
                            <input
                            type="checkbox"
                            className="injury-checkbox"
                            onChange={() => {
                                const newSelected = selectedPlayers.filter((p) => p !== player);
                                const newInjured = [...injuredPlayers, player];
                                setInjuredPlayers(newInjured);
                                // Edge case: if all selected players are now injured, auto-disable injury optimization
                                if (newSelected.length === 0) {
                                setInjuryOptimizationActive(false);
                                setInjuryOpt(false);
                                setInjuredPlayers([]);
                                }
                                // Edge case: if DLS mode and all players are removed, auto-disable DLS
                                if (dlsMode && newSelected.length === 0) {
                                setDlsMode(false);
                                }
                            }}
                            />
                        )}
                        <span style={{ marginRight: 8 }}>{player}</span>
                        <button onClick={() => handleRemovePlayer(player)} title="Remove" style={{ background: 'none', border: 'none', color: '#1976d2', fontWeight: 700, fontSize: '1.1rem', marginLeft: 2, cursor: 'pointer', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                            onMouseOver={e => (e.currentTarget.style.background = '#e3e3e3')}
                            onMouseOut={e => (e.currentTarget.style.background = 'none')}
                        >×</button>
                        </li>
                    ))}
                    </ul>
                </div>
                    <div className="generate-section" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%',overflow:'visible',zIndex: 1000 }}>
                        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }} ref={dropdownRef}>
                            <div
                                className={`generate-btn${dropdownOpen ? ' open' : ''}`}
                                style={{
                                    paddingRight: '3.5rem',
                                    position: 'relative',
                                    width: '320px',
                                    minWidth: '220px',
                                    maxWidth: '100%',
                                    fontSize: '1.22rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.04em',
                                    border: (!selectedTeam || selectedPlayers.length === 0)
                                        ? '2px solid #7ba2d6'
                                        : 'none',
                                    borderRadius: '2.2rem',
                                    boxShadow: (!selectedTeam || selectedPlayers.length === 0) ? 'none' : '0 4px 24px 0 rgba(33, 150, 243, 0.18)',
                                    background: (!selectedTeam || selectedPlayers.length === 0)
                                        ? 'linear-gradient(90deg, #f0f6fc 0%, #e3eaf3 100%)'
                                        : 'linear-gradient(90deg, #1976d2 0%, #ffd600 100%)',
                                    color: (!selectedTeam || selectedPlayers.length === 0) ? '#7ba2d6' : '#1a237e',
                                    cursor: (!selectedTeam || selectedPlayers.length === 0 || loading || isGenerating) ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
                                    marginBottom: '0.5rem',
                                    outline: 'none',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <button
                                    type="button"
                                    disabled={!selectedTeam || selectedPlayers.length === 0 || loading || isGenerating}
                                    onClick={handleGenerate}
                                    aria-label="Generate"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'inherit',
                                        font: 'inherit',
                                        cursor: (!selectedTeam || selectedPlayers.length === 0 || loading || isGenerating) ? 'not-allowed' : 'pointer',
                                        flex: 1,
                                        textAlign: 'center',
                                        outline: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    {isGenerating && (
                                        <svg className="animate-spin" style={{ height: 20, width: 20, color: '#2E90FA', marginRight: 6 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    )}
                                    {isGenerating ? 'Generating...' : 'Generate'}
                                </button>
                                <button
                                    type="button"
                                    className="down-arrow flex items-center justify-center bg-transparent border-0 p-0 m-0 focus:outline-none"
                                    style={{
                                        fontSize: '1.7rem',
                                        color: dropdownOpen
                                            ? '#1976d2'
                                            : (!selectedTeam || selectedPlayers.length === 0 ? '#4f8cff' : '#1a237e'),
                                        textShadow: (!selectedTeam || selectedPlayers.length === 0)
                                            ? '0 1px 2px #e3eaf3'
                                            : '0 1px 2px #ffd60044',
                                        cursor: (!selectedTeam || selectedPlayers.length === 0) ? 'not-allowed' : 'pointer',
                                        background: 'none',
                                        outline: 'none',
                                        transition: 'color 0.2s, text-shadow 0.2s',
                                        zIndex: 20,
                                    }}
                                    tabIndex={(!selectedTeam || selectedPlayers.length === 0) ? -1 : 0}
                                    aria-haspopup="menu"
                                    aria-expanded={dropdownOpen}
                                    aria-label="Show generate options"
                                    disabled={!selectedTeam || selectedPlayers.length === 0 || loading}
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (!selectedTeam || selectedPlayers.length === 0 || loading) return;
                                        setDropdownOpen(open => !open);
                                    }}
                                    onKeyDown={e => {
                                        if ((e.key === 'Enter' || e.key === ' ') && !(!selectedTeam || selectedPlayers.length === 0 || loading)) {
                                            e.preventDefault();
                                            setDropdownOpen(open => !open);
                                        }
                                    }}
                                >
                                    <span style={{ display: 'inline-block', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                                </button>
                                {dropdownOpen && (
                                    <div
                                        className="dropdown-options smaller-dropdown rounded-lg shadow-md bg-white border border-gray-200 py-2 absolute z-10"
                                        style={{ minWidth: 0, width: 180, right: 0, left: 'auto', top: '100%', marginTop: 4 }}
                                        role="menu"
                                    >
                                        <button
                                            className={`dropdown-option-btn w-full text-left px-4 py-2 rounded-md transition ${dlsMode ? 'bg-blue-100 font-semibold' : 'hover:bg-yellow-100'}`}
                                            style={{ fontSize: '1rem', marginBottom: 2 }}
                                            onClick={() => setDlsMode((v) => !v)}
                                            type="button"
                                            tabIndex={0}
                                        >
                                            DLS Mode {dlsMode && '✓'}
                                        </button>
                                        <button
                                            className={`dropdown-option-btn w-full text-left px-4 py-2 rounded-md transition ${injuryOpt ? 'bg-blue-100 font-semibold' : 'hover:bg-yellow-100'}`}
                                            style={{ fontSize: '1rem', marginBottom: 2 }}
                                            onClick={() => {
                                                setInjuryOpt((v) => {
                                                    handleDropdownSelect(!v ? "Injury Optimization" : "Other");
                                                    return !v;
                                                });
                                            }}
                                            type="button"
                                            tabIndex={0}
                                        >
                                            Injury Optimization {injuryOpt && '✓'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;

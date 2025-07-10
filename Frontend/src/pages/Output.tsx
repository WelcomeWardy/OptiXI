import { useEffect, useState } from 'react';

const Output = () => {
  const [teamResult, setTeamResult] = useState<string[]>([]);
  const [aiResult, setAIResult] = useState<string | null>(null)
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


  return (
    <div className="home">
      <div className="home-bg-graphics">
        <div className="ball ball1"></div>
        <div className="ball ball2"></div>
        <div className="ball ball3"></div>
        <div className="ball ball4"></div>
        <div className="ball ball5"></div>
      </div>

      <div style={{ margin: '5rem auto', textAlign: 'center', color: '#222', fontSize: '2rem', fontWeight: 700 }}>
        Output Page (Team/Custom results will be shown here.)
      </div>

      <div id="output">
        {teamResult.length > 0 && (
          <>
            <h3>Generated Team Result:</h3>
            {teamResult.map((player, index) => (
              <p key={index}>{player}</p>
            ))}
          </>
        )}
        <br></br>
        {aiResult && (
          <>
            <h3>AI Result:</h3>
            <p>{aiResult}</p>
          </>
)}
      </div>
    </div>
  );
};

export default Output;
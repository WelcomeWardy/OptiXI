import { useEffect, useState } from 'react';

const Output = () => {
  const [teamResult, setTeamResult] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/generatedTeam", {
      method: "POST", // if you want POST; else use "GET"
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(res => res.json())
      .then(data => {
        setTeamResult(data.result); // result should be an array
      });
  }, []);

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
      </div>
    </div>
  );
};

export default Output;
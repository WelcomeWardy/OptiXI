from flask import Flask, request, jsonify
from flask_cors import CORS
from model import Model
import pandas as pd
model = Model()
app = Flask(__name__)
CORS(app)  # allow frontend (React) to communicate

# In-memory store for the generated team
generated_team = []
selectedTeam = ""
@app.route("/generateTeamMode", methods = ["POST"])
def generating():
    data = request.get_json()
    team = data.get("team", "")
    injured_players = data.get("injuredplayers", [])
    injury_enabled = data.get("injuryMode")
    dls_enabled = data.get("dlsmode")
    global generated_team
    generated_team = model.predict_team_mode(injury_enabled,team,dls_enabled,injured_players)
    return jsonify({"status":"generated"})
@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    selected_players = data.get("players", [])
    print("Recieved players: " + str(len(selected_players)))
    injured_players = data.get("injuredplayers", [])
    team = data.get("team", "")
    modes = data.get("modes", [])
    df = model.get_df(selected_players)
    teams = df["Team"].unique()
    isInjured = ("Injury Optimization" in modes)
    isDls = ("DLS Mode" in modes)
    # 👇 Combine or process as needed
    global generated_team
    generated_team = model.prediction_custom_mode(teams,team,isInjured,df,injured_players,isDls)

    # You can modify this to call your real model logic
    return jsonify({"status": "generated"})

@app.route("/sendTeam", methods = ["POST"])
def team_mode():
    global selectedTeam
    data = request.get_json()
    selectedTeam = data.get("team","")
    names = model.get_team_players(selectedTeam)
    print(names,selectedTeam)
    return jsonify({"result": names or []})


@app.route("/generatedTeam", methods=["POST"])  # you used POST, so match that
def send_team():
    return jsonify({"result": generated_team or []})


if __name__ == '__main__':
    app.run(debug=True)

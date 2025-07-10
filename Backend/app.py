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
    print(isInjured)
    isDls = ("DLS Mode" in modes)
    print(isDls)
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

@app.route("/generateAIExplanation", methods = ["POST"])
def generate_respons():
    data = request.get_json()
    playingxii = data.get("results")
    print(playingxii)
    stadium = ""
    prompt = ""
    for i in playingxii:
        if "Ground" in i:
            # Find the start index of the stadium name
            start_index = i.find("for ")
            start_index += len("for ")  # move past "for "

            # Find the end index (before the trailing dashes)
            end_index = i.find(" ---", start_index)

            # Slice the stadium name
            stadium = i[start_index:end_index]
            break
        else:
            prompt = prompt + i + "\n"
    prompt = prompt + f'''
give me ONLY A  small paragraph of maximum 4 lines of explanation nothing more nothing less as to why this team was selected. Theese are the features we checked make sure this is also taken into consideration:
-we have maximum 4 overseas players.
-we have to make sure the bowling is stable, such as usage of new ball - death overs - middle overs should be included and also suppose if there is lot of allphase make sure to add that since he is a bowler who bowls throughout the game he is added.
-also mention why certain players were picked since the team plays in the {stadium}.
-we have to make sure the batting is stable, with finisher, few hard hitters, an explosive opener, and suppose if there is an anchor batter and if he does get replaced mention that he was replaced because consistent batter exists.

I WANT AN EXPLANATION OF WHY THEY'RE SELECTED USING DETAILS ABOVE. MAKE SURE ITS ONLY MAIXMUM OF 4 LINES
'''
    print(prompt)
    output = model.ai_prediction(prompt)
    return jsonify({"result": output or []})

if __name__ == '__main__':
    app.run(debug=True)

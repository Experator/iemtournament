from flask import Flask, render_template, jsonify
import json
import os
from datetime import datetime

from data.tournament_data import TOURNAMENT_DATA
from data.teams_data import TEAMS
from data.matches_data import MATCHES_DETAILS
from data.schedule_data import SCHEDULE
from data.bracket_data import BRACKET

app = Flask(__name__, static_folder="static", static_url_path="/static")


@app.route("/")
def index():
    return render_template("index.html", tournament=TOURNAMENT_DATA, teams=TEAMS)


@app.route("/bracket")
def bracket():
    return render_template("bracket.html", tournament=TOURNAMENT_DATA, bracket=BRACKET)


@app.route("/schedule")
def schedule():
    return render_template(
        "schedule.html",
        tournament=TOURNAMENT_DATA,
        schedule=SCHEDULE,
        matches_details=MATCHES_DETAILS,
    )


@app.route("/teams")
def teams():
    return render_template("teams.html", tournament=TOURNAMENT_DATA, teams=TEAMS)


@app.route("/team/<team_id>")
def team(team_id):
    if team_id in TEAMS:
        return render_template(
            "team.html", tournament=TOURNAMENT_DATA, team=TEAMS[team_id]
        )
    else:
        return "Команда не найдена", 404


@app.route("/match/<match_id>")
def match_detail(match_id):
    if match_id in MATCHES_DETAILS:
        return render_template(
            "match.html", tournament=TOURNAMENT_DATA, match=MATCHES_DETAILS[match_id]
        )
    else:
        return "Матч не найден", 404


@app.route("/api/bracket")
def api_bracket():
    return jsonify(BRACKET)


@app.route("/api/schedule")
def api_schedule():
    return jsonify(SCHEDULE)


@app.route("/api/teams")
def api_teams():
    return jsonify(TEAMS)


@app.route("/api/match/<match_id>")
def api_match_detail(match_id):
    if match_id in MATCHES_DETAILS:
        return jsonify(MATCHES_DETAILS[match_id])
    else:
        return jsonify({"error": "Матч не найден"}), 404


if __name__ == "__main__":
    os.makedirs("static/images/logos", exist_ok=True)
    os.makedirs("static/images/players", exist_ok=True)
    app.run(debug=True, port=5000)

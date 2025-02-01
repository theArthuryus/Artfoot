// Simulate matches
export function simulateAllMatches() {
  const roundMatches = schedule.slice(currentRound, currentRound + 3);
  roundMatches.forEach(([team1, team2]) => {
    const result = determineMatchResult();
    if (result === "win") {
      updatePoints(team1, 3);
    } else if (result === "loss") {
      updatePoints(team2, 3);
    } else {
      updatePoints(team1, 1);
      updatePoints(team2, 1);
    }
    recordMatchHistory(team1, team2, result);
  });
}

// Determine match result
function determineMatchResult() {
  const random = Math.random();
  if (random < 0.4) return "win";
  if (random < 0.8) return "loss";
  return "tie";
}

// Update points
function updatePoints(teamName, points) {
  const team = league.find((t) => t.name === teamName);
  team.points += points;
}

// Record match history
function recordMatchHistory(team1, team2, result) {
  const team1Obj = league.find((t) => t.name === team1);
  const team2Obj = league.find((t) => t.name === team2);
  if (!team1Obj.history) team1Obj.history = [];
  if (!team2Obj.history) team2Obj.history = [];

  if (result === "win") {
    team1Obj.history.push({ opponent: team2, result: "Win" });
    team2Obj.history.push({ opponent: team1, result: "Loss" });
  } else if (result === "loss") {
    team1Obj.history.push({ opponent: team2, result: "Loss" });
    team2Obj.history.push({ opponent: team1, result: "Win" });
  } else {
    team1Obj.history.push({ opponent: team2, result: "Tie" });
    team2Obj.history.push({ opponent: team1, result: "Tie" });
  }
}
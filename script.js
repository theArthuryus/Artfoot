// Import match mechanics
import { simulateAllMatches } from "./matchMechanics.js";

// Initial game state
let currentTeam = "";
let league = [];
let schedule = [];
let currentRound = 0;
let season = 1;

// Arrays for random names
const brazilianFunnyNames = ["Maria Máquina", "Maria Panela", "Maria Passa Cantando", "Mário de Seu Pereira", "Meirelaz Assunção"];
const portugueseVegetablesAndFruits = ["Abóbora", "Banana", "Cenoura", "Tomate", "Laranja"];
const funnyTeamNames = ["Chulé FC", "Unidos da Gastrite", "Atletico de Catinga", "Esporte Clube Pamonha", "Feijoada United", "Bola Murcha FC"];
const famousSoccerCoaches = ["Pep Guardiola", "José Mourinho", "Carlo Ancelotti", "Jurgen Klopp", "Zinedine Zidane", "Didier Deschamps"];

// Generate a unique player name
function generateUniqueName(existingNames) {
  let fullName;
  do {
    const firstName = brazilianFunnyNames[Math.floor(Math.random() * brazilianFunnyNames.length)];
    const lastName = portugueseVegetablesAndFruits[Math.floor(Math.random() * portugueseVegetablesAndFruits.length)];
    fullName = `${firstName} ${lastName}`;
  } while (existingNames.includes(fullName));
  return fullName;
}

// Generate players with random stats
function generatePlayers(count) {
  const players = [];
  const existingNames = [];
  for (let i = 0; i < count; i++) {
    const name = generateUniqueName(existingNames);
    existingNames.push(name);
    const performance = Math.floor(Math.random() * 100);
    const price = Math.floor(performance * 10);
    players.push({ name, performance, price });
  }
  return players;
}

// Generate teams
function generateLeague() {
  const teamNames = [];
  for (let i = 0; i < 6; i++) {
    let teamName;
    do {
      teamName = funnyTeamNames[Math.floor(Math.random() * funnyTeamNames.length)];
    } while (teamNames.includes(teamName));
    teamNames.push(teamName);

    league.push({
      name: teamName,
      points: 0,
      budget: 5000,
      players: generatePlayers(12),
      manager: famousSoccerCoaches[Math.floor(Math.random() * famousSoccerCoaches.length)],
      history: [],
    });
  }
}

// Populate leaderboard
function populateLeaderboard() {
  const table = document.getElementById("leaderboard-table");
  table.innerHTML = `<tr><th>Team Name</th><th>Points</th></tr>`;
  league.forEach((team) => {
    const row = table.insertRow();
    const cellName = row.insertCell(0);
    const cellPoints = row.insertCell(1);
    cellName.textContent = team.name;
    cellName.onclick = () => showTeamRoster(team.name);
    cellName.style.cursor = "pointer";
    cellName.style.color = "#007bff";
    cellName.style.textDecoration = "underline";
    cellPoints.textContent = team.points;
  });
}

// Assign a random team to the user
function assignRandomTeam() {
  const randomIndex = Math.floor(Math.random() * league.length);
  currentTeam = league[randomIndex].name;

  alert(`You have been assigned to manage "${currentTeam}" as ${league[randomIndex].manager}.`);
  document.getElementById("current-team-name").textContent = currentTeam;
  populatePlayerTable();
  populateLeaderboard();
  updateBudgetDisplay();
  updateNextRound();
}

// Generate match schedule
function generateSchedule() {
  const teamNames = league.map((team) => team.name);
  const newSchedule = [];
  const rounds = [];

  for (let i = 0; i < teamNames.length - 1; i++) {
    const round = [];
    for (let j = 0; j < teamNames.length / 2; j++) {
      round.push([teamNames[j], teamNames[teamNames.length - 1 - j]]);
    }
    rounds.push(round);
    teamNames.splice(1, 0, teamNames.pop());
  }

  rounds.forEach((round) => newSchedule.push(...round));
  return newSchedule;
}

// Update next round display
function updateNextRound() {
  const nextRoundContainer = document.getElementById("next-round");
  nextRoundContainer.innerHTML = "";

  if (currentRound < schedule.length) {
    const roundMatches = schedule.slice(currentRound, currentRound + 3);
    roundMatches.forEach(([team1, team2], index) => {
      const matchElement = document.createElement("p");
      matchElement.innerHTML = `
        Match ${currentRound / 3 + index + 1}: 
        <span onclick="showTeamRoster('${team1}')">${team1}</span> vs 
        <span onclick="showTeamRoster('${team2}')">${team2}</span>
      `;
      nextRoundContainer.appendChild(matchElement);
    });
  } else {
    nextRoundContainer.textContent = "Season Over!";
  }
}

// Play next round
function playNextRound() {
  const selectedPlayers = document.querySelectorAll(".player-checkbox:checked").length;
  if (selectedPlayers < 6) {
    alert("You must select exactly 6 players to play the round.");
    return;
  }

  if (currentRound >= schedule.length) {
    endSeason();
    return;
  }

  simulateAllMatches(); // Call the imported function
  updateLastResults();
  populateLeaderboard();
  currentRound += 3;
  updateNextRound();
}

// Start over
function startOver() {
  league = [];
  schedule = [];
  currentRound = 0;
  season = 1;
  initializeGame();
}

// End season
function endSeason() {
  const sortedTeams = league.sort((a, b) => b.points - a.points);
  const winningTeams = sortedTeams.filter((team) => team.points === sortedTeams[0].points);

  winningTeams.forEach((team) => {
    team.budget += 10000;
  });

  alert("Season Over! Winning teams receive $10,000 bonus.");

  // Reset points and prepare for the next season
  league.forEach((team) => {
    team.points = 0;
    team.history = [];
  });

  season++;
  const seasonNumberElement = document.getElementById("season-number");
  if (seasonNumberElement) {
    seasonNumberElement.textContent = season;
  } else {
    console.error("Element with ID 'season-number' not found.");
  }

  // Regenerate schedule for the new season
  schedule = generateSchedule();
  currentRound = 0;
  populateLeaderboard();
  updateNextRound();
}

// Initialize the game
function initializeGame() {
  generateLeague();
  schedule = generateSchedule();
  assignRandomTeam();
}

// Ensure the DOM is fully loaded before initializing the game
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
});

// Export functions for use in HTML
export { startOver, showTeamSchedule, showLeagueSchedule, sortRosterByPerformance, autoSelectFirst6 };

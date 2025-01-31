// Initial game state
let currentTeam = ""; // Tracks the currently selected team
let league = []; // Array to store all teams in the league
let schedule = []; // Array to store the match schedule
let currentRound = 0; // Tracks the current round of matches

// Arrays for random names (hardcoded instead of fetched)
const brazilianFunnyNames = [
  "Maria Máquina", "Maria Panela", "Maria Passa Cantando", "Mário de Seu Pereira", "Meirelaz Assunção"
];

const portugueseVegetablesAndFruits = [
  "Abóbora", "Banana", "Cenoura", "Tomate", "Laranja"
];

const funnyTeamNames = [
  "Chulé FC", "Unidos da Gastrite", "Atletico de Catinga", "Esporte Clube Pamonha", "Feijoada United"
];

const famousSoccerCoaches = [
  "Pep Guardiola", "José Mourinho", "Carlo Ancelotti", "Jurgen Klopp", "Zinedine Zidane"
];

// Generate a random name (first + last) that doesn't repeat
function generateUniqueName(existingNames) {
  let firstName, lastName, fullName;
  do {
    firstName = brazilianFunnyNames[Math.floor(Math.random() * brazilianFunnyNames.length)];
    lastName = portugueseVegetablesAndFruits[Math.floor(Math.random() * portugueseVegetablesAndFruits.length)];
    fullName = `${firstName} ${lastName}`;
  } while (existingNames.includes(fullName)); // Ensure the name is unique
  return fullName;
}

// Generate players with random names, performance levels, and prices
function generatePlayers(count) {
  const players = [];
  const existingNames = [];
  for (let i = 1; i <= count; i++) {
    const name = generateUniqueName(existingNames);
    existingNames.push(name);
    const performance = Math.floor(Math.random() * 100); // Random performance level (0-100)
    const price = Math.floor(performance * 100 / 10); // Price correlates with performance
    players.push({
      name,
      performance,
      price,
      history: [], // Track team history
    });
  }
  return players;
}

// Generate 5 teams with random rosters, budgets, and names
function generateLeague() {
  const teamNames = [];
  for (let i = 0; i < 5; i++) {
    let teamName;
    do {
      teamName = funnyTeamNames[Math.floor(Math.random() * funnyTeamNames.length)];
    } while (teamNames.includes(teamName)); // Ensure the team name is unique
    teamNames.push(teamName);

    league.push({
      name: teamName,
      points: 0,
      budget: 5000, // Starting budget reduced to $5,000
      players: generatePlayers(12), // Reduced number of players
      manager: famousSoccerCoaches[Math.floor(Math.random() * famousSoccerCoaches.length)],
    });
  }
}

// Populate the leaderboard table
function populateLeaderboard() {
  const table = document.getElementById("leaderboard-table");
  table.innerHTML = `
    <tr>
      <th>Team Name</th>
      <th>Points</th>
    </tr>
  `;
  league.forEach((team) => {
    const row = table.insertRow();
    const cellName = row.insertCell(0);
    const cellPoints = row.insertCell(1);
    cellName.textContent = team.name;
    cellName.onclick = () => showTeamRoster(team.name); // Make team clickable
    cellName.style.cursor = "pointer";
    cellName.style.color = "#007bff"; // Blue text for clickable teams
    cellName.style.textDecoration = "underline"; // Underline for clickable teams
    cellPoints.textContent = team.points;
  });
}

// Automatically assign a team to the user
function assignRandomTeam() {
  const randomIndex = Math.floor(Math.random() * league.length);
  currentTeam = league[randomIndex].name;
  alert(`You have been assigned to manage "${currentTeam}" as ${league[randomIndex].manager}.`);
  
  // Update the team name display
  document.getElementById("current-team-name").textContent = currentTeam;

  populatePlayerTable();
  populateLeaderboard();
  updateBudgetDisplay();
  updateNextMatch();
}

// Generate the match schedule
function generateSchedule() {
  const teamNames = league.map((team) => team.name);
  const newSchedule = [];
  for (let i = 0; i < teamNames.length; i++) {
    for (let j = i + 1; j < teamNames.length; j++) {
      newSchedule.push([teamNames[i], teamNames[j]]);
    }
  }
  return newSchedule;
}

// Simulate results for all matches in the schedule
function simulateAllMatches() {
  schedule.forEach(([team1, team2]) => {
    const team1Strength = calculateTeamStrength(team1);
    const team2Strength = calculateTeamStrength(team2);

    if (team1Strength > team2Strength) {
      updatePoints(team1, 3);
    } else if (team1Strength < team2Strength) {
      updatePoints(team2, 3);
    } else {
      updatePoints(team1, 1);
      updatePoints(team2, 1);
    }
  });
}

// Play the next match
function playNextMatch() {
  const selectedPlayers = document.querySelectorAll(".player-checkbox:checked").length;
  if (selectedPlayers < 6) {
    alert("You must select exactly 6 players to play the match."); // Validation for player selection <button class="citation-flag" data-index="8">
    return;
  }

  if (currentRound >= schedule.length) {
    alert("The season is over! Resetting schedule...");
    schedule = generateSchedule(); // Reset schedule <button class="citation-flag" data-index="4">
    currentRound = 0;
    updateNextMatch();
    return;
  }

  // Simulate results for all matches in the current round
  simulateAllMatches();

  // Simulate the user's match
  const [team1, team2] = schedule[currentRound];
  const team1Strength = calculateTeamStrength(team1);
  const team2Strength = calculateTeamStrength(team2);

  let result;
  if (team1Strength > team2Strength) {
    result = `${team1} wins!`;
    updatePoints(team1, 3);
  } else if (team1Strength < team2Strength) {
    result = `${team2} wins!`;
    updatePoints(team2, 3);
  } else {
    result = "The match ended in a draw.";
    updatePoints(team1, 1);
    updatePoints(team2, 1);
  }

  document.getElementById("result").innerText = result;
  populateLeaderboard(); // Update leaderboard after the match
  currentRound++;
  updateNextMatch();
}

// Calculate team strength based on all players (not just selected ones)
function calculateTeamStrength(teamName) {
  const team = league.find((t) => t.name === teamName);
  if (!team || !team.players) return 0; // Handle cases where the team or players are undefined
  return team.players.reduce((sum, player) => sum + player.performance, 0);
}

// Update points for a team
function updatePoints(teamName, points) {
  const team = league.find((t) => t.name === teamName);
  team.points += points;
}

// Update the budget display
function updateBudgetDisplay() {
  const team = league.find((t) => t.name === currentTeam);
  document.getElementById("current-budget").textContent = team.budget;
  document.getElementById("current-manager").textContent = team.manager;
}

// Update the next match display to show the next two matches
function updateNextMatch() {
  const nextMatchesContainer = document.getElementById("next-match");
  nextMatchesContainer.innerHTML = ""; // Clear previous content

  if (currentRound < schedule.length) {
    // Show up to two matches
    const matchesToShow = schedule.slice(currentRound, currentRound + 2);
    matchesToShow.forEach(([team1, team2], index) => {
      const matchElement = document.createElement("p");
      matchElement.innerHTML = `
        Match ${currentRound + index + 1}: 
        <span onclick="showTeamRoster('${team1}')">${team1}</span> vs 
        <span onclick="showTeamRoster('${team2}')">${team2}</span>
      `;
      nextMatchesContainer.appendChild(matchElement);
    });
  } else {
    nextMatchesContainer.textContent = "Season Over!";
  }
}

// Populate the player table for the current team with Buy/Sell options
function populatePlayerTable() {
  const team = league.find((t) => t.name === currentTeam);
  const table = document.getElementById("player-table");
  table.innerHTML = `
    <tr>
      <th>Select</th>
      <th>Player Name</th>
      <th>Performance Level</th>
      <th>Action</th>
    </tr>
  `;
  team.players.forEach((player, index) => {
    const row = table.insertRow();
    const cellCheckbox = row.insertCell(0);
    const cellName = row.insertCell(1);
    const cellPerformance = row.insertCell(2);
    const cellAction = row.insertCell(3);
    cellCheckbox.innerHTML = `<input type="checkbox" class="player-checkbox">`;
    cellName.textContent = player.name;
    cellPerformance.textContent = player.performance;
    cellAction.innerHTML = `
      <button onclick="sellPlayer('${player.name}')">Sell</button>
    `;
  });

  // Add event listeners to checkboxes
  document.querySelectorAll(".player-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", validateSelectedPlayers);
  });
}

// Validate selected players
function validateSelectedPlayers() {
  const selectedPlayers = document.querySelectorAll(".player-checkbox:checked").length;
  const playButton = document.getElementById("play-next-match");
  if (selectedPlayers >= 6) {
    playButton.disabled = false;
  } else {
    playButton.disabled = true;
  }
}

// Sell a player
function sellPlayer(playerName) {
  const currentTeamObj = league.find((t) => t.name === currentTeam);
  const playerIndex = currentTeamObj.players.findIndex((p) => p.name === playerName);
  if (playerIndex === -1) {
    alert("Player not found in your roster.");
    return;
  }

  const player = currentTeamObj.players[playerIndex];
  const salePrice = Math.floor(player.price * 0.9); // Deduct 10% as transaction fee

  // Randomly choose a team to buy the player
  const otherTeams = league.filter((t) => t.name !== currentTeam);
  const buyerTeam = otherTeams[Math.floor(Math.random() * otherTeams.length)];

  // Update budgets
  currentTeamObj.budget += salePrice;
  buyerTeam.budget -= salePrice;

  // Transfer player
  buyerTeam.players.push(player);
  currentTeamObj.players.splice(playerIndex, 1);

  alert(`Sold ${player.name} to ${buyerTeam.name} for $${salePrice}.`);
  populatePlayerTable();
  updateBudgetDisplay();
}

// Show Team Roster in a Modal with Buy Options
function showTeamRoster(teamName) {
  const team = league.find((t) => t.name === teamName);
  const modal = document.getElementById("other-team-roster-modal");
  const table = document.getElementById("other-player-table");
  const teamNameHeader = document.getElementById("other-team-name");

  // Update the modal title
  teamNameHeader.textContent = `${team.name} Roster`;

  // Populate the player table
  table.innerHTML = `
    <tr>
      <th>Player Name</th>
      <th>Performance Level</th>
      <th>Action</th>
    </tr>
  `;
  team.players.forEach((player) => {
    const row = table.insertRow();
    const cellName = row.insertCell(0);
    const cellPerformance = row.insertCell(1);
    const cellAction = row.insertCell(2);
    cellName.textContent = player.name;
    cellPerformance.textContent = player.performance;
    cellAction.innerHTML = `
      <button onclick="buyPlayer('${player.name}', '${team.name}')">Buy</button>
    `;
  });

  // Show the modal
  modal.style.display = "block";

  // Close modal when clicking the close button
  document.querySelector("#other-team-roster-modal .close").onclick = () => {
    modal.style.display = "none";
  };
}

// Buy a player from another team
function buyPlayer(playerName, sellerTeamName) {
  const currentTeamObj = league.find((t) => t.name === currentTeam);
  const sellerTeam = league.find((t) => t.name === sellerTeamName);

  const playerIndex = sellerTeam.players.findIndex((p) => p.name === playerName);
  if (playerIndex === -1) {
    alert("Player not found in the seller's roster.");
    return;
  }

  const player = sellerTeam.players[playerIndex];

  // Check if the current team has enough budget
  if (currentTeamObj.budget < player.price) {
    alert("Not enough budget to buy this player.");
    return;
  }

  // Update budgets
  currentTeamObj.budget -= player.price;
  sellerTeam.budget += player.price;

  // Transfer player
  currentTeamObj.players.push(player);
  sellerTeam.players.splice(playerIndex, 1);

  alert(`Bought ${player.name} from ${sellerTeam.name} for $${player.price}.`);
  populatePlayerTable();
  updateBudgetDisplay();
}

// Show Team Schedule
function showTeamSchedule() {
  const modal = document.getElementById("team-schedule-modal");
  const scheduleList = document.getElementById("schedule-list");
  scheduleList.innerHTML = "";

  // Filter matches involving the current team
  const filteredSchedule = schedule.filter(
    ([team1, team2]) => team1 === currentTeam || team2 === currentTeam
  );

  filteredSchedule.forEach(([team1, team2], index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Match ${index + 1}: ${team1} vs ${team2}`;
    scheduleList.appendChild(listItem);
  });

  modal.style.display = "block";

  // Close modal when clicking the close button
  document.querySelector("#team-schedule-modal .close").onclick = () => {
    modal.style.display = "none";
  };
}

// Auto Select First 6 Players
function autoSelectFirst6() {
  const checkboxes = document.querySelectorAll(".player-checkbox");
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = index < 6;
  });
  validateSelectedPlayers();
}

// Start Over
function startOver() {
  league = [];
  schedule = [];
  currentRound = 0;
  currentTeam = "";
  initializeGame(); // Reinitialize the game
}

// Initialize the game
function initializeGame() {
  generateLeague();
  schedule = generateSchedule(); // Generate the match schedule <button class="citation-flag" data-index="4">
  assignRandomTeam(); // Assign a random team to the user <button class="citation-flag" data-index="1">
}

// Call the function to initialize the game when the page loads
window.onload = initializeGame;
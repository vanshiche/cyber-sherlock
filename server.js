const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { analyzeAttack, predictNextMove } = require('./utils/minimax');
const { analyzeLogData } = require('./utils/logAnalyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Sample attack scenarios for demonstration
const sampleAttackScenarios = [
  {
    id: 1,
    name: "SQL Injection Attack",
    description: "Attacker attempts to exploit vulnerable SQL queries",
    complexity: "Medium",
    impact: "High",
    possiblePaths: [
      "Reconnaissance -> Find Vulnerable Form -> Inject SQL -> Exfiltrate Data",
      "Reconnaissance -> Find Admin Page -> Brute Force -> Inject SQL -> Escalate Privileges"
    ]
  },
  {
    id: 2,
    name: "Phishing Campaign",
    description: "Attacker sends fake emails to trick users into revealing credentials",
    complexity: "Low",
    impact: "Medium",
    possiblePaths: [
      "Create Fake Site -> Send Emails -> Collect Credentials -> Access Systems",
      "Create Fake Site -> Social Media Campaign -> Collect Credentials -> Sell on Dark Web"
    ]
  },
  {
    id: 3,
    name: "Ransomware Attack",
    description: "Malware that encrypts files and demands payment",
    complexity: "High",
    impact: "Critical",
    possiblePaths: [
      "Phishing Email -> Malware Download -> Privilege Escalation -> Encrypt Files -> Demand Ransom",
      "Exploit Vulnerability -> Lateral Movement -> Encrypt Files -> Demand Ransom"
    ]
  }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Get all attack scenarios
app.get('/api/scenarios', (req, res) => {
  res.json(sampleAttackScenarios);
});

// Get a specific attack scenario
app.get('/api/scenarios/:id', (req, res) => {
  const scenario = sampleAttackScenarios.find(s => s.id === parseInt(req.params.id));
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });
  res.json(scenario);
});

// Analyze attack path
app.post('/api/analyze', (req, res) => {
  const { logs, attackType } = req.body;
  if (!logs) {
    return res.status(400).json({ error: 'Log data is required' });
  }

  const logAnalysis = analyzeLogData(logs);
  const attackPrediction = analyzeAttack(logAnalysis, attackType);
  
  res.json({
    analysis: logAnalysis,
    prediction: attackPrediction,
    recommendedActions: generateRecommendations(attackPrediction)
  });
});

// Predict next move
app.post('/api/predict', (req, res) => {
  const { currentState, attackType } = req.body;
  
  if (!currentState) {
    return res.status(400).json({ error: 'Current state is required' });
  }
  
  const prediction = predictNextMove(currentState, attackType);
  
  res.json({
    currentState,
    predictedNextMoves: prediction.nextMoves,
    confidence: prediction.confidence,
    recommendedDefense: prediction.recommendedDefense
  });
});

// Helper function to generate recommendations
function generateRecommendations(prediction) {
  // This would be more sophisticated in a real implementation
  const recommendations = [
    "Block IP addresses identified in the analysis",
    "Update firewall rules to prevent similar attack patterns",
    "Monitor the identified systems for unusual activity",
    "Apply security patches to affected systems"
  ];
  
  return recommendations;
}

// Start server
app.listen(PORT, () => {
  console.log(`CyberSherlock server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to access the application`);
});
/**
 * Implementation of Minimax algorithm with Alpha-Beta pruning
 * for cyber attack simulation and prediction
 */

// Attack graph nodes represent possible states in an attack
class AttackNode {
    constructor(state, isAttackerTurn) {
      this.state = state;
      this.isAttackerTurn = isAttackerTurn;
      this.children = [];
      this.value = null;
    }
  }
  
  // Simple attack patterns database
  const attackPatterns = {
    "sql_injection": {
      steps: ["reconnaissance", "vulnerability_discovery", "payload_preparation", "exploitation", "data_exfiltration"],
      defenses: ["input_validation", "prepared_statements", "waf_implementation", "database_monitoring"]
    },
    "phishing": {
      steps: ["email_preparation", "domain_spoofing", "sending_campaign", "credential_harvesting", "account_takeover"],
      defenses: ["email_filtering", "user_training", "mfa_implementation", "anomaly_detection"]
    },
    "ransomware": {
      steps: ["initial_access", "privilege_escalation", "lateral_movement", "data_encryption", "ransom_demand"],
      defenses: ["backup_systems", "patch_management", "network_segmentation", "endpoint_protection"]
    }
  };
  
  /**
   * Evaluates the current state of the attack/defense scenario
   * Higher values favor the attacker, lower values favor the defender
   */
  function evaluateState(state, attackType) {
    // This would be more sophisticated in a real implementation
    let score = 0;
    
    // If attackType is specified, use its specific scoring
    const pattern = attackPatterns[attackType] || { steps: [], defenses: [] };
    
    // Count successful attack steps
    pattern.steps.forEach(step => {
      if (state.completedAttackSteps && state.completedAttackSteps.includes(step)) {
        score += 10;
      }
    });
    
    // Count implemented defenses
    pattern.defenses.forEach(defense => {
      if (state.implementedDefenses && state.implementedDefenses.includes(defense)) {
        score -= 8;
      }
    });
    
    // Adjust based on other factors
    if (state.systemsCompromised) score += state.systemsCompromised * 5;
    if (state.detectionEvents) score -= state.detectionEvents * 3;
    
    return score;
  }
  
  /**
   * Generate possible next states from current state
   */
  function generateNextStates(currentState, isAttackerTurn, attackType) {
    const nextStates = [];
    const pattern = attackPatterns[attackType] || { steps: [], defenses: [] };
    
    if (isAttackerTurn) {
      // Attacker's turn - try the next attack step
      const completedSteps = currentState.completedAttackSteps || [];
      
      // Find the next possible attack steps
      pattern.steps.forEach(step => {
        if (!completedSteps.includes(step)) {
          const newState = JSON.parse(JSON.stringify(currentState));
          newState.completedAttackSteps = [...completedSteps, step];
          
          // Simulate some detection probability
          if (Math.random() > 0.7) {
            newState.detectionEvents = (newState.detectionEvents || 0) + 1;
          }
          
          nextStates.push(newState);
        }
      });
    } else {
      // Defender's turn - implement defenses
      const implementedDefenses = currentState.implementedDefenses || [];
      
      // Find defenses that haven't been implemented yet
      pattern.defenses.forEach(defense => {
        if (!implementedDefenses.includes(defense)) {
          const newState = JSON.parse(JSON.stringify(currentState));
          newState.implementedDefenses = [...implementedDefenses, defense];
          nextStates.push(newState);
        }
      });
    }
    
    // If no next states are available, return the current state
    return nextStates.length > 0 ? nextStates : [currentState];
  }
  
  /**
   * Minimax algorithm with Alpha-Beta pruning
   */
  function minimax(node, depth, alpha, beta, isMaximizingPlayer, attackType) {
    // Terminal condition
    if (depth === 0) {
      node.value = evaluateState(node.state, attackType);
      return node.value;
    }
    
    // Generate next possible states
    const nextStates = generateNextStates(node.state, isMaximizingPlayer, attackType);
    
    if (isMaximizingPlayer) { // Attacker's turn
      let maxEval = -Infinity;
      
      for (const nextState of nextStates) {
        const childNode = new AttackNode(nextState, !isMaximizingPlayer);
        node.children.push(childNode);
        
        const evalValue = minimax(childNode, depth - 1, alpha, beta, false, attackType);
        maxEval = Math.max(maxEval, evalValue);
        
        // Alpha-Beta pruning
        alpha = Math.max(alpha, evalValue);
        if (beta <= alpha) break;
      }
      
      node.value = maxEval;
      return maxEval;
    } else { // Defender's turn
      let minEval = Infinity;
      
      for (const nextState of nextStates) {
        const childNode = new AttackNode(nextState, !isMaximizingPlayer);
        node.children.push(childNode);
        
        const evalValue = minimax(childNode, depth - 1, alpha, beta, true, attackType);
        minEval = Math.min(minEval, evalValue);
        
        // Alpha-Beta pruning
        beta = Math.min(beta, evalValue);
        if (beta <= alpha) break;
      }
      
      node.value = minEval;
      return minEval;
    }
  }
  
  /**
   * Analyze an attack based on current evidence
   */
  function analyzeAttack(logAnalysis, attackType) {
    const initialState = {
      completedAttackSteps: logAnalysis.detectedSteps || [],
      implementedDefenses: logAnalysis.activeDefenses || [],
      systemsCompromised: logAnalysis.compromisedSystems || 0,
      detectionEvents: logAnalysis.detectionCount || 0
    };
    
    const rootNode = new AttackNode(initialState, true); // Start with attacker's turn
    minimax(rootNode, 3, -Infinity, Infinity, true, attackType);
    
    // Find the most likely attack path
    let currentNode = rootNode;
    const attackPath = [initialState];
    
    while (currentNode.children.length > 0) {
      // Attacker maximizes, defender minimizes
      if (currentNode.isAttackerTurn) {
        // Find child with max value
        currentNode = currentNode.children.reduce((max, node) => 
          (node.value > max.value) ? node : max, currentNode.children[0]);
      } else {
        // Find child with min value
        currentNode = currentNode.children.reduce((min, node) => 
          (node.value < min.value) ? node : min, currentNode.children[0]);
      }
      
      attackPath.push(currentNode.state);
    }
    
    return {
      initialState,
      predictedPath: attackPath,
      threatLevel: calculateThreatLevel(attackPath),
      completionEstimate: estimateAttackCompletion(attackPath, attackType)
    };
  }
  
  /**
   * Predict attacker's next move based on the current state
   */
  function predictNextMove(currentState, attackType) {
    const rootNode = new AttackNode(currentState, true); // Attacker's turn
    minimax(rootNode, 4, -Infinity, Infinity, true, attackType);
    
    // Sort children by value to get most likely next moves
    const sortedMoves = [...rootNode.children].sort((a, b) => b.value - a.value);
    
    // Get the top 3 most likely next moves
    const nextMoves = sortedMoves.slice(0, 3).map(node => {
      // Calculate the difference to identify what changed
      const diff = findStateDifference(currentState, node.state);
      return {
        state: node.state,
        changedElements: diff,
        probability: calculateProbability(node.value, sortedMoves[0].value)
      };
    });
    
    // Recommend defense based on the most likely attack
    const recommendedDefense = determineRecommendedDefense(nextMoves, attackType);
    
    return {
      nextMoves,
      confidence: calculateConfidence(nextMoves),
      recommendedDefense
    };
  }
  
  /**
   * Helper functions
   */
  function findStateDifference(oldState, newState) {
    const differences = {};
    
    // Find new attack steps
    if (newState.completedAttackSteps && oldState.completedAttackSteps) {
      differences.newAttackSteps = newState.completedAttackSteps.filter(
        step => !oldState.completedAttackSteps.includes(step)
      );
    }
    
    // Find new defenses
    if (newState.implementedDefenses && oldState.implementedDefenses) {
      differences.newDefenses = newState.implementedDefenses.filter(
        defense => !oldState.implementedDefenses.includes(defense)
      );
    }
    
    // System compromise changes
    if (newState.systemsCompromised !== oldState.systemsCompromised) {
      differences.compromiseChange = newState.systemsCompromised - oldState.systemsCompromised;
    }
    
    return differences;
  }
  
  function calculateProbability(nodeValue, maxValue) {
    // Simple normalization between 0 and 1
    return maxValue === 0 ? 0 : Math.min(1, Math.max(0, nodeValue / maxValue));
  }
  
  function calculateConfidence(nextMoves) {
    if (!nextMoves || nextMoves.length === 0) return 0;
    
    // Higher confidence if one move is much more likely than others
    const topProbability = nextMoves[0].probability;
    const secondProbability = nextMoves[1]?.probability || 0;
    
    return Math.min(1, (topProbability - secondProbability) * 2 + 0.5);
  }
  
  function calculateThreatLevel(attackPath) {
    // Last state in the path
    const finalState = attackPath[attackPath.length - 1];
    
    // Calculate threat level based on systems compromised vs. defenses
    const compromisedSystems = finalState.systemsCompromised || 0;
    const defenseCount = (finalState.implementedDefenses || []).length;
    
    if (compromisedSystems > 3) return "Critical";
    if (compromisedSystems > 1) return defenseCount > 2 ? "High" : "Critical";
    return defenseCount > 1 ? "Medium" : "High";
  }
  
  function estimateAttackCompletion(attackPath, attackType) {
    const pattern = attackPatterns[attackType] || { steps: [] };
    const totalSteps = pattern.steps.length;
    
    // Count completed steps in the final state
    const finalState = attackPath[attackPath.length - 1];
    const completedSteps = (finalState.completedAttackSteps || []).length;
    
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  }
  
  function determineRecommendedDefense(nextMoves, attackType) {
    const pattern = attackPatterns[attackType] || { defenses: [] };
    
    // Look at most likely next attack steps
    if (nextMoves.length > 0 && nextMoves[0].changedElements.newAttackSteps) {
      const nextStep = nextMoves[0].changedElements.newAttackSteps[0];
      
      // Match defenses to attack steps
      switch (attackType) {
        case "sql_injection":
          if (nextStep === "payload_preparation") return "input_validation";
          if (nextStep === "exploitation") return "prepared_statements";
          if (nextStep === "data_exfiltration") return "database_monitoring";
          break;
        case "phishing":
          if (nextStep === "email_preparation") return "email_filtering";
          if (nextStep === "domain_spoofing") return "user_training";
          if (nextStep === "credential_harvesting") return "mfa_implementation";
          break;
        case "ransomware":
          if (nextStep === "initial_access") return "endpoint_protection";
          if (nextStep === "privilege_escalation") return "patch_management";
          if (nextStep === "lateral_movement") return "network_segmentation";
          if (nextStep === "data_encryption") return "backup_systems";
          break;
      }
    }
    
    // If no specific defense matches, return a random one from the pattern
    const availableDefenses = pattern.defenses;
    return availableDefenses.length > 0 
      ? availableDefenses[Math.floor(Math.random() * availableDefenses.length)]
      : "implement_monitoring";
  }
  
  module.exports = {
    analyzeAttack,
    predictNextMove
  };
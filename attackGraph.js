/**
 * Attack Graph model for CyberSherlock
 * Represents the possible attack paths and states
 */

class AttackGraph {
    constructor(attackType) {
      this.attackType = attackType;
      this.nodes = [];
      this.edges = [];
      this.currentState = null;
      
      this.initializeGraph();
    }
    
    initializeGraph() {
      // Different graph structure based on attack type
      switch(this.attackType) {
        case "sql_injection":
          this.buildSqlInjectionGraph();
          break;
        case "phishing":
          this.buildPhishingGraph();
          break;
        case "ransomware":
          this.buildRansomwareGraph();
          break;
        default:
          this.buildGenericGraph();
      }
      
      // Set initial state
      this.currentState = this.nodes.find(node => node.type === "initial") || this.nodes[0];
    }
    
    buildSqlInjectionGraph() {
      // Nodes represent states in the attack
      this.nodes = [
        { id: 1, label: "Initial State", type: "initial", value: 0 },
        { id: 2, label: "Network Scanning", type: "attack", value: 10 },
        { id: 3, label: "Find Vulnerable Entry", type: "attack", value: 20 },
        { id: 4, label: "Test SQL Injection", type: "attack", value: 30 },
        { id: 5, label: "Deploy WAF", type: "defense", value: -25 },
        { id: 6, label: "Exploit SQL Injection", type: "attack", value: 40 },
        { id: 7, label: "Access Database", type: "attack", value: 50 },
        { id: 8, label: "Implement Input Validation", type: "defense", value: -30 },
        { id: 9, label: "Exfiltrate Data", type: "attack", value: 70 },
        { id: 10, label: "Database Encryption", type: "defense", value: -40 },
        { id: 11, label: "Data Breach Complete", type: "terminal", value: 100 }
      ];
      
      // Edges represent possible transitions
      this.edges = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 3, to: 5 },
        { from: 4, to: 6 },
        { from: 5, to: 6 },
        { from: 6, to: 7 },
        { from: 6, to: 8 },
        { from: 7, to: 9 },
        { from: 8, to: 9 },
        { from: 9, to: 10 },
        { from: 9, to: 11 },
        { from: 10, to: 11 }
      ];
    }
    
    buildPhishingGraph() {
      this.nodes = [
        { id: 1, label: "Initial State", type: "initial", value: 0 },
        { id: 2, label: "Create Fake Website", type: "attack", value: 15 },
        { id: 3, label: "Craft Phishing Email", type: "attack", value: 25 },
        { id: 4, label: "Email Filtering", type: "defense", value: -20 },
        { id: 5, label: "Send Campaign", type: "attack", value: 35 },
        { id: 6, label: "User Training", type: "defense", value: -30 },
        { id: 7, label: "User Clicks Link", type: "attack", value: 50 },
        { id: 8, label: "Credential Entry", type: "attack", value: 70 },
        { id: 9, label: "Multi-Factor Authentication", type: "defense", value: -50 },
        { id: 10, label: "Credential Harvest", type: "attack", value: 80 },
      { id: 11, label: "Account Compromise", type: "terminal", value: 100 }
    ];
    
    this.edges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 5, to: 7 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 8, to: 9 },
      { from: 8, to: 10 },
      { from: 9, to: 10 },
      { from: 10, to: 11 }
    ];
  }
  
  buildRansomwareGraph() {
    this.nodes = [
      { id: 1, label: "Initial State", type: "initial", value: 0 },
      { id: 2, label: "Deliver Malicious Payload", type: "attack", value: 20 },
      { id: 3, label: "Email Security Controls", type: "defense", value: -15 },
      { id: 4, label: "Execute Malware", type: "attack", value: 30 },
      { id: 5, label: "Endpoint Protection", type: "defense", value: -25 },
      { id: 6, label: "Establish Persistence", type: "attack", value: 40 },
      { id: 7, label: "Privilege Escalation", type: "attack", value: 50 },
      { id: 8, label: "Network Segmentation", type: "defense", value: -30 },
      { id: 9, label: "Lateral Movement", type: "attack", value: 60 },
      { id: 10, label: "Data Encryption", type: "attack", value: 80 },
      { id: 11, label: "Backup Systems", type: "defense", value: -60 },
      { id: 12, label: "Ransom Demand", type: "terminal", value: 100 }
    ];
    
    this.edges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 7, to: 9 },
      { from: 8, to: 9 },
      { from: 9, to: 10 },
      { from: 10, to: 11 },
      { from: 10, to: 12 },
      { from: 11, to: 12 }
    ];
  }
  
  buildGenericGraph() {
    this.nodes = [
      { id: 1, label: "Initial State", type: "initial", value: 0 },
      { id: 2, label: "Reconnaissance", type: "attack", value: 10 },
      { id: 3, label: "Vulnerability Scanning", type: "attack", value: 20 },
      { id: 4, label: "Vulnerability Discovery", type: "attack", value: 30 },
      { id: 5, label: "Patch Management", type: "defense", value: -25 },
      { id: 6, label: "Initial Compromise", type: "attack", value: 40 },
      { id: 7, label: "Firewall Implementation", type: "defense", value: -20 },
      { id: 8, label: "Establish Foothold", type: "attack", value: 50 },
      { id: 9, label: "Privilege Escalation", type: "attack", value: 60 },
      { id: 10, label: "Access Controls", type: "defense", value: -30 },
      { id: 11, label: "Data Access", type: "attack", value: 70 },
      { id: 12, label: "Encryption", type: "defense", value: -40 },
      { id: 13, label: "Mission Complete", type: "terminal", value: 100 }
    ];
    
    this.edges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 6, to: 8 },
      { from: 7, to: 8 },
      { from: 8, to: 9 },
      { from: 9, to: 10 },
      { from: 9, to: 11 },
      { from: 10, to: 11 },
      { from: 11, to: 12 },
      { from: 11, to: 13 },
      { from: 12, to: 13 }
    ];
  }
  
  // Get possible next moves from the current state
  getNextMoves() {
    if (!this.currentState) return [];
    
    const outgoingEdges = this.edges.filter(edge => edge.from === this.currentState.id);
    
    return outgoingEdges.map(edge => {
      const targetNode = this.nodes.find(node => node.id === edge.to);
      return {
        nodeId: targetNode.id,
        label: targetNode.label,
        type: targetNode.type,
        value: targetNode.value
      };
    });
  }
  
  // Move to a new state
  moveToState(nodeId) {
    const newState = this.nodes.find(node => node.id === nodeId);
    
    if (!newState) {
      return {
        success: false,
        message: "Invalid state transition"
      };
    }
    
    // Check if this is a valid move
    const validEdge = this.edges.find(edge => 
      edge.from === this.currentState.id && edge.to === nodeId);
    
    if (!validEdge) {
      return {
        success: false,
        message: "Invalid state transition - not connected"
      };
    }
    
    this.currentState = newState;
    
    return {
      success: true,
      newState: newState,
      isTerminal: newState.type === "terminal"
    };
  }
  
  // Get the full graph for visualization
  getFullGraph() {
    return {
      nodes: this.nodes,
      edges: this.edges,
      currentState: this.currentState
    };
  }
  
  // Reset the graph to initial state
  reset() {
    this.currentState = this.nodes.find(node => node.type === "initial") || this.nodes[0];
    return this.currentState;
  }
  
  // Calculate the current state of the game
  calculateGameState() {
    let attackerScore = 0;
    let defenderScore = 0;
    
    // Calculate scores from all nodes that lead to current state
    const path = this.findPathToCurrentState();
    
    path.forEach(node => {
      if (node.type === "attack" || node.type === "terminal") {
        attackerScore += node.value;
      } else if (node.type === "defense") {
        defenderScore += Math.abs(node.value);
      }
    });
    
    // Calculate completion percentage
    const totalNodes = this.nodes.length;
    const visitedNodes = path.length;
    const completionPercentage = Math.round((visitedNodes / totalNodes) * 100);
    
    // Determine who is winning
    let winner = "none";
    if (attackerScore > defenderScore) {
      winner = "attacker";
    } else if (defenderScore > attackerScore) {
      winner = "defender";
    } else {
      winner = "tie";
    }
    
    return {
      attackerScore,
      defenderScore,
      completionPercentage,
      currentState: this.currentState,
      winner,
      isGameOver: this.currentState.type === "terminal"
    };
  }
  
  // Helper to find the path from initial state to current state
  findPathToCurrentState() {
    if (!this.currentState) return [];
    
    // Simple breadth-first search to find path
    const queue = [{
      node: this.nodes.find(node => node.type === "initial") || this.nodes[0],
      path: []
    }];
    
    const visited = new Set();
    
    while (queue.length > 0) {
      const { node, path } = queue.shift();
      
      if (node.id === this.currentState.id) {
        return [...path, node];
      }
      
      if (visited.has(node.id)) continue;
      visited.add(node.id);
      
      // Add all neighboring nodes
      const outgoingEdges = this.edges.filter(edge => edge.from === node.id);
      
      for (const edge of outgoingEdges) {
        const nextNode = this.nodes.find(n => n.id === edge.to);
        queue.push({
          node: nextNode,
          path: [...path, node]
        });
      }
    }
    
    // If no path found, return just the current node
    return [this.currentState];
  }
}

module.exports = AttackGraph;
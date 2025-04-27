/**
 * Log analyzer utility for CyberSherlock
 * Uses propositional logic patterns to analyze and interpret log data
 */

// Pattern matching definitions for different types of logs
const logPatterns = {
    // SQL Injection patterns
    sqlInjection: [
      /SELECT.*FROM.*WHERE.*=.*'.*OR.*'.*'/i,
      /UNION\s+SELECT/i,
      /DROP\s+TABLE/i,
      /INSERT\s+INTO.*VALUES/i,
      /--\s*$/m
    ],
    
    // Authentication failures
    authFailure: [
      /failed login attempt/i,
      /invalid password/i,
      /authentication failure/i,
      /user not found/i
    ],
    
    // Network scanning patterns
    networkScan: [
      /port scan/i,
      /multiple connection attempts/i,
      /excessive ICMP/i,
      /nmap scan report/i
    ],
    
    // Privilege escalation
    privEscalation: [
      /privilege escalation/i,
      /sudo\s+command/i,
      /added to sudoers/i,
      /chmod\s+\+s/i
    ],
    
    // Malware signatures
    malware: [
      /suspicious executable/i,
      /malware detected/i,
      /virus signature/i,
      /ransomware pattern/i
    ],
    
    // Data exfiltration
    dataExfiltration: [
      /large outbound transfer/i,
      /unusual data access/i,
      /excessive database queries/i,
      /abnormal API calls/i
    ]
  };
  
  // Function to extract IP addresses from logs
  function extractIpAddresses(logData) {
    const ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    return [...new Set(logData.match(ipPattern) || [])];
  }
  
  // Function to extract timestamps from logs
  function extractTimestamps(logData) {
    // Match common timestamp formats
    const timestampPatterns = [
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g,  // YYYY-MM-DD HH:MM:SS
      /\d{2}\/\d{2}\/\d{4}:\d{2}:\d{2}:\d{2}/g, // DD/MM/YYYY:HH:MM:SS
      /\w{3} \d{2} \d{2}:\d{2}:\d{2}/g         // Mon DD HH:MM:SS
    ];
    
    let timestamps = [];
    
    timestampPatterns.forEach(pattern => {
      const matches = logData.match(pattern) || [];
      timestamps = timestamps.concat(matches);
    });
    
    return timestamps;
  }
  
  // Function to detect attack patterns in logs
  function detectAttackPatterns(logData) {
    const detectedPatterns = {};
    
    // Check each pattern category
    for (const [category, patterns] of Object.entries(logPatterns)) {
      detectedPatterns[category] = patterns.some(pattern => pattern.test(logData));
    }
    
    return detectedPatterns;
  }
  
  // Main function to analyze log data
  function analyzeLogData(logData) {
    const ipAddresses = extractIpAddresses(logData);
    const timestamps = extractTimestamps(logData);
    const detectedPatterns = detectAttackPatterns(logData);
    
    // Determine if this looks like a coordinated attack
    const patternCount = Object.values(detectedPatterns).filter(Boolean).length;
    const isCoordinatedAttack = patternCount >= 2;
    
    // Map detected patterns to attack steps
    const detectedSteps = [];
    
    if (detectedPatterns.networkScan) detectedSteps.push("reconnaissance");
    if (detectedPatterns.sqlInjection) {
      detectedSteps.push("vulnerability_discovery");
      detectedSteps.push("exploitation");
    }
    if (detectedPatterns.authFailure) detectedSteps.push("exploitation");
    if (detectedPatterns.privEscalation) detectedSteps.push("privilege_escalation");
    if (detectedPatterns.dataExfiltration) detectedSteps.push("data_exfiltration");
    if (detectedPatterns.malware) {
      detectedSteps.push("initial_access");
      if (logData.toLowerCase().includes("encrypt")) {
        detectedSteps.push("data_encryption");
      }
    }
    
    // Estimate success level of the attack
    let attackSuccess = "Unknown";
    let compromisedSystems = 0;
    
    if (detectedSteps.includes("data_exfiltration")) {
      attackSuccess = "High";
      compromisedSystems = Math.min(3, Math.ceil(ipAddresses.length / 2));
    } else if (detectedSteps.includes("exploitation") || detectedSteps.includes("privilege_escalation")) {
      attackSuccess = "Medium";
      compromisedSystems = 1;
    } else if (detectedSteps.includes("reconnaissance") || detectedSteps.includes("vulnerability_discovery")) {
      attackSuccess = "Low";
      compromisedSystems = 0;
    }
    
    // Determine likely attack type
    let attackType = "unknown";
    
    if (detectedPatterns.sqlInjection) {
      attackType = "sql_injection";
    } else if (detectedPatterns.malware) {
      if (logData.toLowerCase().includes("ransom") || logData.toLowerCase().includes("encrypt")) {
        attackType = "ransomware";
      } else {
        attackType = "malware";
      }
    } else if (detectedPatterns.authFailure && !detectedPatterns.sqlInjection) {
      attackType = "phishing";
    }
    
    // Infer active defenses from the logs
    const activeDefenses = [];
    
    if (logData.toLowerCase().includes("firewall")) activeDefenses.push("firewall_rules");
    if (logData.toLowerCase().includes("ids") || logData.toLowerCase().includes("intrusion detection")) 
      activeDefenses.push("intrusion_detection");
    if (logData.toLowerCase().includes("waf") || logData.toLowerCase().includes("web application firewall")) 
      activeDefenses.push("waf_implementation");
    if (logData.toLowerCase().includes("antivirus") || logData.toLowerCase().includes("endpoint")) 
      activeDefenses.push("endpoint_protection");
  
    // Count detection events
    const detectionCount = (logData.match(/detected|blocked|prevented|alert/gi) || []).length;
    
    return {
      ipAddresses,
      timestamps,
      detectedPatterns,
      detectedSteps: [...new Set(detectedSteps)], // Remove duplicates
      attackSuccess,
      isCoordinatedAttack,
      compromisedSystems,
      attackType,
      activeDefenses,
      detectionCount,
      timeRange: timestamps.length > 0 ? {
        first: timestamps[0],
        last: timestamps[timestamps.length - 1]
      } : null
    };
  }
  
  module.exports = {
    analyzeLogData
  };
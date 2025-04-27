// CyberSherlock - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const scenarioSelect = document.getElementById('attack-scenario');
    const loadScenarioBtn = document.getElementById('load-scenario');
    const scenarioContent = document.getElementById('scenario-content');
    const logInput = document.getElementById('log-input');
    const analyzeLogsBtn = document.getElementById('analyze-logs');
    const resultsContent = document.getElementById('results-content');
    const recommendationContent = document.getElementById('recommendation-content');
    const predictionContent = document.getElementById('prediction-content');
    const attackGraph = document.getElementById('attack-graph');
    const startSimulationBtn = document.getElementById('start-simulation');
    const nextStepBtn = document.getElementById('next-step');
    const resetSimulationBtn = document.getElementById('reset-simulation');
    const simulationLog = document.getElementById('simulation-log');
    const resultModal = document.getElementById('result-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    
    // Cytoscape graph instance
    let cyGraph = null;
    
    // Charts
    let attackChart = null;
    
    // Current scenario and simulation state
    let currentScenario = null;
    let simulationState = {
      active: false,
      currentStep: 0,
      steps: [],
      attackerScore: 0,
      defenderScore: 0
    };
    
    // Sample log data for demo purposes
    const sampleLogs = {
      sql_injection: `2023-06-15 08:42:13 - Web Server 192.168.1.100 - Received GET request from 203.0.113.42
  2023-06-15 08:43:27 - Web Server 192.168.1.100 - Received POST request from 203.0.113.42
  2023-06-15 08:43:28 - Web Application - Login attempt for user "admin" failed
  2023-06-15 08:44:15 - Web Application - Login attempt with input: admin' OR '1'='1
  2023-06-15 08:44:15 - Database - Error in SQL query: syntax error near 'OR '1'='1'
  2023-06-15 08:44:45 - Web Application - Multiple login attempts detected from IP 203.0.113.42
  2023-06-15 08:45:12 - Web Application - Login attempt with input: admin'; DROP TABLE users; --
  2023-06-15 08:45:12 - Database - Error in SQL query: multiple statements not allowed
  2023-06-15 08:46:30 - Web Application - Successful login for user "admin" from IP 203.0.113.42
  2023-06-15 08:47:05 - Database - Large data query executed: SELECT * FROM customer_data
  2023-06-15 08:47:23 - Firewall - Large outbound data transfer detected to IP 203.0.113.42
  2023-06-15 08:48:10 - IDS - Alert: Possible data exfiltration detected`,
      
      phishing: `2023-07-10 09:15:22 - Email Gateway - Received email from external domain "paypa1-secure.com"
  2023-07-10 09:15:23 - Email Gateway - Email from "service@paypa1-secure.com" delivered to 15 recipients
  2023-07-10 09:20:45 - Web Proxy - User jsmith accessing URL: https://paypa1-secure.com/login
  2023-07-10 09:20:50 - Web Application Firewall - Domain mismatch warning: paypa1-secure.com mimicking paypal.com
  2023-07-10 09:21:12 - Web Proxy - User jsmith submitted form data to https://paypa1-secure.com/login
  2023-07-10 09:30:33 - Web Proxy - User mwilson accessing URL: https://paypa1-secure.com/login
  2023-07-10 09:30:58 - Web Proxy - User mwilson submitted form data to https://paypa1-secure.com/login
  2023-07-10 10:05:23 - Auth Service - Failed login attempt for user jsmith (invalid password)
  2023-07-10 10:06:15 - Auth Service - Failed login attempt for user jsmith (invalid password)
  2023-07-10 10:15:42 - Auth Service - Successful login for user jsmith
  2023-07-10 10:15:55 - Email Gateway - Email filtering activated - Blocked 12 emails from "service@paypa1-secure.com"
  2023-07-10 10:30:10 - Security Alert - Unusual account activity detected for user jsmith`,
      
      ransomware: `2023-08-05 23:15:33 - Email Gateway - Attachment "invoice_details.xls" received by user aharris
  2023-08-05 23:20:45 - Endpoint Protection - User aharris executed file "invoice_details.xls"
  2023-08-05 23:20:50 - Endpoint Protection - Suspicious macro execution detected in Excel process
  2023-08-05 23:21:10 - Endpoint Protection - PowerShell execution with encoded command parameter
  2023-08-05 23:22:05 - Endpoint Protection - New process created: regsvr32.exe with unusual command line
  2023-08-05 23:23:15 - System Log - Service "RemoteRegistry" started on workstation WS-HARRIS
  2023-08-05 23:25:33 - Auth Service - Local Administrator account login on WS-HARRIS
  2023-08-05 23:28:12 - Network Monitor - SMB traffic from WS-HARRIS to multiple file servers
  2023-08-05 23:35:26 - File Server - High volume of file access from WS-HARRIS
  2023-08-05 23:40:15 - File Server - Multiple file rename operations (.doc to .doc.encrypted)
  2023-08-05 23:45:22 - Endpoint Alert - Multiple file encryption operations detected
  2023-08-05 23:50:30 - System Log - New file created on desktop: RANSOM_NOTE.txt
  2023-08-05 23:55:10 - Security Alert - Potential ransomware activity detected on WS-HARRIS`,

      ddos: `2023-09-12 14:30:00 - Network Monitor - Unusual spike in incoming traffic detected
  2023-09-12 14:31:15 - Firewall - Multiple connection attempts from IP 192.168.1.100
  2023-09-12 14:32:30 - Load Balancer - High CPU utilization on server cluster
  2023-09-12 14:33:45 - Web Server - Connection queue full, dropping requests
  2023-09-12 14:35:00 - Network Monitor - Traffic pattern matches known DDoS signature
  2023-09-12 14:36:15 - DDoS Protection - Mitigation rules activated
  2023-09-12 14:37:30 - Firewall - Rate limiting enabled for suspicious IP ranges
  2023-09-12 14:38:45 - Load Balancer - Auto-scaling triggered to handle increased load
  2023-09-12 14:40:00 - Network Monitor - Traffic returning to normal levels
  2023-09-12 14:41:15 - DDoS Protection - Attack successfully mitigated`,

      insider_threat: `2023-10-20 09:15:00 - Access Control - User jdoe accessed sensitive HR documents
  2023-10-20 09:30:00 - File Server - Large data transfer initiated by jdoe
  2023-10-20 09:45:00 - Network Monitor - Unusual outbound traffic to personal cloud storage
  2023-10-20 10:00:00 - DLP System - Sensitive data detected in outbound transfer
  2023-10-20 10:15:00 - Access Control - jdoe accessing systems outside normal working hours
  2023-10-20 10:30:00 - File Server - Multiple file downloads by jdoe
  2023-10-20 10:45:00 - Security Alert - Unusual access pattern detected for user jdoe
  2023-10-20 11:00:00 - DLP System - Data exfiltration attempt blocked
  2023-10-20 11:15:00 - Access Control - jdoe's account temporarily suspended
  2023-10-20 11:30:00 - Security Team - Investigation initiated for potential insider threat`,

      supply_chain: `2023-11-05 08:00:00 - Software Update - New vendor update received for accounting software
  2023-11-05 08:15:00 - Security Scan - Suspicious code patterns detected in update
  2023-11-05 08:30:00 - Network Monitor - Unusual outbound connections from accounting system
  2023-11-05 08:45:00 - Endpoint Protection - Malicious process detected in accounting software
  2023-11-05 09:00:00 - Security Alert - Compromised vendor software detected
  2023-11-05 09:15:00 - Network Monitor - Lateral movement attempts from accounting system
  2023-11-05 09:30:00 - Access Control - Unauthorized access attempts to financial systems
  2023-11-05 09:45:00 - Security Team - Vendor software update rollback initiated
  2023-11-05 10:00:00 - Network Monitor - Suspicious activity contained
  2023-11-05 10:15:00 - Security Alert - Supply chain attack mitigated`
    };
    
    // Initialize
    function init() {
      initializeEventListeners();
      populateScenarios();
      initializeGraph();
      initializeChart();
    }
    
    // Set up event listeners
    function initializeEventListeners() {
      loadScenarioBtn.addEventListener('click', loadScenario);
      analyzeLogsBtn.addEventListener('click', analyzeLogs);
      startSimulationBtn.addEventListener('click', startSimulation);
      nextStepBtn.addEventListener('click', simulateNextStep);
      resetSimulationBtn.addEventListener('click', resetSimulation);
      closeModal.addEventListener('click', () => resultModal.style.display = 'none');
      
      // Close modal when clicking outside
      window.addEventListener('click', (e) => {
        if (e.target === resultModal) {
          resultModal.style.display = 'none';
        }
      });
    }
    
    // Populate scenarios dropdown
    function populateScenarios() {
        const scenarios = [
            { id: 'sql_injection', name: 'SQL Injection Attack' },
            { id: 'phishing', name: 'Phishing Campaign' },
            { id: 'ransomware', name: 'Ransomware Attack' },
            { id: 'ddos', name: 'DDoS Attack' },
            { id: 'insider_threat', name: 'Insider Threat' },
            { id: 'supply_chain', name: 'Supply Chain Attack' }
        ];
        
        scenarios.forEach(scenario => {
            const option = document.createElement('option');
            option.value = scenario.id;
            option.textContent = scenario.name;
            scenarioSelect.appendChild(option);
        });
    }
    
    // Initialize Cytoscape graph with enhanced styling
    function initializeGraph() {
      cyGraph = cytoscape({
        container: attackGraph,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'text-wrap': 'wrap',
                        'text-max-width': '150px',
                        'padding': '20px',
                        'shape': 'roundrectangle',
                        'width': 'label',
                        'height': 'label',
                        'min-width': '100px',
                        'min-height': '50px'
                    }
                },
                {
                    selector: 'node[type="attacker"]',
                    style: {
                        'background-color': '#ff6b6b',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'node[type="server"]',
                    style: {
                        'background-color': '#4ecdc4',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'node[type="application"]',
                    style: {
                        'background-color': '#45b7d1',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'node[type="database"]',
                    style: {
                        'background-color': '#96ceb4',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'node[type="security"]',
                    style: {
                        'background-color': '#ffd166',
                        'color': '#000'
                    }
                },
                {
                    selector: 'node[type="user"]',
                    style: {
                        'background-color': '#a78bfa',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'node[type="endpoint"]',
                    style: {
                        'background-color': '#f9a8d4',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'text-rotation': 'autorotate',
                        'text-margin-y': -10,
                        'font-size': '12px'
                    }
                }
            ],
            layout: {
                name: 'cose',
                padding: 50,
                animate: true,
                animationDuration: 1000,
                randomize: false,
                nodeDimensionsIncludeLabels: true
            }
        });
    }
    
    // Initialize Chart.js
    function initializeChart() {
        const ctx = document.getElementById('attack-chart').getContext('2d');
        attackChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Attacker Score',
                        data: [],
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1
                    },
                    {
                        label: 'Defender Score',
                        data: [],
                        borderColor: 'rgb(54, 162, 235)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Load selected scenario
    function loadScenario() {
        const selectedScenario = scenarioSelect.value;
        if (!selectedScenario) return;
        
        currentScenario = selectedScenario;
        logInput.value = sampleLogs[selectedScenario];
        
        // Update scenario details
        const scenarioDetails = getScenarioDetails(selectedScenario);
        scenarioContent.innerHTML = `
            <h3>${scenarioDetails.title}</h3>
            <p><strong>Description:</strong> ${scenarioDetails.description}</p>
            <p><strong>Attack Vector:</strong> ${scenarioDetails.attackVector}</p>
            <p><strong>Potential Impact:</strong> ${scenarioDetails.impact}</p>
            <p><strong>Common Indicators:</strong></p>
            <ul>
                ${scenarioDetails.indicators.map(indicator => `<li>${indicator}</li>`).join('')}
            </ul>
        `;
        
        // Update graph with scenario-specific nodes and edges
        updateGraph(selectedScenario);
    }
    
    // Get detailed information for each scenario
    function getScenarioDetails(scenario) {
        const scenarios = {
            sql_injection: {
                title: 'SQL Injection Attack',
                description: 'An attacker attempts to manipulate a web application\'s database queries by injecting malicious SQL code through user inputs.',
                attackVector: 'Web Application Input Fields',
                impact: 'Data theft, unauthorized access, database manipulation',
                indicators: [
                    'Unusual SQL query patterns',
                    'Multiple failed login attempts',
                    'Suspicious database queries',
                    'Large data transfers'
                ]
            },
            phishing: {
                title: 'Phishing Campaign',
                description: 'A social engineering attack where attackers impersonate legitimate entities to trick users into revealing sensitive information.',
                attackVector: 'Email, Fake Websites',
                impact: 'Credential theft, financial loss, identity theft',
                indicators: [
                    'Suspicious email domains',
                    'Multiple users accessing phishing URLs',
                    'Unusual login attempts',
                    'Failed authentication attempts'
                ]
            },
            ransomware: {
                title: 'Ransomware Attack',
                description: 'Malicious software that encrypts files and demands payment for their release, often spread through malicious attachments or links.',
                attackVector: 'Email Attachments, Malicious Links',
                impact: 'Data encryption, system disruption, financial loss',
                indicators: [
                    'Suspicious file encryption activity',
                    'Unusual network traffic patterns',
                    'Multiple file modifications',
                    'Presence of ransom notes'
                ]
            },
            ddos: {
                title: 'DDoS Attack',
                description: 'A distributed denial-of-service attack that overwhelms a target system with traffic from multiple sources.',
                attackVector: 'Network Traffic',
                impact: 'Service disruption, system downtime, financial loss',
                indicators: [
                    'Unusual traffic spikes',
                    'Multiple connection attempts',
                    'High resource utilization',
                    'Service degradation'
                ]
            },
            insider_threat: {
                title: 'Insider Threat',
                description: 'A security risk that originates from within the organization, typically involving employees or contractors.',
                attackVector: 'Internal Systems',
                impact: 'Data theft, intellectual property loss, system compromise',
                indicators: [
                    'Unusual access patterns',
                    'Large data transfers',
                    'Access outside normal hours',
                    'Attempts to bypass security controls'
                ]
            },
            supply_chain: {
                title: 'Supply Chain Attack',
                description: 'An attack that targets an organization through vulnerabilities in its supply chain or third-party vendors.',
                attackVector: 'Vendor Software, Third-party Services',
                impact: 'System compromise, data breach, service disruption',
                indicators: [
                    'Suspicious vendor updates',
                    'Unusual system behavior',
                    'Compromised third-party services',
                    'Unauthorized access attempts'
                ]
            }
        };
        
        return scenarios[scenario] || {
            title: 'Unknown Scenario',
            description: 'No details available',
            attackVector: 'Unknown',
            impact: 'Unknown',
            indicators: []
        };
    }
    
    // Update graph based on scenario
    function updateGraph(scenario) {
        const graphData = getScenarioGraphData(scenario);
        cyGraph.elements().remove();
        cyGraph.add(graphData);
        cyGraph.layout({ name: 'cose' }).run();
    }
    
    // Get graph data for specific scenario
    function getScenarioGraphData(scenario) {
        const graphData = {
            nodes: [],
            edges: []
        };
        
        switch(scenario) {
            case 'sql_injection':
                graphData.nodes = [
                    { data: { id: 'attacker', label: 'Attacker', type: 'attacker' } },
                    { data: { id: 'web_server', label: 'Web Server', type: 'server' } },
                    { data: { id: 'web_app', label: 'Web App', type: 'application' } },
                    { data: { id: 'database', label: 'Database', type: 'database' } },
                    { data: { id: 'firewall', label: 'Firewall', type: 'security' } },
                    { data: { id: 'ids', label: 'IDS', type: 'security' } }
                ];
                graphData.edges = [
                    { data: { source: 'attacker', target: 'web_server', label: 'HTTP Request' } },
                    { data: { source: 'web_server', target: 'web_app', label: 'Process' } },
                    { data: { source: 'web_app', target: 'database', label: 'SQL Query' } },
                    { data: { source: 'database', target: 'firewall', label: 'Data Flow' } },
                    { data: { source: 'web_server', target: 'ids', label: 'Monitor' } }
                ];
                break;
            case 'phishing':
                graphData.nodes = [
                    { data: { id: 'attacker', label: 'Attacker', type: 'attacker' } },
                    { data: { id: 'email_server', label: 'Email Server', type: 'server' } },
                    { data: { id: 'user1', label: 'User 1', type: 'user' } },
                    { data: { id: 'user2', label: 'User 2', type: 'user' } },
                    { data: { id: 'user3', label: 'User 3', type: 'user' } },
                    { data: { id: 'fake_website', label: 'Fake Website', type: 'server' } },
                    { data: { id: 'auth_server', label: 'Auth Server', type: 'server' } },
                    { data: { id: 'email_filter', label: 'Email Filter', type: 'security' } },
                    { data: { id: 'web_filter', label: 'Web Filter', type: 'security' } }
                ];
                graphData.edges = [
                    { data: { source: 'attacker', target: 'email_server', label: 'Send Email' } },
                    { data: { source: 'email_server', target: 'email_filter', label: 'Filter' } },
                    { data: { source: 'email_filter', target: 'user1', label: 'Deliver' } },
                    { data: { source: 'email_filter', target: 'user2', label: 'Deliver' } },
                    { data: { source: 'email_filter', target: 'user3', label: 'Deliver' } },
                    { data: { source: 'user1', target: 'fake_website', label: 'Click Link' } },
                    { data: { source: 'user2', target: 'fake_website', label: 'Click Link' } },
                    { data: { source: 'user3', target: 'fake_website', label: 'Click Link' } },
                    { data: { source: 'fake_website', target: 'web_filter', label: 'Check' } },
                    { data: { source: 'fake_website', target: 'auth_server', label: 'Steal Credentials' } }
                ];
                break;
            case 'ransomware':
                graphData.nodes = [
                    { data: { id: 'attacker', label: 'Attacker', type: 'attacker' } },
                    { data: { id: 'email_server', label: 'Email Server', type: 'server' } },
                    { data: { id: 'initial_victim', label: 'Initial Victim', type: 'user' } },
                    { data: { id: 'compromised_endpoint', label: 'Compromised Endpoint', type: 'endpoint' } },
                    { data: { id: 'file_server1', label: 'File Server 1', type: 'server' } },
                    { data: { id: 'file_server2', label: 'File Server 2', type: 'server' } },
                    { data: { id: 'backup_server', label: 'Backup Server', type: 'server' } },
                    { data: { id: 'c2_server', label: 'C2 Server', type: 'server' } },
                    { data: { id: 'av', label: 'AV', type: 'security' } },
                    { data: { id: 'firewall', label: 'Firewall', type: 'security' } }
                ];
                graphData.edges = [
                    { data: { source: 'attacker', target: 'email_server', label: 'Send Email' } },
                    { data: { source: 'email_server', target: 'initial_victim', label: 'Deliver' } },
                    { data: { source: 'initial_victim', target: 'compromised_endpoint', label: 'Execute' } },
                    { data: { source: 'compromised_endpoint', target: 'av', label: 'Scan' } },
                    { data: { source: 'compromised_endpoint', target: 'c2_server', label: 'Connect' } },
                    { data: { source: 'compromised_endpoint', target: 'file_server1', label: 'Encrypt' } },
                    { data: { source: 'compromised_endpoint', target: 'file_server2', label: 'Encrypt' } },
                    { data: { source: 'file_server1', target: 'backup_server', label: 'Backup' } },
                    { data: { source: 'file_server2', target: 'backup_server', label: 'Backup' } },
                    { data: { source: 'compromised_endpoint', target: 'firewall', label: 'Bypass' } }
                ];
                break;
            case 'ddos':
                graphData.nodes = [
                    { data: { id: 'attacker', label: 'Attacker', type: 'attacker' } },
                    { data: { id: 'botnet', label: 'Botnet', type: 'server' } },
                    { data: { id: 'target_server', label: 'Target Server', type: 'server' } },
                    { data: { id: 'load_balancer', label: 'Load Balancer', type: 'server' } },
                    { data: { id: 'firewall', label: 'Firewall', type: 'security' } },
                    { data: { id: 'ddos_protection', label: 'DDoS Protection', type: 'security' } }
                ];
                graphData.edges = [
                    { data: { source: 'attacker', target: 'botnet', label: 'Command' } },
                    { data: { source: 'botnet', target: 'target_server', label: 'Flood' } },
                    { data: { source: 'target_server', target: 'load_balancer', label: 'Distribute' } },
                    { data: { source: 'target_server', target: 'firewall', label: 'Filter' } },
                    { data: { source: 'target_server', target: 'ddos_protection', label: 'Mitigate' } }
                ];
                break;
            case 'insider_threat':
                graphData.nodes = [
                    { data: { id: 'insider', label: 'Insider', type: 'attacker' } },
                    { data: { id: 'workstation', label: 'Workstation', type: 'endpoint' } },
                    { data: { id: 'file_server', label: 'File Server', type: 'server' } },
                    { data: { id: 'cloud_storage', label: 'Cloud Storage', type: 'server' } },
                    { data: { id: 'dlp', label: 'DLP System', type: 'security' } },
                    { data: { id: 'access_control', label: 'Access Control', type: 'security' } }
                ];
                graphData.edges = [
                    { data: { source: 'insider', target: 'workstation', label: 'Access' } },
                    { data: { source: 'workstation', target: 'file_server', label: 'Download' } },
                    { data: { source: 'workstation', target: 'cloud_storage', label: 'Upload' } },
                    { data: { source: 'workstation', target: 'dlp', label: 'Monitor' } },
                    { data: { source: 'workstation', target: 'access_control', label: 'Control' } }
                ];
                break;
            case 'supply_chain':
                graphData.nodes = [
                    { data: { id: 'attacker', label: 'Attacker', type: 'attacker' } },
                    { data: { id: 'vendor', label: 'Compromised Vendor', type: 'server' } },
                    { data: { id: 'update_server', label: 'Update Server', type: 'server' } },
                    { data: { id: 'target_system', label: 'Target System', type: 'server' } },
                    { data: { id: 'security_scan', label: 'Security Scan', type: 'security' } },
                    { data: { id: 'network_monitor', label: 'Network Monitor', type: 'security' } }
                ];
                graphData.edges = [
                    { data: { source: 'attacker', target: 'vendor', label: 'Compromise' } },
                    { data: { source: 'vendor', target: 'update_server', label: 'Push Update' } },
                    { data: { source: 'update_server', target: 'target_system', label: 'Install' } },
                    { data: { source: 'target_system', target: 'security_scan', label: 'Scan' } },
                    { data: { source: 'target_system', target: 'network_monitor', label: 'Monitor' } }
                ];
                break;
        }
        
        return graphData;
    }
    
    // Analyze logs
    function analyzeLogs() {
        const logs = logInput.value;
        if (!logs) return;
        
        // Simulate log analysis
        const analysis = performLogAnalysis(logs);
        
        // Update results
        resultsContent.innerHTML = formatAnalysisResults(analysis);
        recommendationContent.innerHTML = generateRecommendations(analysis);
        predictionContent.innerHTML = generatePredictions(analysis);
        
        // Show results modal
        resultModal.style.display = 'block';
    }
    
    // Perform log analysis
    function performLogAnalysis(logs) {
        const lines = logs.split('\n');
        const analysis = {
            totalEvents: lines.length,
            suspiciousEvents: 0,
            criticalEvents: 0,
            attackPatterns: [],
            timeline: []
        };
        
        lines.forEach(line => {
            if (line.includes('Alert') || line.includes('Warning')) {
                analysis.suspiciousEvents++;
            }
            if (line.includes('Error') || line.includes('Critical')) {
                analysis.criticalEvents++;
            }
            
            // Extract timestamp and event
            const timestamp = line.substring(0, 19);
            const event = line.substring(20);
            analysis.timeline.push({ timestamp, event });
        });
        
        return analysis;
    }
    
    // Format analysis results
    function formatAnalysisResults(analysis) {
        return `
            <h3>Analysis Summary</h3>
            <p>Total Events: ${analysis.totalEvents}</p>
            <p>Suspicious Events: ${analysis.suspiciousEvents}</p>
            <p>Critical Events: ${analysis.criticalEvents}</p>
            <h4>Timeline</h4>
            <ul>
                ${analysis.timeline.map(event => `
                    <li>${event.timestamp} - ${event.event}</li>
                `).join('')}
            </ul>
        `;
    }
    
    // Generate recommendations
    function generateRecommendations(analysis) {
        const recommendations = [];
        
        // General recommendations based on event counts
        if (analysis.suspiciousEvents > 5) {
            recommendations.push('Implement additional monitoring for suspicious activities');
            recommendations.push('Review and update security monitoring thresholds');
        }
        if (analysis.criticalEvents > 0) {
            recommendations.push('Review and update security policies');
            recommendations.push('Conduct security awareness training');
            recommendations.push('Implement additional security controls');
        }

        // Scenario-specific recommendations
        if (currentScenario === 'sql_injection') {
            recommendations.push('Implement input validation and parameterized queries');
            recommendations.push('Deploy Web Application Firewall (WAF)');
            recommendations.push('Regularly update and patch database systems');
            recommendations.push('Implement rate limiting for login attempts');
        } else if (currentScenario === 'phishing') {
            recommendations.push('Enhance email filtering and spam detection');
            recommendations.push('Implement multi-factor authentication');
            recommendations.push('Conduct phishing awareness training');
            recommendations.push('Deploy URL filtering and web security solutions');
        } else if (currentScenario === 'ransomware') {
            recommendations.push('Implement endpoint protection solutions');
            recommendations.push('Regularly backup critical data');
            recommendations.push('Restrict execution of macros and scripts');
            recommendations.push('Implement network segmentation');
        } else if (currentScenario === 'ddos') {
            recommendations.push('Implement DDoS protection solutions');
            recommendations.push('Deploy network segmentation');
            recommendations.push('Implement traffic monitoring and analysis');
            recommendations.push('Conduct regular security audits');
        } else if (currentScenario === 'insider_threat') {
            recommendations.push('Implement access control policies');
            recommendations.push('Conduct regular security audits');
            recommendations.push('Implement data access monitoring');
            recommendations.push('Conduct employee background checks');
        } else if (currentScenario === 'supply_chain') {
            recommendations.push('Implement vendor security assessments');
            recommendations.push('Implement supply chain monitoring');
            recommendations.push('Conduct regular audits');
            recommendations.push('Implement risk management strategies');
        }
        
        return `
            <h3>Security Recommendations</h3>
            <div class="recommendation-list">
                ${recommendations.map(rec => `
                    <div class="recommendation-item">
                        <span class="recommendation-icon">🔒</span>
                        <span class="recommendation-text">${rec}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Generate predictions
    function generatePredictions(analysis) {
        const predictions = [];
        
        // General predictions based on event counts
        if (analysis.suspiciousEvents > 10) {
            predictions.push('High probability of ongoing attack');
            predictions.push('Increased risk of system compromise');
        }
        if (analysis.criticalEvents > 2) {
            predictions.push('System compromise likely');
            predictions.push('Potential data breach imminent');
        }

        // Scenario-specific predictions
        if (currentScenario === 'sql_injection') {
            predictions.push('Attacker may attempt to escalate privileges');
            predictions.push('Potential data exfiltration in progress');
            predictions.push('Database manipulation attempts likely');
            predictions.push('Possible lateral movement within the network');
        } else if (currentScenario === 'phishing') {
            predictions.push('More phishing emails likely to be sent');
            predictions.push('Additional credential harvesting attempts expected');
            predictions.push('Potential account takeover attempts');
            predictions.push('Possible financial fraud attempts');
        } else if (currentScenario === 'ransomware') {
            predictions.push('Additional systems may be targeted');
            predictions.push('Data encryption likely to spread');
            predictions.push('Ransom demand imminent');
            predictions.push('Potential system downtime expected');
        } else if (currentScenario === 'ddos') {
            predictions.push('Increased risk of service disruption');
            predictions.push('Potential system downtime expected');
        } else if (currentScenario === 'insider_threat') {
            predictions.push('Increased risk of data theft');
            predictions.push('Potential intellectual property loss');
        } else if (currentScenario === 'supply_chain') {
            predictions.push('Increased risk of system compromise');
            predictions.push('Potential data breach imminent');
        }
        
        return `
            <h3>Attack Predictions</h3>
            <div class="prediction-list">
                ${predictions.map(pred => `
                    <div class="prediction-item">
                        <span class="prediction-icon">⚠️</span>
                        <span class="prediction-text">${pred}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Start simulation
    function startSimulation() {
        if (!currentScenario) return;
        
        simulationState = {
            active: true,
            currentStep: 0,
            steps: getSimulationSteps(currentScenario),
            attackerScore: 0,
            defenderScore: 0
        };
        
        startSimulationBtn.disabled = true;
        nextStepBtn.disabled = false;
        resetSimulationBtn.disabled = false;
        
        simulateNextStep();
    }
    
    // Get simulation steps for scenario
    function getSimulationSteps(scenario) {
        const steps = [];
        
        switch(scenario) {
            case 'sql_injection':
                steps.push(
                    'Attacker scanning for vulnerable endpoints',
                    'SQL injection attempt detected',
                    'Database access attempted',
                    'Data exfiltration in progress',
                    'Attack mitigated by security controls'
                );
                break;
            case 'phishing':
                steps.push(
                    'Phishing emails sent to multiple targets',
                    'Email filtering system detects suspicious patterns',
                    'First victim clicks malicious link',
                    'Second victim clicks malicious link',
                    'Third victim clicks malicious link',
                    'Credential harvesting begins',
                    'Security team detects unusual login patterns',
                    'Attack contained through multi-factor authentication'
                );
                break;
            case 'ransomware':
                steps.push(
                    'Malicious email delivered to initial victim',
                    'Malware executed on endpoint',
                    'Command and control connection established',
                    'Lateral movement to first file server',
                    'Lateral movement to second file server',
                    'Encryption process begins',
                    'Backup systems activated',
                    'Security team detects encryption patterns',
                    'Attack contained through network segmentation'
                );
                break;
            case 'ddos':
                steps.push(
                    'Botnet command and control established',
                    'Initial traffic spike detected',
                    'DDoS protection systems activated',
                    'Traffic filtering rules applied',
                    'Load balancer auto-scaling triggered',
                    'Attack traffic patterns analyzed',
                    'Mitigation strategies implemented',
                    'Attack successfully contained'
                );
                break;
            case 'insider_threat':
                steps.push(
                    'Insider accesses sensitive systems',
                    'Unusual data access patterns detected',
                    'Large data transfer initiated',
                    'DLP system alerts triggered',
                    'Access control systems activated',
                    'Security team investigation begins',
                    'Insider account suspended',
                    'Threat contained and mitigated'
                );
                break;
            case 'supply_chain':
                steps.push(
                    'Vendor system compromised',
                    'Malicious update pushed to customers',
                    'Security scan detects suspicious code',
                    'Network monitoring alerts triggered',
                    'Compromised systems identified',
                    'Update rollback initiated',
                    'Security patches applied',
                    'Attack contained and mitigated'
                );
                break;
        }
        
        return steps;
    }
    
    // Simulate next step
    function simulateNextStep() {
        if (!simulationState.active || simulationState.currentStep >= simulationState.steps.length) {
            endSimulation();
            return;
        }
        
        const step = simulationState.steps[simulationState.currentStep];
        simulationLog.innerHTML += `<p>Step ${simulationState.currentStep + 1}: ${step}</p>`;
        
        // Update scores
        if (step.includes('detected') || step.includes('blocked') || step.includes('mitigated')) {
            simulationState.defenderScore += 10;
        } else {
            simulationState.attackerScore += 10;
        }
        
        // Update chart
        updateChart();
        
        simulationState.currentStep++;
        
        if (simulationState.currentStep >= simulationState.steps.length) {
            endSimulation();
        }
    }
    
    // Update chart with current scores
    function updateChart() {
        const labels = Array.from({ length: simulationState.currentStep + 1 }, (_, i) => `Step ${i + 1}`);
        attackChart.data.labels = labels;

        // Calculate scores based on attack type
        let attackerScore = 0;
        let defenderScore = 0;

        if (currentScenario === 'phishing') {
            // Phishing: Gradual increase in attacker score as more victims are compromised
            attackerScore = simulationState.attackerScore + (simulationState.currentStep * 5);
            // Defender score increases when security measures are activated
            defenderScore = simulationState.defenderScore + (simulationState.currentStep * 3);
        } else if (currentScenario === 'ransomware') {
            // Ransomware: Sharp increase in attacker score during encryption phase
            if (simulationState.currentStep >= 5) {
                attackerScore = simulationState.attackerScore + (simulationState.currentStep * 8);
            } else {
                attackerScore = simulationState.attackerScore + (simulationState.currentStep * 3);
            }
            // Defender score increases when backup systems are activated
            defenderScore = simulationState.defenderScore + (simulationState.currentStep * 4);
        } else if (currentScenario === 'ddos') {
            // DDoS: Rapid increase in attacker score during attack phase
            if (simulationState.currentStep >= 3) {
                attackerScore = simulationState.attackerScore + (simulationState.currentStep * 10);
            } else {
                attackerScore = simulationState.attackerScore + (simulationState.currentStep * 2);
            }
            // Defender score increases as mitigation measures take effect
            defenderScore = simulationState.defenderScore + (simulationState.currentStep * 6);
        } else if (currentScenario === 'insider_threat') {
            // Insider Threat: Steady increase in attacker score
            attackerScore = simulationState.attackerScore + (simulationState.currentStep * 7);
            // Defender score increases when DLP systems detect the threat
            defenderScore = simulationState.defenderScore + (simulationState.currentStep * 5);
        } else if (currentScenario === 'supply_chain') {
            // Supply Chain: Sharp increase when malicious update is installed
            if (simulationState.currentStep >= 4) {
                attackerScore = simulationState.attackerScore + (simulationState.currentStep * 9);
            } else {
                attackerScore = simulationState.attackerScore + (simulationState.currentStep * 2);
            }
            // Defender score increases during detection and mitigation
            defenderScore = simulationState.defenderScore + (simulationState.currentStep * 7);
        } else {
            // Default scoring for other scenarios
            attackerScore = simulationState.attackerScore;
            defenderScore = simulationState.defenderScore;
        }

        attackChart.data.datasets[0].data.push(attackerScore);
        attackChart.data.datasets[1].data.push(defenderScore);
        attackChart.update();
    }
    
    // End simulation
    function endSimulation() {
        simulationState.active = false;
        startSimulationBtn.disabled = false;
        nextStepBtn.disabled = true;
        
        const result = simulationState.attackerScore > simulationState.defenderScore ? 
            'Attack Successful' : 'Attack Mitigated';
        
        simulationLog.innerHTML += `<p><strong>Simulation Complete: ${result}</strong></p>`;
    }
    
    // Reset simulation and clear all content
    function resetSimulation() {
        // Reset simulation state
        simulationState = {
              active: false,
              currentStep: 0,
              steps: [],
              attackerScore: 0,
              defenderScore: 0
            };
            
        // Clear all content
        scenarioContent.innerHTML = '<p>Please select a scenario to begin.</p>';
        logInput.value = '';
        resultsContent.innerHTML = '<div class="no-results">Run an analysis to see results</div>';
        recommendationContent.innerHTML = '<div class="no-results">Recommendations will appear here after analysis</div>';
        predictionContent.innerHTML = '<div class="no-results">Predictions will appear here after analysis</div>';
        simulationLog.innerHTML = '<p>Simulation not started</p>';
        
        // Reset buttons
        startSimulationBtn.disabled = false;
        nextStepBtn.disabled = true;
        resetSimulationBtn.disabled = true;
        
        // Reset scenario selection
        scenarioSelect.selectedIndex = 0;
        currentScenario = null;
        
        // Reset graph
        if (cyGraph) {
            cyGraph.elements().remove();
        }
        
        // Reset chart
        if (attackChart) {
            attackChart.data.labels = [];
            attackChart.data.datasets[0].data = [];
            attackChart.data.datasets[1].data = [];
            attackChart.update();
        }
        
        // Close modal if open
                  resultModal.style.display = 'none';
                }
    
    // Initialize the application
    init();
              });
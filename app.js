#!/usr/bin/env node
import http from 'http';
import appInsights from 'applicationinsights';

// Configuration Application Insights AVANT tout
const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
console.log('🔍 Connection String présente (APPLICATIONINSIGHTS_CONNECTION_STRING):', !!connectionString);

if (connectionString) {
  try {
    const aiConfig = appInsights
      .setup(connectionString)
      .setAutoCollectConsole(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectDependencies(true);

    const samplingPct = Number(process.env.APPINSIGHTS_SAMPLING_PERCENTAGE ?? 100);
    if (!Number.isNaN(samplingPct)) {
      appInsights.defaultClient.config.samplingPercentage = samplingPct;
      console.log(`📉 Sampling Application Insights à ${samplingPct}%`);
    }

    aiConfig.start();
    console.log('✅ Application Insights initialisé avec succès');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation d\'Application Insights:', err.message);
  }
} else {
  console.log('⚠️ Application Insights: Non configuré (aucune connection string trouvée)');
}

const PORT = process.env.PORT || 8080;

// Serveur HTTP
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🎮 Jeu de Devinette Node.js</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            min-height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            padding: 20px; 
          }
          .container { 
            background: white; 
            padding: 40px; 
            border-radius: 15px; 
            max-width: 600px; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.2); 
            text-align: center; 
          }
          h1 { 
            color: #333; 
            margin-bottom: 10px; 
            font-size: 2.5em; 
          }
          .status { 
            padding: 20px; 
            background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); 
            border-radius: 10px; 
            margin: 20px 0; 
            color: white; 
            font-weight: bold;
          }
          .features { 
            text-align: left; 
            display: inline-block; 
            margin: 20px 0; 
          }
          .features li { 
            margin: 10px 0; 
            font-size: 1.1em; 
          }
          .button-container {
            margin: 30px 0;
          }
          .play-button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-size: 1.2em;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          }
          .play-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
          }
          .play-button:active {
            transform: translateY(0);
          }
          .info { 
            color: #666; 
            font-size: 0.9em; 
            margin-top: 20px; 
          }
          a { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: bold; 
          }
          a:hover { 
            text-decoration: underline; 
          }
          .game-container {
            display: none;
            margin-top: 30px;
          }
          .game-container.active {
            display: block;
          }
          .input-group {
            margin: 20px 0;
          }
          input[type="number"] {
            padding: 10px;
            font-size: 1em;
            border: 2px solid #667eea;
            border-radius: 5px;
            width: 100px;
            text-align: center;
          }
          .submit-btn {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            font-weight: bold;
            margin-left: 10px;
          }
          .submit-btn:hover {
            background: #764ba2;
          }
          .message {
            margin: 15px 0;
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
          }
          .message.success {
            background: #e8f5e9;
            color: #2e7d32;
          }
          .message.info {
            background: #e3f2fd;
            color: #1565c0;
          }
          .message.error {
            background: #ffebee;
            color: #c62828;
          }
          .stats {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎮 Jeu de Devinette</h1>
          <p style="color: #666; margin-bottom: 20px;">Application Node.js 24 LTS sur Azure Web App</p>
          
          <div class="status">
            ✅ Serveur en ligne et fonctionnel
          </div>
          
          <h3 style="margin-top: 30px; color: #333;">Fonctionnalités</h3>
          <ul class="features">
            <li>🎯 Devinez un nombre entre 1 et 100</li>
            <li>🏆 Système de score intelligent</li>
            <li>📊 Statistiques en temps réel</li>
            <li>📡 Intégration Azure Application Insights</li>
            <li>☁️ Déployée en continu via GitHub Actions</li>
          </ul>
          
          <div class="button-container">
            <button class="play-button" onclick="startGame()">🎮 Commencer une partie</button>
          </div>

          <div class="game-container" id="gameContainer">
            <h2 id="gameTitle">Devinez un nombre entre 1 et 100</h2>
            <p id="attempts" style="color: #666;">Tentatives restantes: 7</p>
            
            <div class="input-group">
              <input type="number" id="numberInput" min="1" max="100" placeholder="Votre nombre">
              <button class="submit-btn" onclick="submitGuess()">Envoyer</button>
            </div>
            
            <div id="message"></div>
            <div id="stats" class="stats" style="display: none;"></div>
          </div>
          
          <div class="info">
            <p><strong>Powered by:</strong> Node.js 24 LTS | Azure Web App | Application Insights</p>
            <p style="margin-top: 10px;"><small>Repository: <a href="https://github.com/jallal-askry/App-NODEJS-Insights" target="_blank">App-NODEJS-Insights</a></small></p>
          </div>
        </div>

        <script>
          let secretNumber = 0;
          let attempts = 0;
          const maxAttempts = 7;
          let score = 0;
          let totalGames = 0;

          function startGame() {
            secretNumber = Math.floor(Math.random() * 100) + 1;
            attempts = 0;
            document.getElementById('gameContainer').classList.add('active');
            document.getElementById('numberInput').focus();
            clearMessage();
          }

          function submitGuess() {
            const input = document.getElementById('numberInput');
            const guess = parseInt(input.value);

            if (isNaN(guess) || guess < 1 || guess > 100) {
              showMessage('❌ Veuillez entrer un nombre valide entre 1 et 100', 'error');
              return;
            }

            attempts++;
            const remaining = maxAttempts - attempts;

            if (guess === secretNumber) {
              const gameScore = 100 + (remaining * 10);
              score += gameScore;
              totalGames++;
              showMessage(\`🎉 BRAVO ! Vous avez trouvé le nombre en \${attempts} tentative(s) !<br>🏆 +\${gameScore} points\`, 'success');
              showStats();
              input.value = '';
              input.disabled = true;
            } else if (attempts >= maxAttempts) {
              totalGames++;
              showMessage(\`💔 Dommage ! Vous avez épuisé vos tentatives.<br>Le nombre secret était: \${secretNumber}\`, 'error');
              showStats();
              input.value = '';
              input.disabled = true;
            } else {
              const hint = guess < secretNumber ? '📈 C\\'est PLUS !' : '📉 C\\'est MOINS !';
              showMessage(\`\${hint}<br>Tentatives restantes: \${remaining}\`, 'info');
              document.getElementById('attempts').textContent = \`Tentatives restantes: \${remaining}\`;
            }

            input.value = '';
          }

          function showMessage(text, type) {
            const msgDiv = document.getElementById('message');
            msgDiv.innerHTML = text;
            msgDiv.className = \`message \${type}\`;
          }

          function clearMessage() {
            document.getElementById('message').innerHTML = '';
            document.getElementById('message').className = '';
            document.getElementById('stats').style.display = 'none';
            document.getElementById('numberInput').disabled = false;
          }

          function showStats() {
            const statsDiv = document.getElementById('stats');
            statsDiv.innerHTML = \`
              <strong>📊 Statistiques:</strong><br>
              Parties jouées: \${totalGames}<br>
              Score total: \${score} points<br>
              \${totalGames > 0 ? 'Moyenne: ' + (score / totalGames).toFixed(1) + ' points/partie' : ''}
            \`;
            statsDiv.style.display = 'block';
          }

          document.getElementById('numberInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              submitGuess();
            }
          });
        </script>
      </body>
      </html>
    `);
  } else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Page non trouvée (404)');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  const connStr = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
  console.log(`📊 Application Insights: ${connStr ? '✅ Configuré' : '⚠️ Non configuré'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, fermeture du serveur...');
  server.close(() => {
    console.log('Serveur fermé.');
    process.exit(0);
  });
});

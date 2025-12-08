#!/usr/bin/env node
import http from 'http';
import appInsights from 'applicationinsights';

// Configuration Application Insights
if (process.env.APPINSIGHTS_CONNECTIONSTRING) {
  appInsights
    .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
    .setAutoCollectRequests(true)
    .setAutoCollectDependencies(true)
    .start();
}

const PORT = process.env.PORT || 3000;

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
          
          <div class="info">
            <p><strong>Powered by:</strong> Node.js 24 LTS | Azure Web App | Application Insights</p>
            <p style="margin-top: 10px;"><small>Repository: <a href="https://github.com/jallal-askry/App-NODEJS-Insights" target="_blank">App-NODEJS-Insights</a></small></p>
          </div>
        </div>
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
  console.log(`📊 Application Insights: ${process.env.APPINSIGHTS_CONNECTIONSTRING ? '✅ Configuré' : '⚠️ Non configuré'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, fermeture du serveur...');
  server.close(() => {
    console.log('Serveur fermé.');
    process.exit(0);
  });
});

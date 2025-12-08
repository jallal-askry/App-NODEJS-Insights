import readline from 'readline';
import { stdin as input, stdout as output } from 'process';
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

const PORT = process.env.PORT || 8080;

class JeuDevinette {
  constructor() {
    this.rl = readline.createInterface({ input, output });
    this.nombreSecret = 0;
    this.tentatives = 0;
    this.maxTentatives = 7;
    this.score = 0;
    this.partiesJouees = 0;
  }

  afficherBienvenue() {
    console.clear();
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🎮 JEU DE DEVINETTE DE NOMBRE 🎮    ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log('Devinez le nombre entre 1 et 100 !');
    console.log(`Vous avez ${this.maxTentatives} tentatives.\n`);
  }

  genererNombreSecret() {
    this.nombreSecret = Math.floor(Math.random() * 100) + 1;
    this.tentatives = 0;
  }

  afficherStatistiques() {
    console.log('\n📊 STATISTIQUES:');
    console.log(`   Parties jouées: ${this.partiesJouees}`);
    console.log(`   Score total: ${this.score}`);
    if (this.partiesJouees > 0) {
      console.log(`   Moyenne: ${(this.score / this.partiesJouees).toFixed(1)} points/partie`);
    }
  }

  calculerScore() {
    const bonus = (this.maxTentatives - this.tentatives) * 10;
    return 100 + bonus;
  }

  async poserQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (reponse) => {
        resolve(reponse);
      });
    });
  }

  async jouerPartie() {
    this.genererNombreSecret();
    let gagne = false;

    while (this.tentatives < this.maxTentatives && !gagne) {
      const tentativesRestantes = this.maxTentatives - this.tentatives;
      console.log(`\n💡 Tentatives restantes: ${tentativesRestantes}`);
      
      const reponse = await this.poserQuestion('Votre nombre: ');
      const nombre = parseInt(reponse);

      if (isNaN(nombre)) {
        console.log('❌ Veuillez entrer un nombre valide !');
        continue;
      }

      if (nombre < 1 || nombre > 100) {
        console.log('❌ Le nombre doit être entre 1 et 100 !');
        continue;
      }

      this.tentatives++;

      if (nombre === this.nombreSecret) {
        gagne = true;
        const scorePartie = this.calculerScore();
        this.score += scorePartie;
        this.partiesJouees++;
        
        console.log('\n🎉 BRAVO ! Vous avez gagné ! 🎉');
        console.log(`✨ Trouvé en ${this.tentatives} tentative(s) !`);
        console.log(`🏆 +${scorePartie} points`);
      } else if (nombre < this.nombreSecret) {
        console.log('📈 C\'est plus !');
      } else {
        console.log('📉 C\'est moins !');
      }
    }

    if (!gagne) {
      this.partiesJouees++;
      console.log('\n💔 Dommage ! Vous avez épuisé vos tentatives.');
      console.log(`Le nombre secret était: ${this.nombreSecret}`);
    }

    this.afficherStatistiques();
  }

  async menuPrincipal() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║              MENU                      ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('1. 🎮 Nouvelle partie');
    console.log('2. 📊 Voir les statistiques');
    console.log('3. 🚪 Quitter\n');
    
    const choix = await this.poserQuestion('Votre choix: ');
    return choix.trim();
  }

  async demarrer() {
    this.afficherBienvenue();
    
    let continuer = true;

    while (continuer) {
      const choix = await this.menuPrincipal();

      switch (choix) {
        case '1':
          console.clear();
          console.log('🎯 Nouvelle partie !\n');
          await this.jouerPartie();
          break;
        
        case '2':
          console.clear();
          this.afficherStatistiques();
          break;
        
        case '3':
          console.log('\n👋 Merci d\'avoir joué ! À bientôt !');
          continuer = false;
          break;
        
        default:
          console.log('❌ Choix invalide ! Veuillez choisir 1, 2 ou 3.');
      }
    }

    this.rl.close();
  }
}

// Serveur HTTP pour Azure Web App
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>🎮 Jeu de Devinette Node.js</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background: #f0f0f0; }
        h1 { color: #333; }
        .container { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        p { color: #666; line-height: 1.6; }
        .status { padding: 10px; background: #e8f5e9; border-left: 4px solid #4caf50; margin: 20px 0; }
        code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎮 Jeu de Devinette</h1>
        <p>Application Node.js 24 LTS déployée sur Azure Web App</p>
        <div class="status">
          <strong>✅ Serveur en ligne</strong><br>
          Pour jouer en mode interactif: <code>npm start -- --game</code>
        </div>
        <h3>Fonctionnalités</h3>
        <ul style="text-align: left; display: inline-block;">
          <li>🎯 Devinez un nombre entre 1 et 100</li>
          <li>🏆 Système de score</li>
          <li>📊 Statistiques en temps réel</li>
          <li>📡 Intégration Application Insights</li>
        </ul>
        <hr>
        <p><small>Powered by Node.js 24 LTS | Azure Web App | Application Insights</small></p>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur Web lancé sur http://localhost:${PORT}`);
  console.log(`📊 Application Insights: ${process.env.APPINSIGHTS_CONNECTIONSTRING ? '✅ Configuré' : '⚠️ Non configuré'}`);
});

// Lancer le jeu en mode interactif si demandé
if (process.argv[2] === '--game') {
  const jeu = new JeuDevinette();
  jeu.demarrer();
}


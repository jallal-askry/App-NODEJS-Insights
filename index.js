import readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import appInsights from 'applicationinsights';

// Configuration Application Insights
appInsights
  .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
  .setAutoCollectRequests(true)
  .setAutoCollectDependencies(true)
  .start();

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

// Lancer le jeu
const jeu = new JeuDevinette();
jeu.demarrer();

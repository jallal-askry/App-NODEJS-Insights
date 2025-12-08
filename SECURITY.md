# 🔐 Guide de Sécurité

## Variables d'environnement sensibles

Cette application utilise des secrets Azure que vous **ne devez JAMAIS** publier sur GitHub.

### Configuration locale (`.env`)

Pour développer localement, créez un fichier `.env` **non versionné** :

```bash
cp .env.example .env
```

Puis remplissez-le avec vos vraies valeurs :

```env
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=xxxxx;IngestionEndpoint=...
NODE_ENV=development
```

**⚠️ Ne commitez JAMAIS ce fichier !** Il est dans `.gitignore` pour cette raison.

### Configuration sur Azure Web App

Les secrets doivent être configurés directement dans Azure Portal :

1. **Azure Portal** → Votre Web App `app-test`
2. **Configuration** → **Variables d'environnement**
3. Ajoutez :
   - **Nom** : `APPLICATIONINSIGHTS_CONNECTION_STRING`
   - **Valeur** : Votre vraie connection string

### Meilleures pratiques

- ✅ Utilisez Azure Key Vault pour les secrets sensibles
- ✅ Nunca commitez `.env`, `.env.production`, ou fichiers contenant des secrets
- ✅ Utilisez des variables d'environnement pour tous les secrets
- ✅ Rotatez régulièrement vos clés d'instrumentation
- ✅ Limitez les permissions des clés au minimum nécessaire

### En cas de compromission

Si une clé a été accidentellement publiée :

1. **Supprimez immédiatement** la clé du repo (même l'historique Git)
2. **Désactivez** la clé dans Azure Portal
3. **Créez** une nouvelle clé
4. **Mettez à jour** les variables d'environnement Azure

Pour supprimer de l'historique Git :
```bash
git filter-branch --tree-filter 'rm -f .env.production' HEAD
git push origin main --force-with-lease
```

**N'oubliez pas : Les secrets sur GitHub sont visibles par tous !** 🔒

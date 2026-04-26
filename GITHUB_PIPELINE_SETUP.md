# 🚀 Pipeline CI/CD GitHub → Yunohost

## 📋 Prérequis

- ✅ Repo GitHub avec le code
- ✅ Accès SSH à Yunohost
- ✅ Clé privée SSH générée
- ✅ Compte GitHub avec permissions

---

## 🔑 **Étape 1: Générer les clés SSH (sur le serveur)**

Connectez-vous à Yunohost via SSH:

```bash
ssh admin@nuuull.org

# Créer le dossier pour les clés
sudo mkdir -p /opt/yunohost/suivi-ruches/.ssh
cd /opt/yunohost/suivi-ruches

# Générer une paire de clés dédiée au déploiement
sudo -u www-data ssh-keygen -t ed25519 \
  -f /opt/yunohost/suivi-ruches/.ssh/deploy_key \
  -N "" \
  -C "GitHub Actions Deploy"

# Afficher la clé PRIVÉE (à copier dans GitHub Secrets)
sudo cat /opt/yunohost/suivi-ruches/.ssh/deploy_key

# Afficher la clé PUBLIQUE (à autoriser sur le serveur)
sudo cat /opt/yunohost/suivi-ruches/.ssh/deploy_key.pub

# Ajouter la clé publique à authorized_keys
sudo -u www-data bash -c 'cat /opt/yunohost/suivi-ruches/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys'

# Vérifier les permissions
sudo -u www-data ls -la ~/.ssh/
```

---

## 🔐 **Étape 2: Ajouter les secrets GitHub**

1. Aller sur GitHub → Votre repo `suivi-ruches`
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquer **New repository secret**

### Secret 1: Clé SSH privée
- **Name:** `DEPLOY_PRIVATE_KEY`
- **Value:** (copier la clé privée complète, incluant `-----BEGIN PRIVATE KEY-----`)

### Secret 2: Clé API Anthropic
- **Name:** `ANTHROPIC_API_KEY`
- **Value:** `sk-ant-...`

### Secret 3: Webhook Slack (optionnel)
- **Name:** `SLACK_WEBHOOK`
- **Value:** (URL webhook Slack si vous l'utilisez)

### Secret 4: Email de notification (optionnel)
- **Name:** `DEPLOY_EMAIL`
- **Value:** `your-email@example.com`

---

## 📁 **Étape 3: Structure du repo GitHub**

```
suivi-ruches/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml              ← Workflow GitHub Actions
├─ src/
│  ├─ suivi-ruches-v4.html
│  └─ server.js
├─ scripts/
│  └─ deploy.sh                  ← Script de déploiement
├─ tests/
│  └─ server.test.js             ← Tests unitaires
├─ .gitignore                    ← Important!
├─ .env.example                  ← Template, pas de secrets
├─ package.json
├─ package-lock.json
└─ README.md
```

### ⚠️ Contenu de `.gitignore`:
```
# Variables d'environnement
.env
.env.local
.env.*.local

# Clés SSH
.ssh/
*.pem
deploy_key

# Node
node_modules/
npm-debug.log*
yarn-debug.log*

# Éditeurs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
```

### 📝 Contenu de `.env.example`:
```
# Exemple de configuration (NE PAS AJOUTER LES VRAIS SECRETS!)
ANTHROPIC_API_KEY=sk-ant-example-key-here
NODE_ENV=production
PORT=3000
```

---

## 🔄 **Étape 4: Placer le workflow GitHub Actions**

1. **Créer le dossier** `.github/workflows/` à la racine du repo
2. **Créer le fichier** `deploy.yml` avec le contenu fourni
3. **Committer et push:**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment pipeline"
git push origin main
```

---

## 📤 **Étape 5: Placer le script de déploiement**

1. **Créer le dossier** `scripts/` à la racine du repo
2. **Créer le fichier** `deploy.sh` avec le contenu fourni
3. **Rendre exécutable:**

```bash
chmod +x scripts/deploy.sh
git add scripts/deploy.sh
git commit -m "Add deployment script"
git push origin main
```

---

## 🧪 **Étape 6: Ajouter des tests (optionnel mais recommandé)**

### Tester la syntaxe Node.js:
```bash
# package.json
{
  "scripts": {
    "test": "node -c server.js && echo 'Syntax OK'",
    "lint": "echo 'No linter configured'"
  }
}
```

### Ou avec Jest:
```bash
npm install --save-dev jest

# package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}

# tests/server.test.js
describe('Server', () => {
  test('should load without errors', () => {
    expect(() => require('../server.js')).not.toThrow();
  });
});
```

---

## 🚀 **Étape 7: Tester le pipeline**

### Test 1: Simple push
```bash
# Faire une modification
echo "# Updated" >> README.md

# Committer et push
git add README.md
git commit -m "Test deployment pipeline"
git push origin main

# Voir le workflow en direct
# GitHub → Actions → Voir la dernière run
```

### Test 2: Simuler une erreur
```bash
# Casser le serveur intentionnellement
echo "syntax error" >> server.js

# Push et voir le pipeline échouer
git add server.js
git commit -m "Test failure handling"
git push origin main

# Vérifier que le rollback fonctionne
# Puis corriger et repush
```

---

## 📊 **Pipeline détaillé**

```mermaid
┌─────────────────┐
│  Push to main   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Run Tests     │ (lint, unit tests)
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│ Security Check  │ (scan secrets, deps)
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│     Build       │ (npm ci, package)
└────────┬────────┘
         │ ✅ Success
         ▼
┌─────────────────┐
│    Deploy       │ (SSH → Yunohost)
│  ├─ Backup      │
│  ├─ Update code │
│  ├─ npm install │
│  ├─ Tests       │
│  └─ Restart     │
└────────┬────────┘
         │ ✅ Success
         ▼
┌─────────────────┐
│ Health Check    │
└────────┬────────┘
         │ ✅ OK
         ▼
┌─────────────────┐
│ Notify + Done   │
└─────────────────┘
```

---

## 🔍 **Monitoring du pipeline**

### Voir les logs en direct:
1. GitHub → **Actions**
2. Cliquer sur le dernier workflow
3. Cliquer sur le job (test, build, deploy)
4. Voir l'output en direct

### Fichiers utiles:
```bash
# Sur le serveur, voir les logs de l'app
sudo journalctl -u suivi-ruches -f

# Voir le statut du service
sudo systemctl status suivi-ruches

# Voir les backups effectués
ls -la /opt/yunohost/backups/suivi-ruches/

# Voir la dernière version déployée
cd /opt/yunohost/suivi-ruches && git log -1
```

---

## ✅ **Checklist de configuration**

- [ ] Repo GitHub créé avec le code
- [ ] Dossier `.github/workflows/` créé
- [ ] Fichier `deploy.yml` en place
- [ ] Clés SSH générées sur Yunohost
- [ ] Secret `DEPLOY_PRIVATE_KEY` ajouté
- [ ] Secret `ANTHROPIC_API_KEY` ajouté
- [ ] Script `deploy.sh` en place et exécutable
- [ ] `.env.example` créé (pas de secrets!)
- [ ] `.gitignore` configuré
- [ ] Premier push effectué → Workflow déclenché
- [ ] Tests passent ✅
- [ ] Déploiement réussi ✅
- [ ] App accessible sur `https://bee.nuuull.org` ✅

---

## 🐛 **Dépannage**

### "Permission denied" lors du SSH
```bash
# Sur Yunohost, vérifier les permissions
sudo -u www-data ls -la ~/.ssh/authorized_keys

# Ajouter la clé si manquante
sudo -u www-data bash -c 'cat /opt/yunohost/suivi-ruches/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys'
```

### Workflow ne se déclenche pas
- Vérifier que le fichier est dans `.github/workflows/`
- Vérifier que le branch est `main`
- Vérifier que le fichier YAML est valide

### Déploiement échoue
- Vérifier les logs GitHub Actions
- Vérifier les logs Yunohost: `journalctl -u suivi-ruches -n 50`
- Vérifier les secrets sont définis
- Tester la connexion SSH manuellement

### Rollback automatique s'active
- Vérifier que le script `deploy.sh` est exécutable
- Vérifier les permissions des backups
- Vérifier que le service peut redémarrer

---

## 🔒 **Sécurité**

### ✅ Bonnes pratiques respectées:
- ✅ Clés SSH différentes pour le déploiement
- ✅ Secrets stockés dans GitHub (pas en clair)
- ✅ `.env` jamais commité
- ✅ Scan de secrets automatique (TruffleHog)
- ✅ Backups automatiques avant chaque déploiement
- ✅ Rollback automatique en cas d'erreur
- ✅ Logs complets de chaque déploiement

### ⚠️ À faire:
- Monitorer les deployments
- Mettre à jour les dépendances régulièrement
- Faire des audits de sécurité
- Tester les rollbacks périodiquement

---

## 📊 **Statistiques du pipeline**

```
Temps moyen par étape:
├─ Tests: 30-60s
├─ Security: 20-40s
├─ Build: 30-60s
├─ Deploy: 1-3 min
└─ Total: 3-6 minutes

Avec chaque déploiement:
✅ 1 backup automatique
✅ Tests exécutés
✅ Logs conservés
✅ Rollback disponible
```

---

## 🎯 **Prochaines étapes**

1. **Notifications Slack:** Recevoir les alertes de déploiement
2. **Monitoring:** Ajouter des healthchecks
3. **Database:** Si vous ajoutez une DB
4. **Docker:** Containeriser pour plus de fiabilité
5. **Multi-environnement:** Staging et Production

Bon pipeline! 🚀


# 🐙 GitHub - Créer le repo étape par étape

## 🎯 But: Créer repo GitHub et configurer la pipeline

---

## **ÉTAPE 1: Créer le compte GitHub** (si vous n'en avez pas)

### 1.1 Aller sur GitHub
```
https://github.com/signup
```

### 1.2 Remplir le formulaire
- Email
- Password
- Username: `tonnom` (ou votre pseudo)
- Opt out de communications

### 1.3 Vérifier l'email
- GitHub envoie un lien de vérification
- Cliquer sur le lien

✅ Compte créé!

---

## **ÉTAPE 2: Créer le repository** (le plus important)

### 2.1 Aller sur GitHub new repo
```
https://github.com/new
```

### 2.2 Remplir le formulaire

**Repository name:**
```
suivi-ruches
```

**Description:**
```
Application de suivi apicole avec IA et dictée vocale
```

**Visibility:**
```
🔵 Public (recommandé pour partager)
ou
🔴 Private (si données sensibles)
```

**Initialize with:**
```
❌ Ne PAS cocher "Add a README file"
❌ Ne PAS cocher ".gitignore template"
❌ Ne PAS cocher "Choose a license"

(On va créer ces fichiers nous-mêmes)
```

### 2.3 Créer le repo
```
Cliquer "Create repository"
```

✅ Repo créé! Vous êtes redirigé vers une page vide.

---

## **ÉTAPE 3: Configuration initiale du repo** (en local d'abord)

### 3.1 Initialiser git sur votre ordinateur

```bash
cd suivi-ruches

# Initialiser git
git init

# Ajouter tous les fichiers
git add .

# Vérifier ce qu'on va commiter
git status

# Doit montrer:
# On branch master
# Changes to be committed:
#   new file:   .env.example
#   new file:   .github/workflows/deploy.yml
#   ...etc...
```

### 3.2 Faire le premier commit

```bash
git commit -m "Initial commit: Suivi Ruches v1.4.0 with AI and voice dictation"
```

### 3.3 Ajouter la remote GitHub

```bash
# Remplacer "tonnom" par votre username GitHub
git remote add origin https://github.com/tonnom/suivi-ruches.git

# Vérifier
git remote -v
# Doit afficher:
# origin  https://github.com/tonnom/suivi-ruches.git (fetch)
# origin  https://github.com/tonnom/suivi-ruches.git (push)
```

### 3.4 Renommer la branche en "main"

```bash
git branch -M main
```

### 3.5 Pousser vers GitHub

```bash
git push -u origin main

# Vous demande:
# ? GitHub username: tonnom (ou votre username)
# ? GitHub password: [enter your password]
# (OU token d'accès personnel)
```

✅ Code pushé sur GitHub!

---

## **ÉTAPE 4: Vérifier le repo sur GitHub**

### 4.1 Aller sur GitHub

```
https://github.com/tonnom/suivi-ruches
```

### 4.2 Vérifier les fichiers

Vous devez voir:
```
✅ .github/workflows/deploy.yml
✅ scripts/deploy.sh
✅ src/suivi-ruches-v1.4.0.html
✅ src/server.js
✅ .env.example
✅ .gitignore
✅ package.json
✅ README.md
✅ README_V1.4.md
✅ GUIDE_V1.4.md
✅ CHANGELOG.md
✅ YUNOHOST_DEPLOYMENT.md
✅ GITHUB_PIPELINE_SETUP.md
```

### 4.3 Vérifier le commit

```
Code → Commits → 1 commit "Initial commit..."
```

✅ Repo visible et complet!

---

## **ÉTAPE 5: Configurer les secrets GitHub** (IMPORTANT!)

Ces secrets permettent au workflow de déployer sur Yunohost.

### 5.1 Aller à Settings

```
Votre repo → Settings (en haut à droite)
```

### 5.2 Ouvrir Secrets and variables

```
Settings → Secrets and variables → Actions
```

### 5.3 Créer le secret DEPLOY_PRIVATE_KEY

```
Button "New repository secret"
```

**Name:**
```
DEPLOY_PRIVATE_KEY
```

**Value:** (Voir ci-dessous comment l'obtenir)
```
COPIER-COLLER la clé privée SSH complète
(Incluant les lignes "-----BEGIN PRIVATE KEY-----" et "-----END PRIVATE KEY-----")
```

### 5.4 Créer le secret ANTHROPIC_API_KEY

```
Button "New repository secret"
```

**Name:**
```
ANTHROPIC_API_KEY
```

**Value:**
```
sk-ant-votre-clé-api-ici
```

### 5.5 Vérifier les secrets

```
Secrets and variables → Actions
```

Doit afficher:
```
✅ DEPLOY_PRIVATE_KEY (●●●●●● - masqué)
✅ ANTHROPIC_API_KEY (●●●●●● - masqué)
```

✅ Secrets configurés!

---

## **ÉTAPE 6: Générer les clés SSH** (avant d'ajouter secret)

### 6.1 Sur votre serveur Yunohost

```bash
ssh admin@nuuull.org

# Créer un dossier pour les clés
sudo mkdir -p /opt/yunohost/suivi-ruches/.ssh
cd /opt/yunohost/suivi-ruches

# Générer la paire de clés
sudo -u www-data ssh-keygen -t ed25519 \
  -f /opt/yunohost/suivi-ruches/.ssh/deploy_key \
  -N "" \
  -C "GitHub Actions Deploy"
```

### 6.2 Afficher la clé PRIVÉE

```bash
sudo cat /opt/yunohost/suivi-ruches/.ssh/deploy_key

# Copier TOUT (incluant "-----BEGIN..." et "-----END...")
# À ajouter en secret GitHub: DEPLOY_PRIVATE_KEY
```

### 6.3 Afficher la clé PUBLIQUE

```bash
sudo cat /opt/yunohost/suivi-ruches/.ssh/deploy_key.pub

# Copier la clé
# À ajouter dans authorized_keys pour www-data
```

### 6.4 Autoriser la clé publique

```bash
# Sur Yunohost, ajouter la clé publique aux clés autorisées
sudo -u www-data bash -c 'cat /opt/yunohost/suivi-ruches/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys'

# Vérifier les permissions
sudo -u www-data ls -la ~/.ssh/
```

✅ Clés SSH prêtes!

---

## **ÉTAPE 7: Tester le workflow** (optionnel mais recommandé)

### 7.1 Faire une petite modification

```bash
# En local, faire un changement
echo "# Test deployment" >> README.md

# Committer
git add README.md
git commit -m "Test GitHub Actions workflow"
git push origin main
```

### 7.2 Voir le workflow s'exécuter

```
Votre repo GitHub → Actions (onglet en haut)
```

Vous devez voir:
```
✅ Test GitHub Actions workflow (le plus récent en haut)
```

Cliquer dessus pour voir les détails:
```
✅ test - OK
✅ security - OK
✅ build - OK
✅ deploy - Peut échouer si Yunohost pas prêt (normal)
```

### 7.3 Vérifier les logs

```
Actions → Cliquer sur le workflow
→ Voir les jobs et leurs logs
→ Très utile pour déboguer
```

✅ Workflow en marche!

---

## **ÉTAPE 8: Protéger la branche main** (optionnel mais recommandé)

### 8.1 Aller à Settings → Branches

```
Settings → Branches
```

### 8.2 Ajouter rule

```
Button "Add branch protection rule"
```

**Branch name pattern:**
```
main
```

**Require status checks to pass:**
```
✅ Cocher "Require status checks to pass before merging"
✅ Cocher "Require test suite to pass"
```

**Require reviews:**
```
✅ Cocher "Require a pull request before merging"
```

### 8.3 Sauvegarder

```
Button "Create"
```

✅ Branch protégée!

---

## **ÉTAPE 9: Premiers déploiements** (plus tard)

Une fois Yunohost configuré:

### 9.1 Faire un changement de code

```bash
# Modifier l'app localement
# Par exemple, ajouter une fonctionnalité

# Committer
git add .
git commit -m "Add new feature X"
git push origin main
```

### 9.2 GitHub Actions s'exécute automatiquement

```
GitHub Actions détecte le push
    ↓
Tests + Build s'exécutent
    ↓
Deploy vers Yunohost (SSH)
    ↓
App mise à jour automatiquement
    ↓
bee.nuuull.org reflète le changement ✅
```

### 9.3 Voir le statut

```
GitHub → Actions → Voir le workflow
```

---

## **ÉTAPE 10: Maintenance continue** (quotidienne)

### 10.1 Cycle normal

```
Code en local
    ↓
git commit
    ↓
git push origin main
    ↓
GitHub Actions automatiquement
    ↓
Yunohost déployé
```

### 10.2 Voir les logs

```
GitHub → Actions → Workflow récent → Voir les logs
```

### 10.3 Si erreur

```
Actions → Cliquer sur workflow échoué
→ Voir les logs
→ Identifier le problème
→ Corriger localement
→ git push
→ Workflow relancé automatiquement
```

---

## 📋 **Checklist complète**

### Compte GitHub
- [ ] Compte créé et vérifié
- [ ] Connecté à GitHub

### Repo créé
- [ ] Repo "suivi-ruches" créé sur GitHub
- [ ] Tous les fichiers poussés
- [ ] Visible sur https://github.com/tonnom/suivi-ruches

### Secrets configurés
- [ ] DEPLOY_PRIVATE_KEY ajouté
- [ ] ANTHROPIC_API_KEY ajouté
- [ ] Secrets visibles dans Settings

### SSH configuré
- [ ] Clés générées sur Yunohost
- [ ] Clé publique ajoutée à authorized_keys
- [ ] Permissions correctes

### Workflow testé
- [ ] Actions visible
- [ ] Premiers runs visibles
- [ ] Logs consultables

### Documentation
- [ ] README.md complet
- [ ] GUIDE_V1.4.md présent
- [ ] CHANGELOG.md visible

---

## 🎯 Résumé des commandes git

```bash
# Initialisation (une fois)
cd suivi-ruches
git init
git add .
git commit -m "Initial commit: Suivi Ruches v1.4.0"
git remote add origin https://github.com/tonnom/suivi-ruches.git
git branch -M main
git push -u origin main

# Après chaque changement (quotidien)
git add .
git commit -m "Description du changement"
git push origin main

# Voir l'historique
git log --oneline

# Voir les branches
git branch -a

# Voir les remotes
git remote -v
```

---

## ⚠️ **Important**

### Avant de pousser
```bash
# Vérifier que .env N'EST PAS dans git
git status
# Ne doit pas montrer .env (il est dans .gitignore)

# Vérifier que les secrets sont dans Settings GitHub
# Et NOT dans le code
```

### Après chaque déploiement
```bash
# Vérifier que l'app est à jour sur bee.nuuull.org
curl https://bee.nuuull.org

# Voir les logs
ssh admin@nuuull.org
journalctl -u suivi-ruches -n 20
```

---

## 🚀 **Vous êtes maintenant prêt!**

Résumé:
1. ✅ Dossier local complet
2. ✅ Repo GitHub créé
3. ✅ Secrets configurés
4. ✅ SSH prêt
5. ✅ Workflow testé

Prochaine étape: **Configurer Yunohost** (voir YUNOHOST_DEPLOYMENT.md)

---

**Questions? Consultez:**
- GitHub docs: https://docs.github.com/
- GITHUB_PIPELINE_SETUP.md pour CI/CD
- YUNOHOST_DEPLOYMENT.md pour déploiement

Bon développement! 🐝🐙

# 🚀 START HERE - Ordre de lecture et d'action

Bienvenue dans **Suivi Ruches v1.4.0**! 

Lisez ce guide pour savoir dans quel ordre faire les choses.

---

## 📖 **Ordre de lecture AVANT de commencer**

### 1️⃣ **Vous êtes ici!** (ce fichier)
✅ Comprendre l'ordre global

### 2️⃣ **`00_STRUCTURE_LOCALE.md`**
📁 Comprendre les fichiers à télécharger et comment les organiser

### 3️⃣ **`README_V1.4.md`**
📝 Vue d'ensemble de v1.4 et ses nouvelles fonctionnalités

### 4️⃣ **`GUIDE_V1.4.md`**
📚 Tutorial détaillé: Comment utiliser template + dictée vocale

---

## 🎯 **Les 4 phases du projet**

```
Phase 1: PRÉPARATION (30 min)
    ↓ (vous êtes ici)
Phase 2: GITHUB (30 min)
    ↓
Phase 3: YUNOHOST (1-2 heures)
    ↓
Phase 4: PRODUCTIF (quotidien)
```

---

## **PHASE 1: PRÉPARATION** (30 minutes)

### Étape 1.1: Télécharger les fichiers
```
Lire: 00_STRUCTURE_LOCALE.md

Action:
- Créer dossier local "suivi-ruches"
- Créer sous-dossiers (.github/workflows, scripts, src)
- Télécharger les fichiers depuis /outputs
- Créer fichiers manuels (.gitignore, README.md)
```

### Étape 1.2: Vérifier la structure
```bash
cd suivi-ruches
find . -type f
```

Doit afficher tous les fichiers listés dans `00_STRUCTURE_LOCALE.md`.

### Étape 1.3: Initialiser git localement
```bash
git init
git add .
git status
# Vérifier que tous les fichiers sont listés
```

✅ **Phase 1 terminée!**

---

## **PHASE 2: GITHUB** (30 minutes)

### Étape 2.1: Lire le guide GitHub
```
Lire: 01_GITHUB_STEPS.md

Cet article donne les étapes EXACTES pour:
- Créer compte GitHub (si besoin)
- Créer le repo
- Configurer les secrets
- Générer les clés SSH
- Tester le workflow
```

### Étape 2.2: Suivre les étapes 1-5 de `01_GITHUB_STEPS.md`
- Étape 1: Créer compte GitHub
- Étape 2: Créer repo "suivi-ruches"
- Étape 3: Configuration git local
- Étape 4: Vérifier sur GitHub
- Étape 5: Configurer les secrets

### Étape 2.3: Générer les clés SSH (Étape 6)
```bash
# Sur serveur Yunohost
ssh admin@nuuull.org
# Suivre l'étape 6 de 01_GITHUB_STEPS.md
```

### Étape 2.4: Ajouter les secrets GitHub (Étape 5)
```
GitHub → Settings → Secrets and variables → Actions
```

Ajouter:
- `DEPLOY_PRIVATE_KEY` (clé SSH privée)
- `ANTHROPIC_API_KEY` (sk-ant-...)

### Étape 2.5: Tester le workflow (Étape 7)
```bash
# Local
git push origin main

# Voir sur GitHub
GitHub → Actions → Voir le workflow
```

✅ **Phase 2 terminée!**

---

## **PHASE 3: YUNOHOST** (1-2 heures)

### Étape 3.1: Lire le guide Yunohost
```
Lire: YUNOHOST_DEPLOYMENT.md

Cet article donne les étapes pour:
- Créer le domaine bee.nuuull.org
- Installer sur Yunohost
- Configurer Nginx
- Démarrer le service
- Vérifier l'accès HTTPS
```

### Étape 3.2: Préparer le serveur Yunohost
```bash
ssh admin@nuuull.org

# Créer le domaine
yunohost domain add bee.nuuull.org

# Créer le dossier
sudo mkdir -p /opt/yunohost/suivi-ruches
```

### Étape 3.3: Récupérer le code depuis GitHub
```bash
# Option A: git clone
cd /opt/yunohost/suivi-ruches
sudo git clone https://github.com/tonnom/suivi-ruches .

# Option B: zip download (si pas git)
# Télécharger ZIP depuis GitHub
# Extraire dans /opt/yunohost/suivi-ruches
```

### Étape 3.4: Configurer et démarrer
```bash
# Suivre YUNOHOST_DEPLOYMENT.md étape par étape

# En résumé:
sudo npm install --production
sudo cp .env.example .env
# Éditer .env avec votre ANTHROPIC_API_KEY

# Créer le service systemd
sudo nano /etc/systemd/system/suivi-ruches.service
# Copier le contenu de YUNOHOST_DEPLOYMENT.md

# Configurer Nginx
sudo nano /etc/nginx/conf.d/suivi-ruches.conf

# Démarrer
sudo systemctl daemon-reload
sudo systemctl enable suivi-ruches
sudo systemctl start suivi-ruches

# Tester
curl http://localhost:3000
curl https://bee.nuuull.org
```

✅ **Phase 3 terminée!**

---

## **PHASE 4: PRODUCTIF** (quotidien)

### Cycle normal de développement

```
Vous êtes à la ruche
    ↓
1. Utiliser l'app (template + dictée + photos)
2. Observer et enregistrer
    ↓
Rentré à la maison
    ↓
3. Améliorer l'app (si besoin)
4. Faire un commit local: git commit -m "..."
5. Pousser: git push origin main
    ↓
GitHub Actions s'exécute automatiquement
    ↓
Yunohost déployé automatiquement
    ↓
bee.nuuull.org reflète les changements ✅
```

### Commandes quotidiennes
```bash
# Améliorer l'app localement
vim src/suivi-ruches-v1.4.0.html

# Tester en local
npm start
# Aller sur http://localhost:3000

# Quand satisfait
git add .
git commit -m "Add feature X"
git push origin main

# Attendre 3-5 min
# Vérifier que c'est live sur bee.nuuull.org
curl https://bee.nuuull.org
```

---

## 📚 **Autres guides (consultez au besoin)**

### Pour plus de détails:
- **GUIDE_V1.4.md** - Comment utiliser dictée + template
- **CHANGELOG.md** - Historique des versions
- **GITHUB_PIPELINE_SETUP.md** - Détails sur CI/CD
- **README_V1.4.md** - Infos v1.4

---

## 🎯 **Checklist rapide**

### Avant PHASE 2 (GitHub):
- [ ] Dossier local complet
- [ ] Git initialisé (`git init`)
- [ ] Tous les fichiers stagés (`git add .`)
- [ ] Première version du code en local

### Avant PHASE 3 (Yunohost):
- [ ] Compte GitHub créé
- [ ] Repo créé et code pushé
- [ ] Secrets ajoutés (DEPLOY_PRIVATE_KEY, ANTHROPIC_API_KEY)
- [ ] Clés SSH générées et autorisées

### Avant PHASE 4 (Productif):
- [ ] App accessible sur bee.nuuull.org
- [ ] Service systemd running
- [ ] Nginx configuré
- [ ] Certificat SSL actif
- [ ] Pipeline testée (au moins 1 déploiement réussi)

---

## ⏱️ **Timing estimé**

```
Phase 1 (Préparation):     30 min
Phase 2 (GitHub):           30 min
Phase 3 (Yunohost):       1-2 heures
────────────────────────────────────
TOTAL:                    2-3 heures

Après: Améliorations quotidiennes (5-10 min chacune)
```

---

## ❓ **Vous avez une question sur une phase?**

Consultez le guide correspondant:

```
"Comment télécharger les fichiers?"
→ 00_STRUCTURE_LOCALE.md

"Comment créer le repo GitHub?"
→ 01_GITHUB_STEPS.md

"Comment utiliser la dictée vocale?"
→ GUIDE_V1.4.md

"Comment déployer sur Yunohost?"
→ YUNOHOST_DEPLOYMENT.md

"Comment configurer la pipeline?"
→ GITHUB_PIPELINE_SETUP.md

"Qu'y a-t-il de nouveau en v1.4?"
→ README_V1.4.md ou CHANGELOG.md
```

---

## 🚀 **Vous êtes prêt?**

### Commencez ici:

**Étape 1:** Lire `00_STRUCTURE_LOCALE.md` (5 min)
**Étape 2:** Télécharger et organiser les fichiers (10 min)
**Étape 3:** Lire `01_GITHUB_STEPS.md` (10 min)
**Étape 4:** Créer le repo GitHub (15 min)
**Étape 5:** Configurer Yunohost (1-2 heures)

---

## 💡 **Tips importants**

✅ **Lisez d'abord** - Ne pas sauter les guides
✅ **Faites étape par étape** - Ne pas tout faire à la fois
✅ **Testez localement** - Avant de pousser
✅ **Consultez les logs** - En cas de problème (F12 ou journalctl)
✅ **Gardez les secrets privés** - Jamais commiter .env réel

---

## 🐝 **Maintenant, lancez-vous!**

Commencez par lire: **`00_STRUCTURE_LOCALE.md`**

Bonne chance! 🚀

---

*Suivi Ruches v1.4.0 - App apicole avec IA et dictée vocale*
*Créé avril 2025*

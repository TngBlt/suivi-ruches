# 🐝 Suivi Ruches v1.4.0

**Application de suivi apicole avec IA et dictée vocale**

---

## ✨ Quoi de neuf en v1.4?

### 📋 **Template d'observation guidée**
Checklist structurée pour ne rien oublier:
- État des cadres initiaux
- Couvain (surface, stade, régularité)
- Réserves (pollen, miel)
- Force de la colonie
- Reine (présence, état, ponte)
- Santé (varroas, maladies, comportement)

### 🎤 **Dictée vocale mains libres**
Enregistrez vos observations en parlant:
- Speech-to-Text en français
- Transcription en temps réel
- Idéal quand les mains sont occupées
- Support multi-navigateur

### 🧠 **IA Claude intégrée**
- **Dr. Abeille** pour les questions apicoles
- **Flore & Faune** pour identifier les espèces
- Analyse des photos en direct

### 📸 **Photos dans les interventions**
- Upload multiple par intervention
- Galerie avec visualisation fullscreen
- Stockage sécurisé (localStorage)

---

## 🚀 **Démarrage rapide**

### Installation locale

```bash
# 1. Installer Node.js (si pas déjà)
# https://nodejs.org/

# 2. Télécharger les fichiers
mkdir suivi-ruches
cd suivi-ruches

# Copier:
# - suivi-ruches-v1.4.0.html
# - server.js
# - package.json
# - .env.example

# 3. Obtenir clé API Anthropic
# https://console.anthropic.com/

# 4. Créer .env
cp .env.example .env
# Éditer et ajouter: ANTHROPIC_API_KEY=sk-ant-...

# 5. Installer et démarrer
npm install
export ANTHROPIC_API_KEY="sk-ant-..."
npm start

# 6. Accéder
# http://localhost:3000
```

---

## 📖 **Guide complet**

Voir **GUIDE_V1.4.md** pour:
- Tutorial complet de la dictée vocale
- Exemples d'utilisation
- Bonnes pratiques
- Troubleshooting

```bash
cat GUIDE_V1.4.md
```

---

## 📝 **Changelog**

Voir **CHANGELOG.md** pour l'historique complet.

**v1.4.0:** Template + Dictée + Photos
**v1.3.0:** IA + Inventaire complet
**v1.2.0:** Gestion cadres + Interventions
**v1.1.0:** Ruches + Alertes
**v1.0.0:** Version initiale

---

## 🎯 **Fonctionnalités**

### Gestion des ruches
- ✅ Ruches Dadant 8-10 cadres
- ✅ État de colonie (Active, Faible, Essaimage)
- ✅ Suivi reine + cadres habités
- ✅ Compteur varroas quotidien

### Visualisation cadres
- ✅ Grille visuelle (8-10 cadres)
- ✅ Types: Couvain, Réserve, Nouveau, Vide, Partition
- ✅ Options détaillées par cadre
- ✅ Édition rapide

### Journal d'interventions
- ✅ Types variés: Observation, Traitement, Récolte, etc.
- ✅ **NEW:** Template guidé + dictée vocale
- ✅ **NEW:** Photos multiples par intervention
- ✅ Date/heure modifiables
- ✅ Tri par date

### IA intégrée
- ✅ **Dr. Abeille** - Questions apicoles
- ✅ **Flore & Faune** - Analyse environnement
- ✅ Vision Claude pour photos
- ✅ Résumé compilé d'environnement

### Inventaire
- ✅ Cadres (total, filés, cirés corps/hausse)
- ✅ Ruches & équipements
- ✅ Nourriture (sirop, candy)
- ✅ Matières premières
- ✅ Accessoires consommables

### Données
- ✅ localStorage persistence
- ✅ Pas d'upload automatique
- ✅ Toutes les données restent locales

---

## 🔒 **Sécurité**

### Clé API
- ✅ Stockée en variable d'environnement
- ✅ Jamais exposée au navigateur
- ✅ Proxy serveur pour sécurité
- ✅ Pas de transmission données sensibles

### Données
- ✅ localStorage sécurisé
- ✅ Pas de cloud par défaut
- ✅ Backup local (localStorage)

---

## 🌍 **Déploiement Yunohost**

Pour deployer sur `bee.nuuull.org`:

1. Voir **YUNOHOST_DEPLOYMENT.md**
2. Ou utiliser **GitHub Actions Pipeline**

```bash
# Cloner + configurer
git clone https://github.com/tonnom/suivi-ruches
cd suivi-ruches

# Suivre le guide
cat YUNOHOST_DEPLOYMENT.md
```

---

## 🔄 **CI/CD GitHub**

Pour pipeline automatisé:

1. Créer repo GitHub
2. Voir **GITHUB_PIPELINE_SETUP.md**
3. Tests + Déploiement automatiques

---

## 💻 **Prérequis**

### Pour utilisation locale
- ✅ Node.js 14+
- ✅ Navigateur moderne
- ✅ Clé API Anthropic

### Pour Speech-to-Text
- ✅ Chrome/Edge/Safari (meilleur support)
- ✅ Micro fonctionnel
- ✅ Connexion Internet

---

## 📊 **Architecture**

```
Frontend (HTML5/CSS/JS)
    ↓ fetch
Serveur Node.js (localhost:3000)
    ↓ HTTPS
Claude API (Sonnet 4)
    ↓
Réponses IA + Vision
```

---

## 🎓 **Utilisation type**

### Observation rapide (5 min)
1. Ouvrir Journal Interventions
2. Type: Observation
3. Afficher Template 📋
4. Dicter l'observation 🎤
5. Ajouter photo 📸
6. Enregistrer ✓

### Résultat: Observation riche avec contexte

---

## 🔧 **Configuration avancée**

### Variables d'environnement
```
ANTHROPIC_API_KEY=sk-ant-...  # Clé API (REQUIS)
NODE_ENV=production            # Mode production
PORT=3000                       # Port serveur
```

### Fichiers config
- `.env` - Variables sensibles (à créer)
- `package.json` - Dépendances + scripts
- `server.js` - Serveur proxy Node.js

---

## 🐛 **Dépannage**

### "Cannot connect to localhost:3000"
```bash
# Vérifier serveur démarré
npm start

# Vérifier port libre
lsof -i :3000
```

### Dictée ne fonctionne pas
```bash
# Vérifier navigateur (Chrome/Edge = meilleur)
# Vérifier micro actif
# Vérifier langue = Français
# Vérifier console (F12) pour erreurs
```

### IA répond lentement
```bash
# Normal première requête (démarrage)
# Requêtes suivantes = plus rapides
# Vérifier connexion Internet
```

### localStorage pleine (photos)
```bash
# Supprimer anciennes observations
# Ou archiver les données
# Exporter en PDF avant suppression
```

---

## 📱 **Mobile-first**

- ✅ Responsive design
- ✅ Optimisé pour téléphone
- ✅ Dicatée vocale sur mobile
- ✅ Meilleure expérience sur petit écran

---

## 📚 **Documentation**

| Document | Contenu |
|----------|---------|
| **GUIDE_V1.4.md** | Tutorial complet + exemples |
| **CHANGELOG.md** | Historique des versions |
| **YUNOHOST_DEPLOYMENT.md** | Déployer sur Yunohost |
| **GITHUB_PIPELINE_SETUP.md** | CI/CD automatisé |
| **README.md** (ce fichier) | Vue d'ensemble |

---

## 🚀 **Prochaines étapes**

Vous êtes prêt!

1. **Installer localement** (voir Démarrage rapide)
2. **Tester les fonctionnalités**
3. **Lire GUIDE_V1.4.md** pour la dictée
4. **Aller observer une ruche**
5. **Enregistrer une observation complète**

---

## 📞 **Support**

### Si erreur
1. Vérifier la console (F12 → Console)
2. Lire le guide complet
3. Essayer avec un autre navigateur
4. Redémarrer l'app

### Questions apicoles
Utiliser **Dr. Abeille 🧠** dans l'app!

---

## 📄 **Licence**

MIT - Libre d'utilisation et modification

---

## 🎯 **Checklist avant utilisation**

- [ ] Node.js installé (`node --version`)
- [ ] Dépendances installées (`npm install`)
- [ ] `.env` créé avec ANTHROPIC_API_KEY
- [ ] Serveur démarre (`npm start`)
- [ ] App accessible (http://localhost:3000)
- [ ] Template s'affiche (bouton 📋)
- [ ] Dictée fonctionne (bouton 🎤, parler)
- [ ] Photos s'uploadent (bouton 📸)
- [ ] IA répond (Dr. Abeille 🧠)

---

## 🐝 **Happy beekeeping!**

Bon suivi apicole avec la v1.4! 🎉

Pour des questions, consultez le guide complet ou Dr. Abeille.

---

**v1.4.0** - Avril 2025
Template observation + Dictée vocale

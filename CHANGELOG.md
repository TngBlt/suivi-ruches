# 📝 CHANGELOG

## [1.4.0] - 2025-04-26

### ✨ **Nouvelles fonctionnalités**

#### 📋 Template d'observation guidée
- **Template intelligent** avec checklist d'observation:
  - État des cadres initiaux (bâti régulier, dense)
  - Couvain (surface, stade: œufs, larves, operculé)
  - Réserves (pollen, miel, vides)
  - Force générale de la colonie
  - Reine (présence, jeunesse, ponte)
  - Santé (varroas, maladies, comportement)
- Accessible via bouton **📋 Template** dans le formulaire
- Affichage/masquage dynamique

#### 🎤 Enregistrement vocal (Speech-to-Text)
- **Dictée vocale** pour les observations en mains libres
- Bouton 🎤 **Dictée** pour commencer
- Bouton ⏹️ **Arrêter** pour terminer
- Transcription en direct (français)
- Parfait pour observer les cadres avec les mains occupées
- Annulation automatique en cas d'erreur

#### 📸 Photos dans les interventions
- Upload multiple de photos par intervention
- Aperçu des miniatures
- Affichage fullscreen au clic
- Stockage en base64 (localStorage)

#### 🧠 IA intégrée
- **Dr. Abeille** - Expert apiculture (Claude API)
- **Flore & Faune** - Analyse des plantes et insectes
  - Texte: identification mellifère
  - Photos: vision Claude pour reconnaissance d'espèces
- Réponses contextualisées pour apiculture douce
- Résumé environnement compilé

#### ⏰ Heure simplifiée
- Saisie d'heure sans minutes (00h à 23h)
- Date pré-remplie (modifiable)
- Format stockage: JJ/MM/AAAA HH:00

#### 📋 Inventaire amélioré
- **Cadres:** Total, filés, cirés corps, cirés hausse
- **Ruches & équipements:** Complètes, ruchettes, grilles reine, partitions
- **Nourriture:** Sirop (L), Candy (kg)
- **Matières premières:** Feuilles de cire
- **Accessoires:** Nourrisseurs
- Structure organisée par catégories

### 🔧 **Améliorations techniques**

- ✅ Serveur Node.js avec proxy API Anthropic
- ✅ CORS contourné via serveur local
- ✅ localStorage pour persistence complète
- ✅ Responsive mobile-first
- ✅ Sans dépendances externes (HTML5 pur)

### 📊 **Architecture**

```
Frontend (HTML5/CSS/JS)
    ↓
Serveur Node.js (localhost:3000)
    ↓ (HTTPS + clé API sécurisée)
Claude API (Sonnet 4)
    ↓
Réponses IA contextualisées
```

### 🔐 **Sécurité**

- ✅ Clé API Anthropic en variables d'environnement
- ✅ Pas d'exposition au navigateur
- ✅ localStorage sécurisé (données locales)
- ✅ Pas de transmission données sensibles

---

## [1.3.0] - 2025-04-25

### ✨ Fonctionnalités

- Gestion des ruches (état, reine, cadres, varroas)
- Visualisation des cadres (type, options)
- Journal d'interventions détaillé
- Inventaire simplifié
- Dr. Abeille (mode démo)
- Flore & Faune (mode démo)
- Résumé environnement

### 🔧 Améliorations

- Interface complète Tableau de Bord
- Menu sandwich navigation
- Alerts automatiques (essaimage, varroas, colonie faible)
- localStorage persistence

---

## [1.2.0] - 2025-04-20

### ✨ Fonctionnalités

- Système de cadres avec types et options
- Gestion dynamique des interventions
- Support de multiples types d'interventions

---

## [1.1.0] - 2025-04-15

### ✨ Fonctionnalités

- Création/gestion de ruches
- Tableau de bord basique
- Système d'alertes

---

## [1.0.0] - 2025-04-10

### ✨ Fonctionnalités initiales

- Gestion de ruches Dadant
- Interface mobile-first
- localStorage persistence
- Navigation basique

---

## 📝 Notes de version

### Pour mettre à niveau de 1.3.0 à 1.4.0:

1. **Télécharger la v1.4** (suivi-ruches-v4.html)
2. **Remplacer** l'ancienne version
3. **Navigateur compatible** requis pour Speech-to-Text:
   - ✅ Chrome/Chromium (meilleur support)
   - ✅ Edge
   - ✅ Safari 14.1+
   - ⚠️ Firefox (support limité)

### Clé API Claude toujours requise

```bash
# Démarrer le serveur
export ANTHROPIC_API_KEY="sk-ant-..."
npm start

# Accès
http://localhost:3000
```

---

## 🚀 Prochaines étapes (v1.5)

- [ ] Exporter données en PDF/CSV
- [ ] Synchronisation entre appareils
- [ ] Notifications push
- [ ] Graphiques analytiques (varroas trend)
- [ ] Gestion multi-ruchers
- [ ] Intégration capteurs (température, balance)
- [ ] Mode sombre
- [ ] Support offline complet

---

## 🐛 Signaler un bug

Si vous trouvez un bug:
1. Noter les étapes pour le reproduire
2. Vérifier la console (F12)
3. Copier les logs
4. Créer une issue GitHub

---

## 📄 Licence

MIT - Libre d'utilisation et modification

---

## 🙏 Remerciements

- Claude (Anthropic) pour l'IA
- Yunohost pour le hosting
- Vous pour utiliser l'app!

🐝 Happy beekeeping!

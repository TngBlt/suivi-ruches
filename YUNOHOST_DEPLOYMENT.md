# 🐝 Déploiement Suivi Ruches sur Yunohost

## 📋 Prérequis

- ✅ Yunohost installé sur nuuull.org
- ✅ Domaine nuuull.org configuré
- ✅ Clé API Anthropic (sk-ant-...)
- ✅ Accès SSH au serveur (optionnel mais recommandé)

---

## 🚀 Méthode 1: Installation manuelle (Recommandée pour début)

### Étape 1: Préparer les fichiers

Sur votre ordinateur local:
```bash
mkdir -p suivi-ruches
cd suivi-ruches

# Télécharger les 4 fichiers:
# - suivi-ruches-v4.html
# - server.js
# - package.json
# - .env (voir plus bas)
```

Créer un fichier `.env`:
```
ANTHROPIC_API_KEY=sk-ant-votre_clé_api_ici
NODE_ENV=production
PORT=3000
```

### Étape 2: Créer le domaine/sous-domaine dans Yunohost

**Via interface web:**
1. Aller à: `https://nuuull.org/admin`
2. Menu: **Domaines**
3. Cliquer: **+ Ajouter un domaine**
4. Entrer: `bee.nuuull.org`
5. Valider

Ou **via SSH:**
```bash
ssh admin@nuuull.org
yunohost domain add bee.nuuull.org
```

### Étape 3: Créer le répertoire d'installation

Via SSH:
```bash
ssh admin@nuuull.org

# Créer le dossier
sudo mkdir -p /opt/yunohost/suivi-ruches
cd /opt/yunohost/suivi-ruches

# Copier les fichiers (via SCP ou git clone)
# Option 1: Via git (si en repo)
sudo git clone https://github.com/tanguy/suivi-ruches .

# Option 2: Via SCP
# (depuis votre ordinateur)
scp -r suivi-ruches/* admin@nuuull.org:/tmp/
# (puis sur le serveur)
sudo mv /tmp/* /opt/yunohost/suivi-ruches/
```

### Étape 4: Installer les dépendances

Via SSH:
```bash
cd /opt/yunohost/suivi-ruches
sudo npm install --production
```

### Étape 5: Créer le service systemd

Créer `/etc/systemd/system/suivi-ruches.service`:
```bash
sudo nano /etc/systemd/system/suivi-ruches.service
```

Copier:
```ini
[Unit]
Description=Suivi Ruches - Beekeeping App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/yunohost/suivi-ruches
EnvironmentFile=/opt/yunohost/suivi-ruches/.env
ExecStart=/usr/bin/node /opt/yunohost/suivi-ruches/server.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Valider:
```bash
Ctrl+O, Entrée, Ctrl+X
```

### Étape 6: Activer le service

```bash
sudo systemctl daemon-reload
sudo systemctl enable suivi-ruches
sudo systemctl start suivi-ruches

# Vérifier le statut
sudo systemctl status suivi-ruches
```

### Étape 7: Configurer Nginx comme proxy

Créer `/etc/nginx/conf.d/suivi-ruches.conf`:
```bash
sudo nano /etc/nginx/conf.d/suivi-ruches.conf
```

Copier:
```nginx
upstream suivi_ruches_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name bee.nuuull.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bee.nuuull.org;

    # Certificats SSL Yunohost
    ssl_certificate /etc/letsencrypt/live/bee.nuuull.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bee.nuuull.org/privkey.pem;

    client_max_body_size 100M;

    location / {
        proxy_pass http://suivi_ruches_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Sauvegarder et tester:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Étape 8: Vérifier que tout fonctionne

```bash
# Vérifier que le service tourne
sudo systemctl status suivi-ruches

# Voir les logs
sudo journalctl -u suivi-ruches -f

# Tester en local
curl http://localhost:3000

# Tester via HTTPS (de votre ordinateur)
curl https://bee.nuuull.org
```

### Étape 9: Accéder à l'app

Ouvrir dans le navigateur:
```
https://bee.nuuull.org
```

---

## 🔧 Gestion courante

### Voir les logs en direct
```bash
sudo journalctl -u suivi-ruches -f
```

### Redémarrer l'app
```bash
sudo systemctl restart suivi-ruches
```

### Arrêter l'app
```bash
sudo systemctl stop suivi-ruches
```

### Mettre à jour l'app
```bash
cd /opt/yunohost/suivi-ruches
sudo git pull  # Si en repo git
sudo npm install
sudo systemctl restart suivi-ruches
```

### Voir l'utilisation des ressources
```bash
sudo systemctl status suivi-ruches
ps aux | grep node
```

---

## 🐛 Dépannage

### L'app ne démarre pas
```bash
# Vérifier les logs
sudo journalctl -u suivi-ruches -n 50

# Vérifier que Node.js est installé
which node

# Tester le fichier server.js
cd /opt/yunohost/suivi-ruches
node server.js
```

### Port déjà utilisé
```bash
# Trouver ce qui utilise le port 3000
lsof -i :3000

# Ou changer le port dans:
# - server.js: const PORT = 3001;
# - nginx.conf: server 127.0.0.1:3001;
```

### Certificat SSL manquant
Yunohost génère les certificats automatiquement. Si absent:
```bash
sudo yunohost domain add bee.nuuull.org
```

### App très lente
```bash
# Vérifier l'usage CPU/RAM
top

# Redémarrer
sudo systemctl restart suivi-ruches
```

---

## 🔐 Sécurité

### Le fichier .env doit rester privé!
```bash
sudo chmod 600 /opt/yunohost/suivi-ruches/.env
sudo chown www-data:www-data /opt/yunohost/suivi-ruches/.env
```

### Ne pas commiter la clé API
Si vous versionez en git:
```bash
echo ".env" >> .gitignore
git rm --cached .env
```

### Backup régulier
```bash
# Sauvegarder la base données et la config
sudo tar czf suivi-ruches-backup.tar.gz /opt/yunohost/suivi-ruches/
```

---

## 📊 Vérification finale

```bash
# ✅ Le service est actif
sudo systemctl is-active suivi-ruches

# ✅ Nginx est configuré
sudo nginx -t

# ✅ Le port 3000 est utilisé
sudo netstat -tulpn | grep 3000

# ✅ Accès HTTPS fonctionnel
curl -I https://bee.nuuull.org

# ✅ La clé API est configurée
grep ANTHROPIC_API_KEY /opt/yunohost/suivi-ruches/.env
```

---

## 🎯 Résumé de l'architecture

```
bee.nuuull.org (HTTPS)
    ↓ Yunohost SSL
Nginx (reverse proxy, port 443)
    ↓
127.0.0.1:3000 (privé, Node.js)
    ↓ HTTPS
API Anthropic
    ↓
Claude AI
```

---

## 📞 Support

- **Logs Yunohost:** `/var/log/yunohost/`
- **Logs App:** `journalctl -u suivi-ruches`
- **Documentation Yunohost:** https://yunohost.org/fr/

Bon déploiement! 🐝🚀

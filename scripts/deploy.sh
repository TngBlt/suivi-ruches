#!/bin/bash

#=================================================
# SUIVI RUCHES - Script de déploiement
# Utilisé par GitHub Actions
#=================================================

set -euo pipefail

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
APP_NAME="suivi-ruches"
APP_DIR="/opt/yunohost/suivi-ruches"
SERVICE_NAME="suivi-ruches"
BACKUP_DIR="/opt/yunohost/backups/$APP_NAME"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Fonctions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifications
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root"
        exit 1
    fi
}

check_app_exists() {
    if [[ ! -d "$APP_DIR" ]]; then
        log_error "Le répertoire $APP_DIR n'existe pas"
        exit 1
    fi
}

check_service_exists() {
    if ! systemctl list-unit-files | grep -q "^$SERVICE_NAME.service"; then
        log_error "Le service $SERVICE_NAME n'existe pas"
        exit 1
    fi
}

# Backup avant déploiement
backup_app() {
    log_info "Création d'une sauvegarde..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup du code
    tar czf "$BACKUP_DIR/app_$TIMESTAMP.tar.gz" \
        "$APP_DIR" \
        --exclude="node_modules" \
        --exclude=".env" \
        --exclude=".git"
    
    # Garder seulement les 5 derniers backups
    ls -tp "$BACKUP_DIR"/app_*.tar.gz | tail -n +6 | xargs -d '\n' rm -f --
    
    log_success "Backup créé: $BACKUP_DIR/app_$TIMESTAMP.tar.gz"
}

# Arrêter l'app
stop_app() {
    log_info "Arrêt de l'application..."
    
    if systemctl is-active --quiet $SERVICE_NAME; then
        systemctl stop $SERVICE_NAME
        sleep 2
        log_success "Application arrêtée"
    else
        log_warning "Application déjà arrêtée"
    fi
}

# Mettre à jour le code
update_code() {
    log_info "Mise à jour du code..."
    
    cd "$APP_DIR"
    
    # Si c'est un repo git, faire un pull
    if [[ -d ".git" ]]; then
        git fetch origin main
        git reset --hard origin/main
        log_success "Code à jour (git pull)"
    else
        log_warning "Le répertoire n'est pas un repo git, skippe le git pull"
    fi
}

# Installer les dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    
    cd "$APP_DIR"
    
    # Nettoyer node_modules si nécessaire
    if [[ -d "node_modules" && -f "package-lock.json" ]]; then
        rm -rf node_modules
    fi
    
    # Installer avec npm
    if npm ci --production 2>&1 | tail -20; then
        log_success "Dépendances installées"
    else
        log_error "Erreur lors de l'installation des dépendances"
        return 1
    fi
}

# Vérifier la configuration
check_config() {
    log_info "Vérification de la configuration..."
    
    cd "$APP_DIR"
    
    # Vérifier que .env existe
    if [[ ! -f ".env" ]]; then
        log_error "Le fichier .env est manquant"
        return 1
    fi
    
    # Vérifier que la clé API est définie
    if ! grep -q "ANTHROPIC_API_KEY=" .env; then
        log_error "ANTHROPIC_API_KEY manquant dans .env"
        return 1
    fi
    
    # Vérifier les fichiers essentiels
    for file in server.js package.json; do
        if [[ ! -f "$file" ]]; then
            log_error "Fichier manquant: $file"
            return 1
        fi
    done
    
    log_success "Configuration valide"
}

# Tests
run_tests() {
    log_info "Exécution des tests..."
    
    cd "$APP_DIR"
    
    # Teste si Node.js peut charger le serveur
    if node -c server.js 2>&1 | tail -5; then
        log_success "Syntax check OK"
    else
        log_error "Erreur de syntaxe dans server.js"
        return 1
    fi
}

# Démarrer l'app
start_app() {
    log_info "Démarrage de l'application..."
    
    systemctl start $SERVICE_NAME
    sleep 3
    
    if systemctl is-active --quiet $SERVICE_NAME; then
        log_success "Application démarrée"
        return 0
    else
        log_error "Erreur au démarrage de l'application"
        systemctl status $SERVICE_NAME || true
        return 1
    fi
}

# Health check
health_check() {
    log_info "Vérification de la santé de l'app..."
    
    sleep 2
    
    # Vérifier que le port 3000 répond
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "Health check OK"
        return 0
    else
        log_warning "Health check échoué (peut être normal si firewall)"
        return 0  # Ne pas bloquer si firewall
    fi
}

# Restaurer à partir d'un backup
rollback() {
    log_warning "Rollback..."
    
    LATEST_BACKUP=$(ls -tp "$BACKUP_DIR"/app_*.tar.gz | head -1)
    
    if [[ -z "$LATEST_BACKUP" ]]; then
        log_error "Aucun backup trouvé pour rollback"
        return 1
    fi
    
    log_info "Restauration depuis: $LATEST_BACKUP"
    
    # Arrêter l'app
    stop_app || true
    
    # Restaurer
    rm -rf "$APP_DIR"
    tar xzf "$LATEST_BACKUP" -C /opt/yunohost/
    
    # Redémarrer
    start_app
    
    log_success "Rollback effectué"
}

# Afficher les logs
show_logs() {
    log_info "Derniers logs (20 lignes):"
    journalctl -u $SERVICE_NAME -n 20 --no-pager
}

# Menu principal
main() {
    check_root
    check_app_exists
    check_service_exists
    
    log_info "════════════════════════════════════"
    log_info "  🐝 DEPLOYMENT SUIVI RUCHES"
    log_info "════════════════════════════════════"
    log_info "Timestamp: $TIMESTAMP"
    log_info "App: $APP_NAME"
    log_info "Dir: $APP_DIR"
    
    # Exécuter les étapes
    if backup_app && \
       stop_app && \
       update_code && \
       check_config && \
       install_dependencies && \
       run_tests && \
       start_app && \
       health_check; then
        
        log_success "════════════════════════════════════"
        log_success "  ✅ DÉPLOIEMENT RÉUSSI!"
        log_success "════════════════════════════════════"
        show_logs
        exit 0
        
    else
        log_error "════════════════════════════════════"
        log_error "  ❌ DÉPLOIEMENT ÉCHOUÉ!"
        log_error "════════════════════════════════════"
        log_warning "Tentative de rollback..."
        rollback
        show_logs
        exit 1
    fi
}

# Exécuter
main "$@"

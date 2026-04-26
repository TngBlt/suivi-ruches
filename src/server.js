const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// Use PORT from environment (YunoHost-friendly), default to 3000
const PORT = process.env.PORT || 3000;

// Récupérer la clé API depuis les variables d'environnement
const API_KEY = process.env.ANTHROPIC_API_KEY;

// Warn but don't exit if API key is missing - allows the app to work without AI features
if (!API_KEY) {
    console.warn('⚠️  AVERTISSEMENT: Variable ANTHROPIC_API_KEY non définie!');
    console.warn('Les fonctionnalités IA (Dr. Abeille, Flore & Faune) seront désactivées.');
    console.warn('Pour activer l\'IA:');
    console.warn('  - macOS/Linux: export ANTHROPIC_API_KEY="sk-ant-..."');
    console.warn('  - Windows: set ANTHROPIC_API_KEY=sk-ant-...');
    console.warn('');
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Servir les fichiers statiques (HTML, CSS, JS, images)
app.use(express.static(path.dirname(__filename)));

// Endpoint de santé pour les health checks
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        version: '1.4.0',
        ai_enabled: !!API_KEY 
    });
});

// Endpoint pour Claude API (texte)
app.post('/api/claude', async (req, res) => {
    if (!API_KEY) {
        return res.status(503).json({ 
            error: 'Les fonctionnalités IA ne sont pas configurées sur ce serveur.' 
        });
    }
    
    try {
        const { message, system } = req.body;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                system: system,
                messages: [
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error?.message || 'Erreur API Claude' 
            });
        }

        const textContent = data.content.find(block => block.type === 'text');
        res.json({ response: textContent?.text || 'Pas de réponse' });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint pour Claude Vision (photos)
app.post('/api/claude-vision', async (req, res) => {
    if (!API_KEY) {
        return res.status(503).json({ 
            error: 'Les fonctionnalités IA ne sont pas configurées sur ce serveur.' 
        });
    }
    
    try {
        const { imageBase64, prompt, system } = req.body;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                system: system,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image',
                                source: {
                                    type: 'base64',
                                    media_type: 'image/jpeg',
                                    data: imageBase64
                                }
                            },
                            {
                                type: 'text',
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error?.message || 'Erreur API Claude' 
            });
        }

        const textContent = data.content.find(block => block.type === 'text');
        res.json({ response: textContent?.text || 'Pas de réponse' });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`\n✅ Serveur démarré sur http://127.0.0.1:${PORT}`);
    console.log(`🐝 Apiculture App disponible`);
    if (API_KEY) {
        console.log('🧠 Fonctionnalités IA activées');
    } else {
        console.log('⚠️  Fonctionnalités IA désactivées (pas de clé API)');
    }
    console.log('');
});

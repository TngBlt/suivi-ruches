const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Récupérer la clé API depuis les variables d'environnement
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
    console.error('❌ ERREUR: Variable ANTHROPIC_API_KEY non définie!');
    console.error('Définissez votre clé API:');
    console.error('  macOS/Linux: export ANTHROPIC_API_KEY="sk-ant-..."');
    console.error('  Windows: set ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Servir le fichier HTML
app.use(express.static(path.dirname(__filename)));

// Endpoint pour Claude API (texte)
app.post('/api/claude', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`\n✅ Serveur démarré sur http://localhost:${PORT}`);
    console.log(`🐝 Apiculture App disponible\n`);
});

// ========================================
// server.js - Servidor WebSocket CORREGIDO
// ========================================

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// ✅ LÍNEA IMPORTANTE - Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ✅ RUTA RAÍZ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let hackModeActive = false;
const connectedClients = new Map();

console.log('🚀 Iniciando servidor...');

wss.on('connection', (ws) => {
    const clientId = Math.random().toString(36).substr(2, 9);
    connectedClients.set(clientId, ws);
    
    console.log(`✅ Cliente conectado: ${clientId} (Total: ${connectedClients.size})`);
    
    // Enviar estado actual al conectar
    ws.send(JSON.stringify({ 
        type: 'hackModeStatus', 
        active: hackModeActive,
        clientId: clientId
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'toggleHackMode') {
                hackModeActive = data.active;
                const adminName = data.adminName || 'Admin';
                
                console.log(`🎯 Hack Mode: ${hackModeActive ? 'ACTIVADO' : 'DESACTIVADO'} por ${adminName}`);
                
                // Notificar a TODOS los clientes
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'hackModeStatus',
                            active: hackModeActive,
                            adminName: adminName,
                            timestamp: new Date().toISOString()
                        }));
                    }
                });
            }
        } catch (error) {
            console.error('❌ Error procesando mensaje:', error);
        }
    });

    ws.on('close', () => {
        connectedClients.delete(clientId);
        console.log(`❌ Cliente desconectado: ${clientId} (Total: ${connectedClients.size})`);
    });

    ws.on('error', (error) => {
        console.error(`⚠️ Error WebSocket (${clientId}):`, error.message);
    });
});

// API REST para debugging
app.get('/api/status', (req, res) => {
    res.json({
        hackMode: hackModeActive,
        connectedClients: connectedClients.size,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`🌐 Servidor escuchando en:`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Red: http://0.0.0.0:${PORT}`);
    console.log(`📡 WebSocket disponible en: ws://localhost:${PORT}`);
    console.log(`\n✅ Sistema listo. Abre múltiples navegadores/IPs para probar.`);
});

// Manejar cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    wss.clients.forEach(ws => ws.close());
    server.close(() => {
        console.log('✓ Servidor cerrado');
        process.exit(0);
    });
});
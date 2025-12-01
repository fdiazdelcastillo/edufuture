# Soluciones para Multi-Navegador & Multi-IP

## 🔴 Opción 1: WebSocket con Node.js (RECOMENDADO)

### Ventajas:
- ✅ Tiempo real instantáneo
- ✅ Funciona entre navegadores/IPs
- ✅ Profesional y escalable

### Instalación:

```bash
npm install express ws cors
```

### server.js
```javascript
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.static('public')); // Sirve tu HTML

let hackModeActive = false;

wss.on('connection', (ws) => {
    console.log('✅ Nuevo cliente conectado');
    
    // Enviar estado actual al conectar
    ws.send(JSON.stringify({ 
        type: 'hackModeStatus', 
        active: hackModeActive 
    }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'toggleHackMode') {
            hackModeActive = data.active;
            console.log('🎯 Hack Mode:', hackModeActive);
            
            // Notificar a TODOS los clientes
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'hackModeStatus',
                        active: hackModeActive,
                        role: data.role
                    }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('❌ Cliente desconectado');
    });
});

server.listen(3000, () => {
    console.log('🚀 Servidor WebSocket en http://localhost:3000');
});
```

### HTML - Cambios en JavaScript:

```javascript
// Variables globales
let ws = null;

function connectWebSocket() {
    // Detectar si es localhost o IP remota
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = 3000;
    
    ws = new WebSocket(`${protocol}//${host}:${port}`);

    ws.onopen = () => {
        console.log('✅ Conectado al servidor WebSocket');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'hackModeStatus') {
            // Si es estudiante y hack mode se activó
            if (currentUser && 
                currentUser.role !== 'Super Admin' && 
                data.active && 
                !forceLogoutInProgress) {
                console.log('🚨 ¡HACK MODE DETECTADO!');
                forceLogoutInProgress = true;
                showForceLogoutModal();
            }
            updateHackStatus();
        }
    };

    ws.onerror = (error) => {
        console.error('❌ Error WebSocket:', error);
    };

    ws.onclose = () => {
        console.log('⚠️ Desconectado del servidor');
        // Reconectar cada 5 segundos
        setTimeout(connectWebSocket, 5000);
    };
}

// Inicializar WebSocket al cargar
document.addEventListener('DOMContentLoaded', function() {
    connectWebSocket();
    // ... resto del código
});

// Reemplazar toggleHackMode
function toggleHackMode() {
    const isCurrentlyOn = /* leer estado local */;
    const newState = !isCurrentlyOn;
    
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'toggleHackMode',
            active: newState,
            role: currentUser.role
        }));
    }
}
```

---

## 🟡 Opción 2: Firebase (Sin Backend)

### Ventajas:
- ✅ No requiere servidor propio
- ✅ Gratis hasta 100 conexiones
- ✅ Fácil de implementar

### Instalación:

```html
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js"></script>

<script>
// Configurar Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto.firebaseio.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Escuchar cambios en tiempo real
function monitorHackMode() {
    db.ref('system/hackMode').on('value', (snapshot) => {
        const isActive = snapshot.val();
        
        if (currentUser && 
            currentUser.role !== 'Super Admin' && 
            isActive && 
            !forceLogoutInProgress) {
            forceLogoutInProgress = true;
            showForceLogoutModal();
        }
    });
}

// Activar Hack Mode
function toggleHackMode() {
    const isCurrentlyOn = db.ref('system/hackMode').once('value');
    const newState = !isCurrentlyOn;
    
    db.ref('system/hackMode').set(newState);
}

// Inicializar
monitorHackMode();
</script>
```

---

## 🟢 Opción 3: Polling a Backend Simple (API REST)

### Ventajas:
- ✅ Funciona con cualquier backend
- ✅ No requiere WebSocket

### Backend Node.js simple:

```javascript
const express = require('express');
const app = express();

let hackModeActive = false;

app.use(express.json());
app.use(express.static('public'));

// Endpoint GET
app.get('/api/hackMode', (req, res) => {
    res.json({ active: hackModeActive });
});

// Endpoint POST
app.post('/api/hackMode', (req, res) => {
    hackModeActive = req.body.active;
    console.log('🎯 Hack Mode:', hackModeActive);
    res.json({ success: true, active: hackModeActive });
});

app.listen(3000, () => console.log('🚀 API en http://localhost:3000'));
```

### HTML - JavaScript:

```javascript
function pollHackMode() {
    setInterval(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/hackMode');
            const data = await response.json();
            
            if (currentUser && 
                currentUser.role !== 'Super Admin' && 
                data.active && 
                !forceLogoutInProgress) {
                forceLogoutInProgress = true;
                showForceLogoutModal();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, 1000); // Verificar cada 1 segundo
}

function toggleHackMode() {
    const isCurrentlyOn = /* estado actual */;
    
    fetch('http://localhost:3000/api/hackMode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !isCurrentlyOn })
    })
    .then(r => r.json())
    .then(data => console.log('✓ Actualizado:', data));
}

// Inicializar
pollHackMode();
```

---

## 📊 COMPARATIVA

| Característica | WebSocket | Firebase | API Polling |
|---|---|---|---|
| Latencia | < 100ms | ~500ms | 500ms-1s |
| Costo | Servidor propio | Gratis* | Servidor propio |
| Setup | Medio | Muy fácil | Fácil |
| Escalabilidad | Media-Alta | Alta | Media |
| Recomendación | 👑 MEJOR | 2do | 3er |

---

## 🚀 RECOMENDACIÓN: **Usa WebSocket**

1. **Descarga Node.js**: https://nodejs.org
2. **Crea carpeta del proyecto**
3. **Copia el server.js de arriba**
4. **Ejecuta:**
   ```bash
   npm init -y
   npm install express ws cors
   node server.js
   ```
5. **Accede desde cualquier navegador:**
   - Localhost: `http://localhost:3000`
   - Otra IP: `http://192.168.x.x:3000`

✅ **Funcionará entre navegadores, IPs y dispositivos diferentes**

¿Cuál opción prefieres? Puedo generar el código completo listo para usar.

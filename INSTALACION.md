╔════════════════════════════════════════════════════════════════════╗
║           GUÍA DE INSTALACIÓN - EduVocal con WebSocket              ║
╚════════════════════════════════════════════════════════════════════╝

## 🚀 PASO 1: PREPARAR CARPETA DEL PROYECTO

```bash
mkdir eduvocal-websocket
cd eduvocal-websocket
mkdir public
```

## 📦 PASO 2: INICIALIZAR NODE.JS

```bash
npm init -y
npm install express ws cors
```

## 📝 PASO 3: CREAR ARCHIVOS

### Archivo: server.js
Copia el contenido de "server.js" (descargado)
Guarda en la raíz del proyecto

### Archivo: public/index.html
Copia el contenido de "index-websocket.html" (descargado)
Guarda en la carpeta "public/"

## ▶️ PASO 4: EJECUTAR SERVIDOR

```bash
node server.js
```

Deberías ver:
```
🚀 Iniciando servidor...
🌐 Servidor escuchando en:
   Local: http://localhost:3000
   Red: http://0.0.0.0:3000
📡 WebSocket disponible en: ws://localhost:3000
✅ Sistema listo.
```

## 🌐 PASO 5: ACCEDER DESDE NAVEGADORES

### MISMO PC (Localhost):
1. Abre: http://localhost:3000
2. Abre en otra pestaña: http://localhost:3000

### DIFERENTES PCs (MISMA RED WiFi):
1. Encuentra tu IP:
   ```bash
   # En Windows:
   ipconfig
   # En Mac/Linux:
   ifconfig
   ```
   Busca algo como: 192.168.x.x

2. En PC 1: http://192.168.x.x:3000
3. En PC 2: http://192.168.x.x:3000

### DIFERENTES IPs (INTERNET):
Si quieres acceso remoto, usa ngrok:
```bash
npm install -g ngrok
ngrok http 3000
```

Usa la URL que genera ngrok (ej: https://xxxx-xx-xxx-xxx-xx.ngrok.io)

## 👥 PASO 6: PRUEBA DEL SISTEMA

### PESTAÑA 1 - ESTUDIANTE:
1. Email: juan@example.com
2. Password: user123
3. Espera en Dashboard

### PESTAÑA 2 - ADMIN:
1. Email: admin@eduvocal.com
2. Password: admin123
3. Ve a ⚙️ Admin
4. Click en 🔓 Activar (Hack Mode)

### RESULTADO EN PESTAÑA 1:
✅ Aparece modal de cierre forzado
✅ Cuenta regresiva: 3, 2, 1
✅ Auto-logout y regresa a login

## 🎯 INDICADOR DE CONEXIÓN

Arriba a la derecha verás:
- 🟢 ✅ Conectado (verde)
- 🔴 ❌ Desconectado (rojo)

Esto indica el estado del WebSocket.

## ⚙️ USUARIOS DISPONIBLES

```
👑 admin@eduvocal.com / admin123
   → Puede activar Hack Mode desde ⚙️ Admin

📚 juan@example.com / user123
   → Estudiante (será desconectado)

📚 maria@example.com / user456
   → Estudiante (será desconectada)

👨‍👩‍👧 carlos@example.com / parent123
   → Tutor (será desconectado)

👨‍🏫 laura@example.com / instructor123
   → Instructor (será desconectado)
```

## 🐛 TROUBLESHOOTING

### Error: "Cannot find module 'express'"
```bash
npm install express ws cors
```

### Error: "Port 3000 already in use"
```bash
# Usa otro puerto:
PORT=4000 node server.js
# Luego accede a: http://localhost:4000
```

### Error: "WebSocket connection failed"
1. Verifica que el servidor esté corriendo
2. Comprueba la URL: http://localhost:3000
3. Revisa la consola del navegador (F12 → Console)

### No funciona en diferentes IPs
1. Asegúrate que están en la misma red WiFi
2. Usa `ipconfig` para verificar tu IP
3. Accede desde otra PC: http://tu-ip:3000

## 📊 CONSOLA DEL SERVIDOR

Verás logs como:
```
✅ Cliente conectado: abc123def (Total: 2)
🎯 Hack Mode: ACTIVADO por Admin System
❌ Cliente desconectado: abc123def (Total: 1)
```

## 🔒 SEGURIDAD (Para producción)

Para usar en Internet públicamente:
1. Agregá autenticación real (JWT, OAuth)
2. Usa certificados SSL (wss://)
3. Valida datos del servidor
4. Implementá rate limiting
5. Usa .env para variables sensibles

## 📞 SOPORTE

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Mira los logs del servidor
3. Verifica la conexión WiFi
4. Prueba en localhost primero

¡Listo! El sistema está funcionando con WebSocket real. 🎉

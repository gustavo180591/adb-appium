const fs = require('fs');
const path = require('path');

describe('Cambio de proxy (modo avión)', () => {
    it('Debería activar modo avión y volver a activar datos móviles', async () => {
      const AIRPLANE_MODE_TIME = 60000; // 1 minuto con modo avión
      const RECONNECT_WAIT = 30000; // 30 segundos para reconexión
      const MAX_RECONNECT_ATTEMPTS = 5; // Máximo número de intentos de reconexión
      const RECONNECT_INTERVAL = 5000; // 5 segundos entre intentos de reconexión
      const udid = 'R58N857S75Y';
      const LOG_FILE = path.join(__dirname, '../../logs/ip-changes.log');
  
      const exec = require('child_process').exec;
  
      const runAdbCommand = (cmd) => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`Timeout executing command: ${cmd}`));
          }, 10000); // 10 segundos de timeout para comandos ADB

          exec(cmd, (error, stdout, stderr) => {
            clearTimeout(timeout);
            if (error) {
              console.error(`❌ Error ejecutando "${cmd}":`, stderr);
              return reject(error);
            }
            console.log(`✅ Comando ejecutado: ${cmd}`);
            resolve(stdout);
          });
        });
      };

      const reconnectAdb = async () => {
        console.log('🔄 Reconectando ADB...');
        try {
          await runAdbCommand('adb kill-server');
          await driver.pause(1000);
          await runAdbCommand('adb start-server');
          await driver.pause(2000);
          const devices = await runAdbCommand('adb devices');
          console.log('📱 Dispositivos conectados:', devices);
          return devices.includes(udid);
        } catch (error) {
          console.error('❌ Error reconectando ADB:', error.message);
          return false;
        }
      };

      const getCurrentIP = async () => {
        try {
          // Intentar obtener IP con timeout
          const result = await Promise.race([
            runAdbCommand(`adb -s ${udid} shell curl -4 -s ifconfig.me`),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout getting IP')), 5000)
            )
          ]);
          return result.trim();
        } catch (error) {
          console.error('❌ Error obteniendo IP:', error.message);
          return 'No disponible';
        }
      };

      const logIPChange = async (oldIP, newIP) => {
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} | IP anterior: ${oldIP} | IP nueva: ${newIP}\n`;
        
        // Asegurar que el directorio logs existe
        const logDir = path.dirname(LOG_FILE);
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        fs.appendFileSync(LOG_FILE, logEntry);
        console.log('📝 Registro de cambio de IP guardado');
      };

      const waitForConnection = async () => {
        for (let attempt = 1; attempt <= MAX_RECONNECT_ATTEMPTS; attempt++) {
          console.log(`🔄 Intento de reconexión ${attempt}/${MAX_RECONNECT_ATTEMPTS}...`);
          
          if (await reconnectAdb()) {
            console.log('✅ Conexión ADB restablecida');
            return true;
          }

          if (attempt < MAX_RECONNECT_ATTEMPTS) {
            console.log(`⏳ Esperando ${RECONNECT_INTERVAL/1000} segundos antes del siguiente intento...`);
            await driver.pause(RECONNECT_INTERVAL);
          }
        }
        return false;
      };
  
      try {
        // Desactivar WiFi primero
        console.log('📡 Desactivando WiFi...');
        await runAdbCommand(`adb -s ${udid} shell svc wifi disable`);
        await driver.pause(2000);

        // Obtener IP antes del cambio
        const oldIP = await getCurrentIP();
        console.log(`📡 IP actual: ${oldIP}`);

        // Desactivar datos móviles
        console.log('📡 Desactivando datos móviles...');
        await runAdbCommand(`adb -s ${udid} shell svc data disable`);
        await driver.pause(2000);

        // Activar modo avión y asegurarnos que todo esté desactivado
        console.log('📡 Activando modo avión...');
        await runAdbCommand(`adb -s ${udid} shell settings put global airplane_mode_on 1`);
        await runAdbCommand(`adb -s ${udid} shell settings put global airplane_mode_radios "cell,bluetooth,wifi,nfc,wimax"`);
        await runAdbCommand(`adb -s ${udid} shell settings put global airplane_mode_toggleable_radios "bluetooth,wifi,nfc"`);
        
        // Forzar desactivación de todas las conexiones
        console.log('📡 Forzando desactivación de todas las conexiones...');
        await runAdbCommand(`adb -s ${udid} shell svc wifi disable`);
        await runAdbCommand(`adb -s ${udid} shell svc data disable`);
        await runAdbCommand(`adb -s ${udid} shell svc bluetooth disable`);
        await runAdbCommand(`adb -s ${udid} shell svc nfc disable`);
  
        console.log(`⏳ Esperando ${AIRPLANE_MODE_TIME/1000} segundos con modo avión activado...`);
        await driver.pause(AIRPLANE_MODE_TIME);
  
        // Desactivar modo avión
        console.log('📡 Desactivando modo avión...');
        await runAdbCommand(`adb -s ${udid} shell settings put global airplane_mode_on 0`);
        await runAdbCommand(`adb -s ${udid} shell settings put global airplane_mode_radios "cell,bluetooth,wifi,nfc,wimax"`);
        await runAdbCommand(`adb -s ${udid} shell settings put global airplane_mode_toggleable_radios "bluetooth,wifi,nfc"`);
  
        console.log(`⏳ Esperando ${RECONNECT_WAIT/1000} segundos para reconexión...`);
        await driver.pause(RECONNECT_WAIT);

        // Activar datos móviles
        console.log('📡 Activando datos móviles...');
        await runAdbCommand(`adb -s ${udid} shell svc data enable`);
        await driver.pause(5000);

        // Intentar reconectar con múltiples intentos
        if (!await waitForConnection()) {
          throw new Error('No se pudo reconectar con el dispositivo después de varios intentos');
        }

        // Esperar un poco más para asegurar que la conexión de datos esté estable
        await driver.pause(5000);

        // --- INICIO DE NUEVO CÓDIGO ---
        // Asegurar que WiFi principal esté desactivado (por si acaso)
        console.log('📡 Asegurando que WiFi principal esté desactivado...');
        await runAdbCommand(`adb -s ${udid} shell svc wifi disable`);
        await driver.pause(1000); // Pequeña pausa

        // Activar Mobile Hotspot
        console.log('🔥 Activando Mobile Hotspot...');
        // Intentamos activar el hotspot Wi-Fi. Este comando puede variar.
        await runAdbCommand(`adb -s ${udid} shell cmd connectivity tether start wifi`); 
        console.log('⏳ Esperando 5 segundos para que el hotspot se active...');
        await driver.pause(5000); 
        // --- FIN DE NUEVO CÓDIGO ---

        // Obtener nueva IP
        const newIP = await getCurrentIP();
        console.log(`📡 Nueva IP: ${newIP}`);

        // Registrar el cambio
        await logIPChange(oldIP, newIP);
  
        console.log('✅ Conexión restablecida correctamente');
      } catch (error) {
        console.error('❌ Error al cambiar la conectividad:', error.message);
        await driver.saveScreenshot('./error-proxy.png');
        throw error;
      }
    });
  });
  
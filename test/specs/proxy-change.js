const fs = require('fs');
const path = require('path');

describe('Cambio de proxy (modo avión)', () => {
    it('Debería activar modo avión y volver a activar datos móviles', async () => {
      const WAIT_TIME = 70000; // 1 minuto y 10 segundos con modo avión
      const RECONNECT_WAIT = 30000; // 30 segundos para reconexión
      const udid = 'ZY22HRRMDX';
      const LOG_FILE = path.join(__dirname, '../../logs/ip-changes.log');
  
      const exec = require('child_process').exec;
  
      const runAdbCommand = (cmd) => {
        return new Promise((resolve, reject) => {
          exec(cmd, (error, stdout, stderr) => {
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
          // Forzar IPv4 usando curl con -4
          const result = await runAdbCommand(`adb -s ${udid} shell curl -4 -s ifconfig.me`);
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
  
        console.log(`⏳ Esperando ${WAIT_TIME/1000} segundos con modo avión activado...`);
        await driver.pause(WAIT_TIME);
  
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

        // Intentar reconectar ADB
        let isConnected = await reconnectAdb();
        if (!isConnected) {
          console.log('⚠️ No se pudo reconectar ADB automáticamente. Intentando nuevamente...');
          await driver.pause(5000);
          isConnected = await reconnectAdb();
        }

        if (!isConnected) {
          throw new Error('No se pudo reconectar con el dispositivo después de varios intentos');
        }

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
  
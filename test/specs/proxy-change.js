const fs = require('fs');
const path = require('path');

describe('Activar Hotspot', () => {
    it('Debería activar el hotspot móvil', async () => {
      const udid = 'R58N857S75Y';
      const LOG_FILE = path.join(__dirname, '../../logs/hotspot.log');
  
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

      try {
        // Abrir configuración de conexiones
        console.log('📡 Abriendo configuración de conexiones...');
        await runAdbCommand(`adb -s ${udid} shell am start -n com.android.settings/.Settings$NetworkDashboardActivity`);
        await driver.pause(3000);

        // Click en el primer elemento usando coordenadas con tap
        console.log('🔎 Haciendo tap en la primera posición...');
        await runAdbCommand(`adb -s ${udid} shell input tap 540 1464`); // Centro del área [0,1379,1080,1549]
        await driver.pause(2000);

        // Click en el segundo elemento usando coordenadas con tap
        console.log('🔎 Haciendo tap en la segunda posición...');
        await runAdbCommand(`adb -s ${udid} shell input tap 540 1677`); // Centro del área [63,1608,1017,1746]
        await driver.pause(2000);

        // Buscar y manejar el switch de hotspot
        console.log('🔎 Buscando el switch de hotspot...');
        const switchElement = await $('android=new UiSelector().className("android.widget.Switch").resourceId("android:id/switch_widget")');
        
        if (await switchElement.isDisplayed()) {
          const checked = await switchElement.getAttribute('checked');
          if (checked === 'false') {
            console.log('📱 Activando el hotspot...');
            await switchElement.click();
            console.log('✅ Hotspot activado');
          } else {
            console.log('ℹ️ El hotspot ya está activado');
          }
        } else {
          throw new Error('No se encontró el switch del hotspot');
        }
        
        await driver.pause(3000);
        console.log('✅ Proceso completado');
        
      } catch (error) {
        console.error('❌ Error:', error.message);
        await driver.saveScreenshot('./error-hotspot.png');
        throw error;
      }
    });
  });
  
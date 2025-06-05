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

        // Buscar y hacer clic en el menú de hotspot usando varios textos posibles
        const hotspotMenuTexts = [
          'Zona Wi-Fi portátil',
          'Mobile Hotspot',
          'Hotspot',
          'Punto de acceso',
          'Wi-Fi hotspot',
        ];
        let hotspotMenu = null;
        for (const text of hotspotMenuTexts) {
          try {
            console.log(`🔎 Buscando menú: ${text}`);
            const el = await $(`android=new UiSelector().textContains("${text}")`);
            if (await el.isDisplayed()) {
              hotspotMenu = el;
              console.log(`✅ Encontrado y click en menú: ${text}`);
              await el.click();
              break;
            }
          } catch (e) {
            console.log(`❌ No se encontró menú: ${text}`);
          }
        }
        if (!hotspotMenu) {
          throw new Error('No se encontró ningún menú de hotspot');
        }
        await driver.pause(2000);

        // Buscar y activar el switch usando varios tipos de widgets
        const switchSelectors = [
          'android=new UiSelector().className("android.widget.Switch")',
          'android=new UiSelector().className("android.widget.CompoundButton")',
          'android=new UiSelector().resourceId("android:id/switch_widget")',
          'android=new UiSelector().clickable(true).checkable(true)'
        ];
        let switchElement = null;
        for (const selector of switchSelectors) {
          try {
            console.log(`🔎 Buscando switch con selector: ${selector}`);
            const el = await $(selector);
            if (await el.isDisplayed()) {
              switchElement = el;
              console.log(`✅ Encontrado switch con selector: ${selector}`);
              break;
            }
          } catch (e) {
            console.log(`❌ No se encontró switch con selector: ${selector}`);
          }
        }
        if (switchElement) {
          const checked = await switchElement.getAttribute('checked');
          if (checked === 'false') {
            await switchElement.click();
            console.log('✅ Switch activado');
          } else {
            console.log('ℹ️ Switch ya estaba activado');
          }
        } else {
          console.log('⚠️ No se encontró el switch, intentando método alternativo...');
          // Intentar tap en coordenadas específicas
          await runAdbCommand(`adb -s ${udid} shell input tap 500 500`);
        }
        await driver.pause(5000);

        console.log('✅ Proceso completado');
      } catch (error) {
        console.error('❌ Error:', error.message);
        await driver.saveScreenshot('./error-hotspot.png');
        throw error;
      }
    });
  });
  
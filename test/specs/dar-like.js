const fs = require('fs');
const path = require('path');

describe('Dar Like', () => {
    it('Debería dar like usando el segundo dispositivo', async () => {
      const udid = 'HA1W51MA';
      const textoBusqueda = 'arabelasoler';
      const WAIT_TIME = 10000;
      const LIKE_WAIT_TIME = 3000;
      const PAGE_LOAD_TIME = 2000;
      const LOG_FILE = path.join(__dirname, '../../logs/like.log');
  
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

      async function buscarPerfil() {
        // Buscar el botón de Explorar
        console.log('🔍 Buscando botón de Explorar...');
        const explorarBtn = await $(`android=new UiSelector().descriptionContains("Buscar")`);
        await explorarBtn.waitForDisplayed({ timeout: WAIT_TIME });
        await explorarBtn.click();
        await driver.pause(PAGE_LOAD_TIME);
        
        // Buscar y escribir en el campo de búsqueda
        const searchInput = await $(`android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")`);
        await searchInput.click();
        await searchInput.waitForDisplayed({ timeout: WAIT_TIME });
        await searchInput.setValue(textoBusqueda);
        await driver.pause(PAGE_LOAD_TIME);

        console.log('🔍 Buscando perfil...');
        const resultadoPerfil = await $(
          'android=new UiSelector()' +
          '.resourceId("com.instagram.android:id/row_search_user_info_container")' +
          '.instance(0)'
        );
        await resultadoPerfil.waitForDisplayed({ timeout: WAIT_TIME });
        await resultadoPerfil.click();
        await driver.pause(PAGE_LOAD_TIME);
      }

      async function darLikeAPrimerPost() {
        console.log('🔄 Abriendo primer post...');
        const selector = 'android=new UiSelector().descriptionContains("fila 1, columna 1")';
        const posteo = await $(selector);
        await posteo.waitForDisplayed({ timeout: WAIT_TIME });
        await posteo.click();
        await driver.pause(PAGE_LOAD_TIME);

        // Verificar si ya tiene like
        let isLiked = false;
        try {
          const likedButton = await $('android=new UiSelector().resourceId("com.instagram.android:id/row_feed_button_like").description("Te gusta")');
          isLiked = await likedButton.isDisplayed();
        } catch (error) {
          isLiked = false;
        }

        if (!isLiked) {
          // Dar like con reintento
          let retries = 3;
          while (retries > 0) {
            try {
              const likeBtn = await $(
                'android=new UiSelector().resourceId("com.instagram.android:id/row_feed_button_like")'
              );
              await likeBtn.waitForDisplayed({ timeout: WAIT_TIME });
              await likeBtn.click();
              console.log('✅ Like enviado');
              await driver.pause(LIKE_WAIT_TIME);
              break;
            } catch (error) {
              retries--;
              if (retries === 0) throw error;
              console.log(`⚠️ Reintentando dar like (${retries} intentos restantes)...`);
              await driver.pause(1000);
            }
          }
        } else {
          console.log('ℹ️ La publicación ya tiene like');
        }

        await driver.back();
        await driver.pause(PAGE_LOAD_TIME);
      }

      try {
        // Verificar que el dispositivo está conectado
        console.log('🔍 Verificando conexión del dispositivo...');
        await runAdbCommand(`adb -s ${udid} shell getprop ro.product.model`);
        
        // Reiniciar Instagram
        console.log('🔄 Reiniciando Instagram...');
        await runAdbCommand(`adb -s ${udid} shell am force-stop com.instagram.android`);
        await driver.pause(PAGE_LOAD_TIME);
        await runAdbCommand(`adb -s ${udid} shell am start -n com.instagram.android/.activity.MainTabActivity`);
        await driver.pause(WAIT_TIME);

        // Verificar que estamos en Instagram
        const currentApp = await driver.getCurrentPackage();
        if (currentApp !== 'com.instagram.android') {
          throw new Error(`La app actual (${currentApp}) no es Instagram`);
        }

        // Buscar perfil y dar like
        await buscarPerfil();
        await darLikeAPrimerPost();

        console.log('✅ Proceso completado');
      } catch (error) {
        console.error('❌ Error:', error.message);
        await driver.saveScreenshot('./error-like.png');
        throw error;
      }
    });
  }); 
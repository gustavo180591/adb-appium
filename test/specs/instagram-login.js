describe('Instagram - Abrir app y buscar', () => {
  it('debería abrir la app de Instagram, abrir explorar y buscar "crucero del norte"', async () => {
    const textoBusqueda = 'crucero del norte';

    try {
      // Reiniciar app para asegurar estado limpio
      console.log('🔄 Reiniciando Instagram...');
      await driver.execute('mobile: terminateApp', { appId: 'com.instagram.android' });
      await driver.pause(3000);
      await driver.execute('mobile: activateApp', { appId: 'com.instagram.android' });
      await driver.pause(10000);
      console.log('✅ Instagram debería estar abierta en el dispositivo.');

      // Verificar que la app está realmente abierta
      const currentApp = await driver.getCurrentPackage();
      if (currentApp !== 'com.instagram.android') {
        throw new Error(`La app actual (${currentApp}) no es Instagram`);
      }

      // Buscar botón de Explorar con múltiples selectors (sin swipe ni coordenadas)
      console.log('🔍 Buscando botón de Explorar...');
      let explorarBtn;
      let found = false;
      const selectors = [
        'android=new UiSelector().resourceId("com.instagram.android:id/search_tab")',
        'android=new UiSelector().description("Buscar y explorar")',
        'android=new UiSelector().descriptionContains("Buscar")',
        'android=new UiSelector().text("Buscar")',
        'android=new UiSelector().textContains("Buscar")'
      ];

      for (let i = 0; i < 5; i++) {
        try {
          for (const selector of selectors) {
            try {
              console.log(`Intentando selector: ${selector}`);
              explorarBtn = await $(selector);
              if (await explorarBtn.isDisplayed() && await explorarBtn.isEnabled()) {
                await explorarBtn.click();
                console.log('✅ Se hizo click en el botón de Explorar (lupa)');
                found = true;
                break;
              }
            } catch (e) {
              console.log(`❌ Error con selector ${selector}: ${e.message}`);
            }
          }
          if (found) break;
        } catch (e) {
          console.log(`🔁 Intento ${i + 1}: No se encontró el botón de explorar aún. Esperando...`);
        }
        await driver.pause(3000);
      }

      if (!found) {
        throw new Error('No se pudo encontrar el botón de explorar (lupa)');
      }

      // Esperar a que la pantalla de explorar cargue
      console.log('⏳ Esperando a que cargue la pantalla de explorar...');
      await driver.pause(5000);

      // Buscar barra de búsqueda y escribir
      console.log('🔍 Buscando barra de búsqueda...');
      const searchSelectors = [
        'android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")',
        'android=new UiSelector().className("android.widget.EditText")',
        'android=new UiSelector().textContains("Buscar")',
        'android=new UiSelector().descriptionContains("Buscar")'
      ];

      let searchInput;
      for (const selector of searchSelectors) {
        try {
          console.log(`Intentando selector de búsqueda: ${selector}`);
          searchInput = await $(selector);
          if (await searchInput.isDisplayed() && await searchInput.isEnabled()) {
            await searchInput.click();
            await searchInput.setValue(textoBusqueda);
            console.log('✅ Se escribió el texto de búsqueda');
            break;
          }
        } catch (e) {
          console.log(`❌ Error con selector de búsqueda ${selector}: ${e.message}`);
        }
      }

      if (!searchInput) {
        throw new Error('No se pudo encontrar la barra de búsqueda');
      }

      // Esperar 2 segundos y presionar Enter
      console.log('⏳ Esperando antes de presionar Enter...');
      await driver.pause(2000);
      await driver.pressKeyCode(66); // KEYCODE_ENTER
      console.log('✅ Se presionó Enter para buscar');

      // Esperar a que aparezcan los resultados de búsqueda
      console.log('⏳ Esperando resultados de búsqueda...');
      await driver.pause(5000);

      // Buscar y hacer clic en el primer perfil
      console.log('🔍 Buscando primer perfil en resultados...');
      const profileSelectors = [
        'android=new UiSelector().resourceId("com.instagram.android:id/row_search_user_username")',
        'android=new UiSelector().resourceId("com.instagram.android:id/row_search_user_full_name")',
        'android=new UiSelector().className("android.widget.TextView").textContains("crucero")',
        'android=new UiSelector().className("android.widget.TextView").textContains("Crucero")'
      ];

      let profileFound = false;
      for (const selector of profileSelectors) {
        try {
          console.log(`Intentando selector de perfil: ${selector}`);
          const profileElement = await $(selector);
          if (await profileElement.isDisplayed() && await profileElement.isEnabled()) {
            await profileElement.click();
            console.log('✅ Se hizo clic en el primer perfil encontrado');
            profileFound = true;
            break;
          }
        } catch (e) {
          console.log(`❌ Error con selector de perfil ${selector}: ${e.message}`);
        }
      }

      if (!profileFound) {
        throw new Error('No se pudo encontrar ningún perfil en los resultados');
      }

      // Esperar a que cargue el perfil
      console.log('⏳ Esperando a que cargue el perfil...');
      await driver.pause(5000);

      // Buscar la última publicación
      console.log('🔍 Buscando la última publicación...');
      const postSelectors = [
        'android=new UiSelector().resourceId("com.instagram.android:id/row_feed_photo")',
        'android=new UiSelector().className("android.widget.ImageView").descriptionContains("Foto")',
        'android=new UiSelector().className("android.widget.ImageView").descriptionContains("Post")'
      ];

      let postFound = false;
      for (const selector of postSelectors) {
        try {
          console.log(`Intentando selector de publicación: ${selector}`);
          const postElement = await $(selector);
          if (await postElement.isDisplayed() && await postElement.isEnabled()) {
            await postElement.click();
            console.log('✅ Se hizo clic en la última publicación');
            postFound = true;
            break;
          }
        } catch (e) {
          console.log(`❌ Error con selector de publicación ${selector}: ${e.message}`);
        }
      }

      if (!postFound) {
        throw new Error('No se pudo encontrar ninguna publicación');
      }

      // Esperar a que cargue la publicación
      console.log('⏳ Esperando a que cargue la publicación...');
      await driver.pause(3000);

      // Buscar y hacer clic en el botón de me gusta
      console.log('🔍 Buscando botón de me gusta...');
      const likeSelectors = [
        'android=new UiSelector().resourceId("com.instagram.android:id/like_button")',
        'android=new UiSelector().description("Me gusta")',
        'android=new UiSelector().descriptionContains("Me gusta")'
      ];

      let likeFound = false;
      for (const selector of likeSelectors) {
        try {
          console.log(`Intentando selector de me gusta: ${selector}`);
          const likeElement = await $(selector);
          if (await likeElement.isDisplayed() && await likeElement.isEnabled()) {
            await likeElement.click();
            console.log('✅ Se dio me gusta a la publicación');
            likeFound = true;
            break;
          }
        } catch (e) {
          console.log(`❌ Error con selector de me gusta ${selector}: ${e.message}`);
        }
      }

      if (!likeFound) {
        throw new Error('No se pudo encontrar el botón de me gusta');
      }

      // Esperar un momento para ver el resultado
      console.log('⏳ Esperando para ver el resultado...');
      await driver.pause(2000);

    } catch (error) {
      console.error('❌ Error en el test:', error.message);
      throw error;
    }
  });
});

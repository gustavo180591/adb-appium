describe('Instagram - Buscar y dar Me Gusta', () => {
  it('debería abrir Instagram, buscar perfil y darle like a la última publicación', async () => {
    const textoBusqueda = 'arabelasoler';
    const WAIT_TIME = 10000; // Aumentado de 4000 a 10000 para evitar timeouts
    const LIKE_WAIT_TIME = 3000; // Tiempo específico para esperar después de dar like
    const PAGE_LOAD_TIME = 2000; // Tiempo para cargar páginas

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

    async function procesarPublicaciones() {
      let allPostsLiked = true;

      for (let col = 1; col <= 3; col++) {
        console.log(`🔄 Iteración columna ${col}: abriendo reel en fila 1, columna ${col}`);
      
        try {
          const selector = 
            'android=new UiSelector()' +
            `.descriptionContains("fila 1, columna ${col}")`;

          const posteos = await $$(selector);
          if (!posteos || posteos.length === 0) {
            console.log(`⚠️ No se encontró la publicación en columna ${col}, continuando...`);
            continue;
          }

          const posteo = posteos[0];
          await posteo.waitForDisplayed({ timeout: WAIT_TIME });
          await posteo.click();
          await driver.pause(PAGE_LOAD_TIME);

          // Verificar si el post ya tiene like usando el selector exacto
          let isLiked = false;
          try {
            const likedButton = await $('android=new UiSelector().resourceId("com.instagram.android:id/row_feed_button_like").description("Te gusta")');
            isLiked = await likedButton.isDisplayed();
          } catch (error) {
            isLiked = false;
          }

          if (isLiked) {
            console.log(`ℹ️ La publicación en columna ${col} ya tiene like, pasando a la siguiente...`);
            await driver.back();
            await driver.pause(PAGE_LOAD_TIME);
            continue;
          } else {
            allPostsLiked = false;
          }
        
          // Dar like con reintento
          let retries = 3;
          while (retries > 0) {
            try {
              const likeBtn = await $(
                'android=new UiSelector().resourceId("com.instagram.android:id/row_feed_button_like")'
              );
              await likeBtn.waitForDisplayed({ timeout: WAIT_TIME });
              await likeBtn.click();
              console.log(`✅ Like en fila 1, columna ${col} enviado`);
              await driver.pause(LIKE_WAIT_TIME);
              break;
            } catch (error) {
              retries--;
              if (retries === 0) throw error;
              console.log(`⚠️ Reintentando dar like (${retries} intentos restantes)...`);
              await driver.pause(1000);
            }
          }
        
          await driver.back();
          await driver.pause(PAGE_LOAD_TIME);

        } catch (error) {
          console.log(`⚠️ Error al procesar la publicación en columna ${col}:`, error.message);
          try {
            await driver.back();
            await driver.pause(PAGE_LOAD_TIME);
          } catch (backError) {
            console.log('⚠️ Error al intentar volver atrás:', backError.message);
          }
          continue;
        }
      }

      return allPostsLiked;
    }

    try {
      console.log('🔄 Reiniciando Instagram...');
      await driver.terminateApp('com.instagram.android');
      await driver.pause(PAGE_LOAD_TIME);
      await driver.activateApp('com.instagram.android');
      await driver.pause(WAIT_TIME);

      const currentApp = await driver.getCurrentPackage();
      if (currentApp !== 'com.instagram.android') {
        throw new Error(`La app actual (${currentApp}) no es Instagram`);
      }

      await buscarPerfil();
      let allPostsLiked = await procesarPublicaciones();

      if (!allPostsLiked) {
        console.log('🔄 Cambiando de cuenta para procesar más publicaciones...');
        
        // Click en el perfil
        console.log('🔄 Navegando al perfil...');
        const profileTab = await $('android=new UiSelector().resourceId("com.instagram.android:id/tab_avatar")');
        await profileTab.waitForDisplayed({ timeout: WAIT_TIME });
        await profileTab.click();
        await driver.pause(WAIT_TIME);

        // Click en la flechita
        console.log('🔄 Abriendo selector de cuentas...');
        const chevron = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_title_chevron")');
        await chevron.waitForDisplayed({ timeout: WAIT_TIME });
        await chevron.click();
        await driver.pause(WAIT_TIME);

        // Seleccionar la cuenta
        console.log('🔄 Seleccionando cuenta...');
        try {
          const accounts = await $$('android=new UiSelector().className("android.view.ViewGroup").clickable(true)');
          
          if (accounts.length > 1) {
            await accounts[1].waitForDisplayed({ timeout: WAIT_TIME });
            await accounts[1].click();
            console.log('✅ Cuenta seleccionada exitosamente');
          } else {
            throw new Error('No se encontraron cuentas adicionales');
          }
        } catch (error) {
          console.log('⚠️ Error al seleccionar cuenta, intentando con selector alternativo...');
          const accountSelector = await $('android=new UiSelector().className("android.view.ViewGroup").clickable(true).index(1)');
          await accountSelector.waitForDisplayed({ timeout: WAIT_TIME });
          await accountSelector.click();
          console.log('✅ Cuenta seleccionada exitosamente');
        }
        await driver.pause(WAIT_TIME);

        // Buscar y procesar publicaciones con la nueva cuenta
        await buscarPerfil();
        allPostsLiked = await procesarPublicaciones();
      }

      if (allPostsLiked) {
        console.log('🎉 FINALIZADO!!!');
      }

    } catch (error) {
      console.error('❌ Error en el test:', error.message);
      await driver.saveScreenshot('./error-screenshot.png');
      throw error;
    }
  });
});

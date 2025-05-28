describe('Instagram - Buscar y dar Me Gusta', () => {
  it('debería abrir Instagram, buscar perfil y darle like a la última publicación', async () => {
    const textoBusqueda = 'arabelasoler';
    const WAIT_TIME = 8000; // Aumentado para evitar timeouts

    try {
      console.log('🔄 Reiniciando Instagram...');
      await driver.terminateApp('com.instagram.android');
      await driver.pause(3000);
      await driver.activateApp('com.instagram.android');
      await driver.pause(WAIT_TIME);

      // Verificar que estamos en Instagram
      const currentApp = await driver.getCurrentPackage();
      if (currentApp !== 'com.instagram.android') {
        throw new Error(`La app actual (${currentApp}) no es Instagram`);
      }

      // Esperar a que la app esté completamente cargada
      await driver.pause(3000);

      // Buscar el botón de Explorar
      console.log('🔍 Buscando botón de Explorar...');
      const explorarBtn = await $(`android=new UiSelector().descriptionContains("Buscar")`);
      await explorarBtn.waitForDisplayed({ timeout: WAIT_TIME });
      await explorarBtn.click();
      await driver.pause(3000);
      
      // Buscar y escribir en el campo de búsqueda
      const searchInput = await $(`android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")`);
      await searchInput.click();
      await searchInput.waitForDisplayed({ timeout: WAIT_TIME });
      await searchInput.setValue(textoBusqueda);
      await driver.pause(3000);

      console.log('🔍 Buscando perfil...');
      // Buscar y hacer click en el resultado que contiene el texto 'crucerodelnorte'
      const resultadoPerfil = await $(
        'android=new UiSelector()' +
        '.resourceId("com.instagram.android:id/row_search_user_info_container")' +
        '.instance(0)'
      );      await resultadoPerfil.waitForDisplayed({ timeout: WAIT_TIME });
      await resultadoPerfil.click();
      await driver.pause(3000);

      let allPostsLiked = true; // Variable para rastrear si todos los posts tienen like

      for (let col = 1; col <= 3; col++) {
        console.log(`🔄 Iteración columna ${col}: abriendo reel en fila 1, columna ${col}`);
      
        // 1) Localiza dinámicamente por descripción de accesibilidad
        const selector = 
          'android=new UiSelector()' +
          `.descriptionContains("fila 1, columna ${col}")`;

        const posteos = await $$(selector);
        const posteo = posteos[0];
        await posteo.waitForDisplayed({ timeout: WAIT_TIME });
        await posteo.click();
        await driver.pause(3000);

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
          await driver.pause(WAIT_TIME);
          continue;
        } else {
          allPostsLiked = false; // Si encontramos un post sin like, actualizamos la bandera
        }
      
        // 3) Dar like
        const likeBtn = await $(
          'android=new UiSelector().resourceId("com.instagram.android:id/row_feed_button_like")'
        );
        await likeBtn.waitForDisplayed({ timeout: WAIT_TIME });
        await likeBtn.click();
        console.log(`✅ Like en fila 1, columna ${col} enviado`);
      
        // 4) Volver atrás para la siguiente iteración
        await driver.back();
        await driver.pause(WAIT_TIME);
      }

      // Verificar si todos los posts tenían like
      if (allPostsLiked) {
        console.log('🎉 FINALIZADO!!!');
      }

      // Esperar un momento antes de terminar
      await driver.pause(WAIT_TIME);

    } catch (error) {
      console.error('❌ Error en el test:', error.message);
      // Tomar screenshot en caso de error
      await driver.saveScreenshot('./error-screenshot.png');
      throw error;
    }
  });
});

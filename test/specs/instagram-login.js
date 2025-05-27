describe('Instagram - Buscar y dar Me Gusta', () => {
  it('debería abrir Instagram, buscar perfil y darle like a la última publicación', async () => {
    const textoBusqueda = 'arabelasoler';
    const WAIT_TIME = 5000;

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
      );      await resultadoPerfil.waitForDisplayed({ timeout: 3000 });
      await resultadoPerfil.click();
      await driver.pause(3000);

      // Abrir el perfil usando un selector genérico (primer elemento clickable dentro del contenedor de resultados)
/*       const perfilElement = await $(
        'android=new UiSelector().resourceId("com.instagram.android:id/recycler_view").childSelector(new UiSelector().clickable(true).index(0))'
      );
      await perfilElement.waitForDisplayed({ timeout: WAIT_TIME });
      await perfilElement.click();
      await driver.pause(WAIT_TIME); */
      for (let col = 1; col <= 3; col++) {
        console.log(`🔄 Iteración columna ${col}: abriendo reel en fila 1, columna ${col}`);
      
        // 1) Localiza dinámicamente por descripción de accesibilidad
        const selector = 
          'android=new UiSelector()' +
          `.descriptionContains("fila 1, columna ${col}")`;

        const posteos = await $$(selector);
        const posteo = posteos[0];
        await posteo.waitForDisplayed({ timeout: 7000 });
        await posteo.click();
        await driver.pause(3000);
      
        // 3) Dar like
        const likeBtn = await $(
          'android=new UiSelector().description("Me gusta")'
        );
        await likeBtn.waitForDisplayed({ timeout: 3000 });
        await likeBtn.click();
        console.log(`✅ Like en fila 1, columna ${col} enviado`);
      
        // 4) Volver atrás para la siguiente iteración
        await driver.back();
        await driver.pause(WAIT_TIME);
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

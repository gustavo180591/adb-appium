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
      await driver.pause(WAIT_TIME);

      // Buscar el botón de Explorar
      console.log('🔍 Buscando botón de Explorar...');
      const explorarBtn = await $(`android=new UiSelector().descriptionContains("Buscar")`);
      await explorarBtn.waitForDisplayed({ timeout: WAIT_TIME });
      await explorarBtn.click();
      await driver.pause(WAIT_TIME);
      
      // Buscar y escribir en el campo de búsqueda
      const searchInput = await $(`android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")`);
      await searchInput.click();
      await searchInput.waitForDisplayed({ timeout: WAIT_TIME });

      await searchInput.setValue(textoBusqueda);
      await driver.pause(WAIT_TIME);
      console.log('🔍 Buscando perfil...');
      // Buscar y hacer click en el resultado que contiene el texto 'crucerodelnorte'
      const resultadoPerfil = await $(
        'android=new UiSelector()' +
        '.resourceId("com.instagram.android:id/row_search_user_info_container")' +
        '.instance(0)'
      );      await resultadoPerfil.waitForDisplayed({ timeout: WAIT_TIME });
      await resultadoPerfil.click();
      await driver.pause(WAIT_TIME);

      // Abrir el perfil usando un selector genérico (primer elemento clickable dentro del contenedor de resultados)
/*       const perfilElement = await $(
        'android=new UiSelector().resourceId("com.instagram.android:id/recycler_view").childSelector(new UiSelector().clickable(true).index(0))'
      );
      await perfilElement.waitForDisplayed({ timeout: WAIT_TIME });
      await perfilElement.click();
      await driver.pause(WAIT_TIME); */
      const todosReels = await $$(
        'android=new UiSelector().descriptionContains("fila 1, columna 1")'
      );
      
      // Asegúrate de que haya al menos uno
      if (todosReels.length === 0) {
        throw new Error('No se encontró ningún elemento en fila 1, columna 1');
      }
      
      // Espera y clickea el primero
      await todosReels[0].waitForDisplayed({ timeout: 10000 });
      await todosReels[0].click();
      console.log('✅ Clic en el primer elemento de fila 1, columna 1 realizado');

      // Buscar y hacer click en la última publicación
/*       const ultimaPublicacion = await $(`android=new UiSelector().descriptionContains("Foto de Crucero del Norte")`);
      await ultimaPublicacion.waitForDisplayed({ timeout: WAIT_TIME });
      await ultimaPublicacion.click();
      await driver.pause(WAIT_TIME); */

      // Dar like a la publicación
      const likeBtn = await $(`android=new UiSelector().description("Me gusta")`);
      await likeBtn.waitForDisplayed({ timeout: WAIT_TIME });
      await likeBtn.click();
      console.log('✅ Like enviado exitosamente');

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

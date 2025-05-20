describe('Instagram - Abrir app y buscador', () => {
  it('debería abrir la app de Instagram y el buscador', async () => {
    await driver.execute('mobile: activateApp', { appId: 'com.instagram.android' });
    await driver.pause(5000); // Esperar 5 segundos para asegurar que la UI cargue
    console.log('✅ Instagram debería estar abierta en el dispositivo.');

    // Intentar mostrar la barra inferior con un swipe hacia arriba
    try {
      await driver.touchAction([
        { action: 'press', x: 300, y: 1800 },
        { action: 'moveTo', x: 300, y: 300 },
        'release'
      ]);
      await driver.pause(2000);
      console.log('↕️ Swipe realizado para mostrar la barra inferior.');
    } catch (e) {
      console.log('⚠️ No se pudo realizar el swipe:', e.message);
    }

    // Buscar todos los nodos con resource-id 'search_tab'
    let allSearchTabs = [];
    let buscadorAbierto = false;
    try {
      allSearchTabs = await $$('android=new UiSelector().resourceId("com.instagram.android:id/search_tab")');
      console.log('Cantidad de search_tab encontrados:', allSearchTabs.length);
      for (const btn of allSearchTabs) {
        if (await btn.isDisplayed()) {
          await btn.click();
          console.log('🔍 Se abrió el buscador con resource-id "search_tab"');
          buscadorAbierto = true;
          break;
        }
      }
      if (allSearchTabs.length > 0 && !buscadorAbierto) {
        console.log('El botón search_tab existe pero no está visible.');
      }
    } catch (e) {
      console.log('❌ Error buscando search_tab:', e.message);
    }

    // Si se abrió el buscador, intenta escribir en la barra de búsqueda
    if (buscadorAbierto) {
      await driver.pause(2000); // Espera a que aparezca la barra de búsqueda
      try {
        const searchInput = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
        if (await searchInput.isDisplayed()) {
          await searchInput.setValue('crucero del norte');
          console.log('⌨️ Se escribió "crucero del norte" en la barra de búsqueda.');
        } else {
          console.log('⚠️ La barra de búsqueda no está visible.');
        }
      } catch (e) {
        console.log('❌ No se pudo escribir en la barra de búsqueda:', e.message);
      }
      return;
    }

    // 2. Por content-desc exacto
    try {
      const searchBtn = await $('~Buscar y explorar');
      if (await searchBtn.isDisplayed()) {
        await searchBtn.click();
        console.log('🔍 Se abrió el buscador con content-desc "Buscar y explorar"');
        // Intentar escribir en la barra de búsqueda
        await driver.pause(2000);
        try {
          const searchInput = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
          if (await searchInput.isDisplayed()) {
            await searchInput.setValue('crucero del norte');
            console.log('⌨️ Se escribió "crucero del norte" en la barra de búsqueda.');
          } else {
            console.log('⚠️ La barra de búsqueda no está visible.');
          }
        } catch (e) {
          console.log('❌ No se pudo escribir en la barra de búsqueda:', e.message);
        }
        return;
      }
    } catch (e) {
      console.log('❌ No se encontró el botón con content-desc "Buscar y explorar"');
    }
    // 3. Otros intentos previos
    try {
      const searchBtn = await $('~Buscar');
      if (await searchBtn.isDisplayed()) {
        await searchBtn.click();
        console.log('🔍 Se abrió el buscador con el selector "~Buscar"');
        await driver.pause(2000);
        try {
          const searchInput = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
          if (await searchInput.isDisplayed()) {
            await searchInput.setValue('crucero del norte');
            console.log('⌨️ Se escribió "crucero del norte" en la barra de búsqueda.');
          } else {
            console.log('⚠️ La barra de búsqueda no está visible.');
          }
        } catch (e) {
          console.log('❌ No se pudo escribir en la barra de búsqueda:', e.message);
        }
        return;
      }
    } catch (e) {
      console.log('❌ No se encontró el botón con selector "~Buscar"');
    }
    try {
      const searchBtn = await $('~Search and Explore');
      if (await searchBtn.isDisplayed()) {
        await searchBtn.click();
        console.log('🔍 Se abrió el buscador con el selector "~Search and Explore"');
        await driver.pause(2000);
        try {
          const searchInput = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
          if (await searchInput.isDisplayed()) {
            await searchInput.setValue('crucero del norte');
            console.log('⌨️ Se escribió "crucero del norte" en la barra de búsqueda.');
          } else {
            console.log('⚠️ La barra de búsqueda no está visible.');
          }
        } catch (e) {
          console.log('❌ No se pudo escribir en la barra de búsqueda:', e.message);
        }
        return;
      }
    } catch (e) {
      console.log('❌ No se encontró el botón con selector "~Search and Explore"');
    }
    try {
      const searchBtn = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
      if (await searchBtn.isDisplayed()) {
        await searchBtn.click();
        console.log('🔍 Se abrió el buscador con resource-id "action_bar_search_edit_text"');
        await driver.pause(2000);
        try {
          const searchInput = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
          if (await searchInput.isDisplayed()) {
            await searchInput.setValue('crucero del norte');
            console.log('⌨️ Se escribió "crucero del norte" en la barra de búsqueda.');
          } else {
            console.log('⚠️ La barra de búsqueda no está visible.');
          }
        } catch (e) {
          console.log('❌ No se pudo escribir en la barra de búsqueda:', e.message);
        }
        return;
      }
    } catch (e) {
      console.log('❌ No se encontró el botón con resource-id "action_bar_search_edit_text"');
    }
    try {
      const searchBtn = await $('android=new UiSelector().textContains("Buscar")');
      if (await searchBtn.isDisplayed()) {
        await searchBtn.click();
        console.log('🔍 Se abrió el buscador con texto "Buscar"');
        await driver.pause(2000);
        try {
          const searchInput = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
          if (await searchInput.isDisplayed()) {
            await searchInput.setValue('crucero del norte');
            console.log('⌨️ Se escribió "crucero del norte" en la barra de búsqueda.');
          } else {
            console.log('⚠️ La barra de búsqueda no está visible.');
          }
        } catch (e) {
          console.log('❌ No se pudo escribir en la barra de búsqueda:', e.message);
        }
        return;
      }
    } catch (e) {
      console.log('❌ No se encontró el botón con texto "Buscar"');
    }
    try {
      const searchBtn = await $('android=new UiSelector().descriptionContains("Buscar")');
      if (await searchBtn.isDisplayed()) {
        await searchBtn.click();
        console.log('🔍 Se abrió el buscador con descriptionContains "Buscar"');
        await driver.pause(2000);
        try {
          const searchInput = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
          if (await searchInput.isDisplayed()) {
            await searchInput.setValue('crucero del norte');
            console.log('⌨️ Se escribió "crucero del norte" en la barra de búsqueda.');
          } else {
            console.log('⚠️ La barra de búsqueda no está visible.');
          }
        } catch (e) {
          console.log('❌ No se pudo escribir en la barra de búsqueda:', e.message);
        }
        return;
      }
    } catch (e) {
      console.log('❌ No se encontró el botón con descriptionContains "Buscar"');
    }
    console.log('⚠️ No se pudo encontrar el botón de buscador con los selectores probados.');
  });
});

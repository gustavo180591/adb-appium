describe('Instagram - Abrir app y buscar', () => {
  it('debería abrir la app de Instagram, abrir explorar y buscar', async () => {
    await driver.execute('mobile: activateApp', { appId: 'com.instagram.android' });
    await driver.pause(5000); // Esperar a que la UI cargue
    console.log('✅ Instagram debería estar abierta en el dispositivo.');

    // Buscar el botón de explorar (lupa) por resource-id y content-desc
    let explorarBtn;
    let found = false;
    for (let i = 0; i < 4; i++) {
      try {
        explorarBtn = await $('android=new UiSelector().resourceId("com.instagram.android:id/search_tab").description("Buscar y explorar")');
        if (await explorarBtn.isDisplayed() && await explorarBtn.isEnabled()) {
          await explorarBtn.click();
          console.log('🔍 Se hizo click en el botón de Explorar (lupa)');
          found = true;
          break;
        }
      } catch (e) {
        console.log('Intento', i+1, '- No se encontró el botón de explorar aún. Esperando...');
      }
      await driver.pause(1500);
    }
    if (!found) {
      console.log('❌ No se pudo encontrar el botón de explorar (lupa).');
      return;
    }

    // Esperar a que aparezca la barra de búsqueda en la parte superior
    let searchInput;
    let inputFound = false;
    for (let i = 0; i < 4; i++) {
      try {
        searchInput = await $('android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")');
        if (await searchInput.isDisplayed() && await searchInput.isEnabled()) {
          await searchInput.setValue('crucero del norte');
          console.log('⌨️ Se escribió "crucero del norte" en la barra de búsqueda.');
          await driver.pause(1500);
          await driver.pressKeyCode(66); // Enter
          console.log('⏎ Se presionó Enter en la barra de búsqueda.');
          inputFound = true;
          break;
        }
      } catch (e) {
        console.log('Intento', i+1, '- No se encontró la barra de búsqueda aún. Esperando...');
      }
      await driver.pause(1500);
    }
    if (!inputFound) {
      console.log('❌ No se pudo encontrar la barra de búsqueda para escribir.');
    }
  });
});

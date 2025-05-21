describe('Instagram - Abrir app y buscar', () => {
  it('debería abrir la app de Instagram, abrir explorar y buscar "crucero del norte"', async () => {
    const textoBusqueda = 'crucero del norte';

    // Reiniciar app para asegurar estado limpio
    await driver.execute('mobile: terminateApp', { appId: 'com.instagram.android' });
    await driver.pause(1000);
    await driver.execute('mobile: activateApp', { appId: 'com.instagram.android' });
    await driver.pause(5000);
    console.log('✅ Instagram debería estar abierta en el dispositivo.');

    // Buscar botón de Explorar (solo por resource-id)
    let explorarBtn;
    let found = false;
    for (let i = 0; i < 5; i++) {
      try {
        explorarBtn = await $('android=new UiSelector().resourceId("com.instagram.android:id/search_tab")');
        if (await explorarBtn.isDisplayed() && await explorarBtn.isEnabled()) {
          await explorarBtn.click();
          console.log('🔍 Se hizo click en el botón de Explorar (lupa)');
          found = true;
          break;
        }
      } catch (e) {
        console.log(`🔁 Intento ${i + 1}: No se encontró el botón de explorar aún. Esperando...`);
      }
      await driver.pause(1500);
    }
    if (!found) {
      console.log('❌ No se pudo encontrar el botón de explorar (lupa).');
      return;
    }

    // Esperar a que la pantalla de explorar cargue
    await driver.pause(2000);

    // Buscar barra de búsqueda y escribir
    const searchSelectors = [
      'android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")',
      'android=new UiSelector().className("android.widget.EditText")',
      'android=new UiSelector().textContains("Buscar")',
      'android=new UiSelector().descriptionContains("Buscar")'
    ];
    let searchInput;
    let inputFound = false;
    for (let i = 0; i < 4; i++) {
      for (const selector of searchSelectors) {
        try {
          searchInput = await $(selector);
          if (await searchInput.isDisplayed() && await searchInput.isEnabled()) {
            await searchInput.click();
            await searchInput.clearValue();
            await driver.pause(1000);
            await searchInput.setValue(textoBusqueda);
            console.log(`⌨️ Se escribió "${textoBusqueda}" en la barra de búsqueda con selector: ${selector}`);
            await driver.pause(1000);
            await driver.pressKeyCode(66); // Enter
            console.log('⏎ Se presionó Enter en la barra de búsqueda.');
            inputFound = true;
            break;
          }
        } catch (e) {
          if (i === 3 && selector === searchSelectors[searchSelectors.length - 1]) {
            console.log('❌ No se encontró la barra de búsqueda con ninguno de los selectores.');
          }
        }
      }
      if (inputFound) break;
      await driver.pause(1500);
    }
    if (!inputFound) {
      console.log('❌ No se pudo encontrar la barra de búsqueda para escribir.');
      return;
    }

    // Esperar y seleccionar el primer resultado visible
    let resultFound = false;
    for (let i = 0; i < 5; i++) {
      try {
        const firstResult = await $('android=new UiSelector().resourceIdMatches(".*row_search_user_container|row_search_hashtag_container|row_search_place_container|row_search_keyword_container.*")');
        if (await firstResult.isDisplayed() && await firstResult.isEnabled()) {
          await firstResult.click();
          console.log('✅ Se seleccionó el primer resultado de búsqueda.');
          resultFound = true;
          break;
        }
      } catch (e) {
        console.log(`🔁 Intento ${i + 1}: No se encontró ningún resultado aún. Esperando...`);
      }
      await driver.pause(1500);
    }
    if (!resultFound) {
      console.log('❌ No se encontró ningún resultado de búsqueda para seleccionar.');
    }
  });
});

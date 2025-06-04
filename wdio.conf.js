exports.config = {
    //
    // Runner Configuration
    //
    runner: 'local',
  
    //
    // Dirección y puerto de Appium
    //
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
  
    //
    // Specs
    //
    specs: [
      './test/specs/**/*.js'
    ],
    exclude: [
      './test/specs/monitor.js'
    ],
  
    //
    // Máximo de instancias simultáneas
    //
    maxInstances: 1,
  
    //
    // Capabilities: dos dispositivos, cada uno con su systemPort distinto
    //
    capabilities: [
      {
        // Dispositivo 1
        platformName: 'Android',
        'appium:udid': 'ZY22HRRMDX',
        'appium:deviceName': 'motorola_edge_40_pro',
        'appium:platformVersion': '15',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.instagram.android',
        'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 60000,
        'appium:autoGrantPermissions': true,
        'appium:systemPort': 8201,
        'appium:uiautomator2ServerLaunchTimeout': 120000,
        'appium:uiautomator2ServerInstallTimeout': 120000,
        'appium:androidInstallTimeout': 120000,
        'appium:adbExecTimeout': 60000,
      }
    ],
  
    //
    // No arrancamos Appium como servicio
    //
    services: [],
  
    //
    // Test config
    //
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 5,
  
    framework: 'mocha',
    reporters: ['spec'],
  
    mochaOpts: {
      ui: 'bdd',
      timeout: 300000,  // 5 minutos para cada spec
      bail: true
    }
  };
  
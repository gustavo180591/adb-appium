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
    maxInstances: 4,
  
    //
    // Capabilities: dos dispositivos, cada uno con su systemPort distinto
    //
    capabilities: [
      /* {
        // Dispositivo 1
        platformName: 'Android',
        'appium:udid': 'ZY22HRRMDX',
        'appium:deviceName': 'motorola_edge_40_pro',
        'appium:platformVersion': '15',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.instagram.android',
        'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 30000,
        'appium:autoGrantPermissions': true,
        // systemPort distinto para multiplexar
        'appium:systemPort': 8201,
        'appium:uiautomator2ServerLaunchTimeout': 60000,
        'appium:uiautomator2ServerInstallTimeout': 60000,
        'appium:androidInstallTimeout': 90000,
        'appium:adbExecTimeout': 60000,
      }, */
      {
        // Dispositivo 1
        platformName: 'Android',
        'appium:udid': 'HA1W5A4Y',
        'appium:deviceName': 'TB310FU',
        'appium:platformVersion': '13',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.instagram.android',
        'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 30000,
        'appium:autoGrantPermissions': true,
        // otro systemPort
        'appium:systemPort': 8200,
        'appium:uiautomator2ServerLaunchTimeout': 60000,
        'appium:uiautomator2ServerInstallTimeout': 60000,
        'appium:androidInstallTimeout': 90000,
        'appium:adbExecTimeout': 60000,
      },
      {
        // Dispositivo 2
        platformName: 'Android',
        'appium:udid': 'HA1W5T45',
        'appium:deviceName': 'TB310FU',
        'appium:platformVersion': '13',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.instagram.android',
        'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 30000,
        'appium:autoGrantPermissions': true,
        // otro systemPort
        'appium:systemPort': 8201,
        'appium:uiautomator2ServerLaunchTimeout': 60000,
        'appium:uiautomator2ServerInstallTimeout': 60000,
        'appium:androidInstallTimeout': 90000,
        'appium:adbExecTimeout': 60000,
      },
      {
        // Dispositivo 3
        platformName: 'Android',
        'appium:udid': 'HA1W6N1G',
        'appium:deviceName': 'TB310FU',
        'appium:platformVersion': '13',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.instagram.android',
        'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 30000,
        'appium:autoGrantPermissions': true,
        // otro systemPort
        'appium:systemPort': 8202,
        'appium:uiautomator2ServerLaunchTimeout': 60000,
        'appium:uiautomator2ServerInstallTimeout': 60000,
        'appium:androidInstallTimeout': 90000,
        'appium:adbExecTimeout': 60000,
      },
      {
        // Dispositivo 4
        platformName: 'Android',
        'appium:udid': 'HA1W4V5H',
        'appium:deviceName': 'TB310FU',
        'appium:platformVersion': '13',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.instagram.android',
        'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 30000,
        'appium:autoGrantPermissions': true,
        // otro systemPort
        'appium:systemPort': 8203,
        'appium:uiautomator2ServerLaunchTimeout': 60000,
        'appium:uiautomator2ServerInstallTimeout': 60000,
        'appium:androidInstallTimeout': 90000,
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
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
  
    framework: 'mocha',
    reporters: ['spec'],
  
    mochaOpts: {
      ui: 'bdd',
      timeout: 60000
    }
  };
  
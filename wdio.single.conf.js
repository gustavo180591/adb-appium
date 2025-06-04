exports.config = {
    runner: 'local',
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    
    specs: [
        './test/specs/proxy-change.js'
    ],
    exclude: [],
    
    maxInstances: 1,
    
    capabilities: [{
        platformName: 'Android',
        'appium:udid': 'ZY22HRRMDX',
        'appium:deviceName': 'motorola_edge_40_pro',
        'appium:platformVersion': '15',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.android.settings',
        'appium:appActivity': 'com.android.settings.Settings',
        'appium:noReset': true,
        'appium:newCommandTimeout': 60000,
        'appium:autoGrantPermissions': true,
        'appium:systemPort': 8201,
        'appium:uiautomator2ServerLaunchTimeout': 120000,
        'appium:uiautomator2ServerInstallTimeout': 120000,
        'appium:androidInstallTimeout': 120000,
        'appium:adbExecTimeout': 60000,
    }],
    
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 30000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 5,
    
    framework: 'mocha',
    reporters: ['spec'],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 300000,
        bail: true
    }
}; 
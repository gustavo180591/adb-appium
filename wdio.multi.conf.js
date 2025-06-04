exports.config = {
    runner: 'local',
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    
    specs: [
        './test/specs/instagram-login.js'
    ],
    exclude: [],
    
    maxInstances: 3,
    
    capabilities: [
        {
            platformName: 'Android',
            'appium:deviceName': 'Device2',
            'appium:platformVersion': '15',
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': 'com.instagram.android',
            'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
            'appium:noReset': true,
            'appium:newCommandTimeout': 60000,
            'appium:autoGrantPermissions': true,
            'appium:systemPort': 8202,
            'appium:uiautomator2ServerLaunchTimeout': 120000,
            'appium:uiautomator2ServerInstallTimeout': 120000,
            'appium:androidInstallTimeout': 120000,
            'appium:adbExecTimeout': 60000,
        },
        {
            platformName: 'Android',
            'appium:deviceName': 'Device3',
            'appium:platformVersion': '15',
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': 'com.instagram.android',
            'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
            'appium:noReset': true,
            'appium:newCommandTimeout': 60000,
            'appium:autoGrantPermissions': true,
            'appium:systemPort': 8203,
            'appium:uiautomator2ServerLaunchTimeout': 120000,
            'appium:uiautomator2ServerInstallTimeout': 120000,
            'appium:androidInstallTimeout': 120000,
            'appium:adbExecTimeout': 60000,
        },
        {
            platformName: 'Android',
            'appium:deviceName': 'Device4',
            'appium:platformVersion': '15',
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': 'com.instagram.android',
            'appium:appActivity': 'com.instagram.android.activity.MainTabActivity',
            'appium:noReset': true,
            'appium:newCommandTimeout': 60000,
            'appium:autoGrantPermissions': true,
            'appium:systemPort': 8204,
            'appium:uiautomator2ServerLaunchTimeout': 120000,
            'appium:uiautomator2ServerInstallTimeout': 120000,
            'appium:androidInstallTimeout': 120000,
            'appium:adbExecTimeout': 60000,
        }
    ],
    
    services: [],
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
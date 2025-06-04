const config = require('./config');

exports.config = {
    runner: 'local',
    hostname: config.appium.host,
    port: config.appium.port,
    path: config.appium.path,
    
    specs: [
        './test/specs/instagram-login.js'
    ],
    exclude: [],
    
    maxInstances: 3,
    
    capabilities: [
        {
            platformName: 'Android',
            'appium:udid': config.devices.device2.udid,
            'appium:deviceName': config.devices.device2.name,
            'appium:platformVersion': config.devices.device2.platformVersion,
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': config.apps.instagram.package,
            'appium:appActivity': config.apps.instagram.activity,
            'appium:noReset': true,
            'appium:newCommandTimeout': config.timeouts.command,
            'appium:autoGrantPermissions': true,
            'appium:systemPort': config.devices.device2.systemPort,
            'appium:uiautomator2ServerLaunchTimeout': config.timeouts.uiautomator2Launch,
            'appium:uiautomator2ServerInstallTimeout': config.timeouts.uiautomator2Install,
            'appium:androidInstallTimeout': config.timeouts.androidInstall,
            'appium:adbExecTimeout': config.timeouts.adbExec
        },
        {
            platformName: 'Android',
            'appium:udid': config.devices.device3.udid,
            'appium:deviceName': config.devices.device3.name,
            'appium:platformVersion': config.devices.device3.platformVersion,
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': config.apps.instagram.package,
            'appium:appActivity': config.apps.instagram.activity,
            'appium:noReset': true,
            'appium:newCommandTimeout': config.timeouts.command,
            'appium:autoGrantPermissions': true,
            'appium:systemPort': config.devices.device3.systemPort,
            'appium:uiautomator2ServerLaunchTimeout': config.timeouts.uiautomator2Launch,
            'appium:uiautomator2ServerInstallTimeout': config.timeouts.uiautomator2Install,
            'appium:androidInstallTimeout': config.timeouts.androidInstall,
            'appium:adbExecTimeout': config.timeouts.adbExec
        },
        {
            platformName: 'Android',
            'appium:udid': config.devices.device4.udid,
            'appium:deviceName': config.devices.device4.name,
            'appium:platformVersion': config.devices.device4.platformVersion,
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': config.apps.instagram.package,
            'appium:appActivity': config.apps.instagram.activity,
            'appium:noReset': true,
            'appium:newCommandTimeout': config.timeouts.command,
            'appium:autoGrantPermissions': true,
            'appium:systemPort': config.devices.device4.systemPort,
            'appium:uiautomator2ServerLaunchTimeout': config.timeouts.uiautomator2Launch,
            'appium:uiautomator2ServerInstallTimeout': config.timeouts.uiautomator2Install,
            'appium:androidInstallTimeout': config.timeouts.androidInstall,
            'appium:adbExecTimeout': config.timeouts.adbExec
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
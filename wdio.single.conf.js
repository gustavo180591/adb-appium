const config = require('./config');

exports.config = {
    runner: 'local',
    hostname: config.appium.host,
    port: config.appium.port,
    path: config.appium.path,
    
    specs: [
        './test/specs/proxy-change.js'
    ],
    exclude: [],
    
    maxInstances: 1,
    
    capabilities: [{
        platformName: 'Android',
        'appium:udid': config.devices.device1.udid,
        'appium:deviceName': config.devices.device1.name,
        'appium:platformVersion': config.devices.device1.platformVersion,
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': config.apps.settings.package,
        'appium:appActivity': config.apps.settings.activity,
        'appium:noReset': true,
        'appium:newCommandTimeout': config.timeouts.command,
        'appium:autoGrantPermissions': true,
        'appium:systemPort': config.devices.device1.systemPort,
        'appium:uiautomator2ServerLaunchTimeout': config.timeouts.uiautomator2Launch,
        'appium:uiautomator2ServerInstallTimeout': config.timeouts.uiautomator2Install,
        'appium:androidInstallTimeout': config.timeouts.androidInstall,
        'appium:adbExecTimeout': config.timeouts.adbExec
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
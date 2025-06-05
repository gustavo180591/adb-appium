require('dotenv').config();

const config = {
    appium: {
        host: process.env.APPIUM_HOST || '127.0.0.1',
        port: parseInt(process.env.APPIUM_PORT) || 4723,
        path: process.env.APPIUM_BASE_PATH || '/'
    },
    
    devices: {
        device1: {
            udid: process.env.DEVICE1_UDID || 'R58N857S75Y',
            name: process.env.DEVICE1_NAME || 'SM-A715F',
            platformVersion: process.env.DEVICE1_PLATFORM_VERSION || '13',
            systemPort: parseInt(process.env.DEVICE1_SYSTEM_PORT) || 8201
        },
        /* device1: {
            udid: process.env.DEVICE1_UDID || 'ZY22HRRMDX',
            name: process.env.DEVICE1_NAME || 'motorola_edge_40_pro',
            platformVersion: process.env.DEVICE1_PLATFORM_VERSION || '15',
            systemPort: parseInt(process.env.DEVICE1_SYSTEM_PORT) || 8201
        }, */
        device2: {
            udid: process.env.DEVICE2_UDID || 'DEVICE_ID_2',
            name: process.env.DEVICE2_NAME || 'Device2',
            platformVersion: process.env.DEVICE2_PLATFORM_VERSION || '15',
            systemPort: parseInt(process.env.DEVICE2_SYSTEM_PORT) || 8202
        },
        device3: {
            udid: process.env.DEVICE3_UDID || 'DEVICE_ID_3',
            name: process.env.DEVICE3_NAME || 'Device3',
            platformVersion: process.env.DEVICE3_PLATFORM_VERSION || '15',
            systemPort: parseInt(process.env.DEVICE3_SYSTEM_PORT) || 8203
        },
        device4: {
            udid: process.env.DEVICE4_UDID || 'DEVICE_ID_4',
            name: process.env.DEVICE4_NAME || 'Device4',
            platformVersion: process.env.DEVICE4_PLATFORM_VERSION || '15',
            systemPort: parseInt(process.env.DEVICE4_SYSTEM_PORT) || 8204
        }
    },
    
    timeouts: {
        command: parseInt(process.env.COMMAND_TIMEOUT) || 60000,
        uiautomator2Launch: parseInt(process.env.UI_AUTOMATOR2_LAUNCH_TIMEOUT) || 120000,
        uiautomator2Install: parseInt(process.env.UI_AUTOMATOR2_INSTALL_TIMEOUT) || 120000,
        androidInstall: parseInt(process.env.ANDROID_INSTALL_TIMEOUT) || 120000,
        adbExec: parseInt(process.env.ADB_EXEC_TIMEOUT) || 60000
    },
    
    apps: {
        settings: {
            package: process.env.SETTINGS_PACKAGE || 'com.android.settings',
            activity: process.env.SETTINGS_ACTIVITY || 'com.android.settings.Settings'
        },
        instagram: {
            package: process.env.INSTAGRAM_PACKAGE || 'com.instagram.android',
            activity: process.env.INSTAGRAM_ACTIVITY || 'com.instagram.android.activity.MainTabActivity'
        }
    }
};

module.exports = config; 
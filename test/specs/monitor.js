const shell = require('shelljs');
const chalk = require('chalk');
const { spawn } = require('child_process');
const moment = require('moment');

console.log(chalk.blue('Monitoreando dispositivo Android (Ctrl+C para salir)...'));

let lastApp = '';
let lastUnlock = false;

// Obtener la app activa en foreground
function getCurrentApp() {
    const out = shell.exec('adb shell dumpsys window windows', { silent: true }).stdout;
    const match = out.match(/mCurrentFocus=Window\{[^\s]+\s([^\}\/]+)\/([^\}]+)\}/);
    if (match) {
        return match[1]; // paquete de la app, ej: com.instagram.android
    }
    return 'Desconocido';
}

// Verificar si el teléfono está desbloqueado
function isUnlocked() {
    const out = shell.exec('adb shell dumpsys window', { silent: true }).stdout;
    return out.includes('mDreamingLockscreen=false') || out.includes('mShowingLockscreen=false');
}

// Monitoreo por intervalos
setInterval(() => {
    try {
        const unlocked = isUnlocked();
        if (unlocked !== lastUnlock) {
            if (unlocked) {
                console.log(chalk.green('>> Dispositivo DESBLOQUEADO'));
            } else {
                console.log(chalk.yellow('>> Dispositivo BLOQUEADO'));
            }
            lastUnlock = unlocked;
        }
        if (unlocked) {
            const app = getCurrentApp();
            if (app !== lastApp) {
                console.log(chalk.cyan(`>> App activa: ${app}`));
                // Detectar ingreso a Instagram
                if (app === 'com.instagram.android') {
                    console.log(chalk.bgMagenta.bold('>>> Ingresaste a INSTAGRAM'));
                }
                lastApp = app;
            }
        }
    } catch (err) {
        console.log(chalk.red('Error al consultar ADB:'), err);
    }
}, 1200);

// Logcat como stream (no shelljs, mejor child_process)
const logcat = spawn('adb', ['logcat']);
logcat.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
        // Detecta logs con "Instagram" o "unlock" o "river plate"
        if (
            line.toLowerCase().includes('instagram') ||
            line.toLowerCase().includes('unlock') ||
            line.toLowerCase().includes('river plate')
        ) {
            console.log(chalk.magenta('[LOGCAT] ' + line.trim()));
        }
        if (
            line.includes('com.instagram.android') &&
            (line.includes('showSoftInput() view=com.instagram.ui.widget.searchedittext.SearchEditText') ||
                line.includes('GoogleInputMethodService.onStartInput') ||
                line.includes('actionName=SEARCH'))
        ) {
            const time = moment().format('HH:mm:ss');
            console.log(chalk.bgGreen.bold(`[${time}] [INSTAGRAM] Búsqueda detectada.`));
        }
    });
});

logcat.stderr.on('data', (data) => {
    console.log(chalk.red('[LOGCAT error] ' + data));
});

process.on('SIGINT', () => {
    logcat.kill();
    console.log('\nBye!');
    process.exit();
});


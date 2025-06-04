const { spawn } = require('child_process');
const readline = require('readline');

// Configuración de colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

// Función para ejecutar comandos
function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { stdio: 'inherit' });
        
        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });

        process.on('error', (err) => {
            reject(err);
        });
    });
}

// Función para mostrar el menú
function showMenu() {
    console.log(`\n${colors.bright}=== Control de Pruebas Automatizadas ===${colors.reset}`);
    console.log(`${colors.green}1. Ejecutar proxy-change (un dispositivo)`);
    console.log(`2. Ejecutar instagram-login (múltiples dispositivos)`);
    console.log(`3. Verificar dispositivos conectados`);
    console.log(`4. Instalar/Actualizar drivers de Appium`);
    console.log(`5. Iniciar servidor Appium`);
    console.log(`0. Salir${colors.reset}`);
}

// Función para manejar la selección del usuario
async function handleSelection(selection) {
    try {
        switch (selection) {
            case '1':
                console.log(`${colors.yellow}Ejecutando proxy-change en un dispositivo...${colors.reset}`);
                await runCommand('npx', ['wdio', 'wdio.single.conf.js']);
                break;
            
            case '2':
                console.log(`${colors.yellow}Ejecutando instagram-login en múltiples dispositivos...${colors.reset}`);
                await runCommand('npx', ['wdio', 'wdio.multi.conf.js']);
                break;
            
            case '3':
                console.log(`${colors.blue}Verificando dispositivos conectados...${colors.reset}`);
                await runCommand('adb', ['devices']);
                break;
            
            case '4':
                console.log(`${colors.blue}Instalando/Actualizando drivers de Appium...${colors.reset}`);
                await runCommand('appium', ['driver', 'install', 'uiautomator2']);
                break;
            
            case '5':
                console.log(`${colors.green}Iniciando servidor Appium...${colors.reset}`);
                await runCommand('appium');
                break;
            
            case '0':
                console.log(`${colors.yellow}Saliendo...${colors.reset}`);
                process.exit(0);
                break;
            
            default:
                console.log(`${colors.red}Opción no válida${colors.reset}`);
        }
    } catch (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    }
}

// Función principal
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function askQuestion() {
        showMenu();
        rl.question(`\n${colors.bright}Seleccione una opción: ${colors.reset}`, async (answer) => {
            await handleSelection(answer);
            if (answer !== '0') {
                // Esperar un momento antes de mostrar el menú de nuevo
                setTimeout(askQuestion, 1000);
            } else {
                rl.close();
            }
        });
    }

    await askQuestion();
}

// Iniciar el programa
main().catch(error => {
    console.error(`${colors.red}Error fatal: ${error.message}${colors.reset}`);
    process.exit(1);
}); 
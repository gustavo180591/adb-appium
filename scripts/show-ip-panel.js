const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const LOG_FILE = path.join(__dirname, '../logs/ip-changes.log');

function formatIPv6(ip) {
    // Si es una dirección IPv6, formatearla para mejor legibilidad
    if (ip.includes(':')) {
        // Dividir en grupos de 4 caracteres
        const groups = ip.match(/.{1,4}/g) || [];
        return groups.join(':');
    }
    return ip;
}

function showIPPanel() {
    console.clear();
    console.log(chalk.bold.blue('📊 Panel de Cambios de IP\n'));

    if (!fs.existsSync(LOG_FILE)) {
        console.log(chalk.yellow('No hay registros de cambios de IP aún.'));
        return;
    }

    const logs = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(Boolean);
    
    if (logs.length === 0) {
        console.log(chalk.yellow('No hay registros de cambios de IP aún.'));
        return;
    }

    // Mostrar los últimos 10 cambios
    const recentLogs = logs.slice(-10).reverse();
    
    console.log(chalk.bold('Últimos 10 cambios de IP:\n'));
    console.log(chalk.bold('Fecha y Hora'.padEnd(30) + 'IP Anterior'.padEnd(40) + 'IP Nueva'));
    console.log(chalk.gray('─'.repeat(100)));

    recentLogs.forEach(log => {
        const [timestamp, oldIP, newIP] = log.split(' | ');
        const date = new Date(timestamp).toLocaleString();
        const formattedOldIP = formatIPv6(oldIP.split(': ')[1]);
        const formattedNewIP = formatIPv6(newIP.split(': ')[1]);
        
        console.log(
            chalk.white(date.padEnd(30)) +
            chalk.yellow(formattedOldIP.padEnd(40)) +
            chalk.green(formattedNewIP)
        );
    });

    console.log(chalk.gray('\n─'.repeat(100)));
    console.log(chalk.bold(`Total de cambios registrados: ${logs.length}`));
}

// Ejecutar el panel
showIPPanel(); 
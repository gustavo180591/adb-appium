#!/bin/bash

echo "🚀 Iniciando proceso de pruebas..."

# Ejecutar verificaciones previas
echo "🔍 Ejecutando verificaciones previas..."
./check-devices.sh
CHECK_RESULT=$?

if [ $CHECK_RESULT -ne 0 ]; then
    echo "❌ Las verificaciones previas fallaron"
    exit 1
fi

# Ejecutar el test de proxy primero
echo "📡 Configurando hotspot..."
SPEC_FILE=proxy-change.js npx wdio run ./wdio.conf.js --spec ./test/specs/proxy-change.js
PROXY_RESULT=$?

# Verificar si el proxy se configuró correctamente
if [ $PROXY_RESULT -eq 0 ]; then
    echo "✅ Hotspot configurado correctamente"
    
    # Esperar un momento para asegurar que la conexión esté estable
    echo "⏳ Esperando 10 segundos para estabilizar la conexión..."
    sleep 10
    
    # Ejecutar el test de dar like
    echo "🤖 Ejecutando test de dar like..."
    SPEC_FILE=dar-like.js npx wdio run ./wdio.conf.js --spec ./test/specs/dar-like.js
else
    echo "❌ Error al configurar el hotspot"
    exit 1
fi 
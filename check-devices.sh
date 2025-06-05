#!/bin/bash

# Colores para los mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Lista de dispositivos requeridos
REQUIRED_DEVICES=("R58N857S75Y" "HA1W51MA")
HOTSPOT_DEVICE="R58N857S75Y"
WIFI_SSID="A71"
WIFI_PASSWORD="12345678"

echo "🔍 Verificando dispositivos conectados..."

# Obtener lista de dispositivos conectados
CONNECTED_DEVICES=$(adb devices | grep -v "List" | cut -f1)

# Verificar cada dispositivo requerido
MISSING_DEVICES=()
for device in "${REQUIRED_DEVICES[@]}"; do
    if ! echo "$CONNECTED_DEVICES" | grep -q "$device"; then
        MISSING_DEVICES+=("$device")
    else
        echo -e "${GREEN}✓ Dispositivo $device conectado${NC}"
    fi
done

# Si faltan dispositivos, mostrar error y salir
if [ ${#MISSING_DEVICES[@]} -ne 0 ]; then
    echo -e "${RED}❌ Error: Faltan los siguientes dispositivos:${NC}"
    for device in "${MISSING_DEVICES[@]}"; do
        echo -e "${RED}   - $device${NC}"
    done
    exit 1
fi

echo -e "${GREEN}✓ Todos los dispositivos requeridos están conectados${NC}"

# Verificar conexión WiFi en el dispositivo HA1W51MA
echo "📱 Verificando conexión WiFi en HA1W51MA..."

# Obtener información de la red WiFi
WIFI_INFO=$(adb -s HA1W51MA shell "dumpsys wifi | grep 'SSID'")

if echo "$WIFI_INFO" | grep -q "$WIFI_SSID"; then
    echo -e "${GREEN}✓ Conectado a la red $WIFI_SSID${NC}"
else
    echo -e "${RED}❌ Error: No conectado a la red $WIFI_SSID${NC}"
    echo -e "${YELLOW}ℹ️ Por favor, conecta el dispositivo HA1W51MA a la red:${NC}"
    echo -e "${YELLOW}   SSID: $WIFI_SSID${NC}"
    echo -e "${YELLOW}   Password: $WIFI_PASSWORD${NC}"
    exit 1
fi

# Verificar que hay conexión a internet
echo "🌐 Verificando conexión a internet..."
if adb -s HA1W51MA shell ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Conexión a internet verificada${NC}"
else
    echo -e "${RED}❌ Error: No hay conexión a internet${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Todas las verificaciones completadas con éxito${NC}"
exit 0 
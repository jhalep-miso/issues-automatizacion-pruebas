# Automatización de Pruebas con Kraken

Este repositorio contiene los scripts necesarios para automatizar pruebas utilizando Kraken y Playwright en una aplicación web, específicamente el [CMS Ghost](https://ghost-c158.onrender.com/ghost). Las instrucciones a continuación te guiarán a través del proceso de configuración y ejecución de las pruebas.

## Participantes

- **Sebastián Lemus Cadena**: [correo@uniandes.edu.co](mailto:s.lemus@uniandes.edu.co)
- **Sergio Augusto Celis Esteban**: [correo@uniandes.edu.co](mailto:s.celise@uniandes.edu.co)
- **Alejandro Peña**: [correo@uniandes.edu.co](mailto:ja.penat1@uniandes.edu.co)
- **Romel Palomino Jaramillo**: [correo@uniandes.edu.co](mailto:r.palominoj@uniandes.edu.co)

## Instalación y Ejecución de las Pruebas en Kraken

Antes de comenzar, asegúrate de cumplir con los siguientes requisitos:

1. **ADB instalado:** Asegúrate de tener Android Debug Bridge (ADB) instalado en tu sistema. Puedes obtenerlo como parte del kit de desarrollo de Android (SDK).

2. **Appium instalado:** Instala Appium globalmente usando npm con el siguiente comando:

```bash
npm install -g appium
```


3. **Node.js versión 18:** Asegúrate de tener Node.js instalado en tu sistema, preferiblemente la versión 18.

4. **URL de Ghost:** Ajusta la URL de la instancia de Ghost en el archivo de propiedades `properties.json`. Puedes encontrar el archivo en este repositorio en [properties.json](https://github.com/jhalep-miso/issues-automatizacion-pruebas/blob/main/properties.json).

5. **Lista de steps predefinidos Kraken:** Puedes encontrar la lista de steps predefinidos para Kraken en el siguiente enlace: [Lista de steps predefinidos Kraken](https://github.com/TheSoftwareDesignLab/Kraken/blob/master/src/steps/web.ts).

Una vez que hayas cumplido con los requisitos anteriores, sigue estos pasos para ejecutar las pruebas:

1. Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/jhalep-miso/issues-automatizacion-pruebas.git
```
3. Navega hasta el directorio del repositorio:
```bash
cd issues-automatizacion-pruebas
```
3. Instala las dependencias de Node.js utilizando npm:
```bash
npm install
```

4. Ejecuta los tests de Kraken con el siguiente comando:
```bash
npm test
```

¡Eso es todo! Los tests de Kraken se ejecutarán automáticamente, y podrás ver los resultados en la consola.

## Instalación y Ejecución de las Pruebas con Playwright

Para instalar y ejecutar las pruebas con Playwright, sigue los siguientes pasos:

1. **Instalación de Playwright:** Ejecuta el siguiente comando para instalar Playwright en tu proyecto:
```bash
npm install playwright
```

2. **Configuración de las Pruebas:** Crea tus scripts de prueba utilizando Playwright según la documentación proporcionada en [Playwright Documentation](https://playwright.dev/docs/intro).

3. **Ejecución de las Pruebas:** Una vez que hayas configurado tus pruebas, puedes ejecutarlas utilizando el siguiente comando:
```bash
npx playwright test
```
¡Listo! Ahora puedes ejecutar tus pruebas con Playwright y aprovechar sus poderosas capacidades de automatización de pruebas.
## Contribución

Si deseas contribuir a este repositorio, no dudes en hacerlo. Puedes abrir un issue para reportar problemas o enviar solicitudes de extracción con mejoras o correcciones.

¡Gracias por tu interés en contribuir!

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

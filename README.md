# Automatización de Pruebas con Kraken

Este repositorio contiene los scripts necesarios para automatizar pruebas utilizando Kraken y Playwright en una aplicación web, específicamente el [CMS Ghost](https://ghost-ebcl.onrender.com/ghost). Las instrucciones a continuación te guiarán a través del proceso de configuración y ejecución de las pruebas.

## Participantes

- **Sebastián Lemus Cadena**: [s.lemus@uniandes.edu.co](mailto:s.lemus@uniandes.edu.co)
- **Sergio Augusto Celis Esteban**: [s.celise@uniandes.edu.co](mailto:s.celise@uniandes.edu.co)
- **Alejandro Peña**: [ja.penat1@uniandes.edu.co](mailto:ja.penat1@uniandes.edu.co)
- **Romel Palomino Jaramillo**: [r.palominoj@uniandes.edu.co](mailto:r.palominoj@uniandes.edu.co)

## Visual Regression Testing: Comparación de Imágenes y Generación de Reportes

Este proyecto tiene la capacidad de realizar VRT entre dos versiones de Ghost, a partir de los screenshots que se toman en cada paso de cada escenario de prueba en `Kraken`. Dentro de la carpeta `resemble-vrt` se encuentra un script que recibe como entrada dos paths hacia los directorios que contienen los screenshots tomados para cada versión de Ghost, y un tercer path hacia el directorio donde se quiere guardar los resultados del VRT. En este directorio de resultados, se guardarán las imagen calculadas por `ResembleJS` a partir de la comparación de cada paso entre versiones, así como el reporte final en un archivo HTML. En este script se asume lo siguiente sobre las carpetas a comparar:

* Cada imágen corresponde a un step/paso de un escenario
* La carpeta padre de una imagen corresponde al nombre del escenario al que pertenece
* Los escenarios y pasos que se van a comparar tienen el mismo path relativo con respecto a cada directorio base

Por ejemplo, dada la siguiente estructura de archivos, asumamos que se quiere comparar las carpetas `ghost-8.50.0`y `ghost-3.42.0`, y que se generarán los resultados en la carpeta `results`

```
├── ghost-e2e-kraken
│   └── ghost-5.80.0
│       ├── 01-create-post-for-members-only
│       │   ├── step1-navigateToLogin.png
│       │   ├── step10-setPublishedPostUrl.png
│       │   ├── step11-navigateToPublishedPost.png
│       │   └── ...
│       └── 02-create-post-for-paid-members
│       │   ├── step1-navigateToLogin.png
│       │   ├── step10-setPublishedPostUrl.png
│       │   ├── step11-navigateToPublishedPost.png
│       │   └── ...
        └── 03-create-post-change-url
│       │   ├── step1-navigateToLogin.png
│       │   ├── step10-setPublishedPostUrl.png
│       │   ├── step11-navigateToPublishedPost.png
│       │   └── ...
└── ghost-e2e-kraken-vrt
    └── ghost-3.42.0
        └── 03-create-post-change-url
            ├── step1-navigateToLogin.png
            ├── step10-setPublishedPostUrl.png
            ├── step11-navigateToPublishedPost.png
```

Se compararán las imágenes entre las carpetas (escenarios) `ghost-e2e-kraken/ghost-5.80.0/03-create-post-change-url` y `ghost-e2e-kraken-vrt/ghost-3.42.0/03-create-post-change-url`, y se guardaran los resultados en `ghost-e2e-kraken/results/03-create-post-change-url` para este escenario particular. La comparación ocurre por cada paraja de imagen que tengan el mismo nombre de archivo. Para este ejemplo, se hace lo siguiente:

* Se compara `ghost-3.42.0/03-create-post-change-url/step1-navigateToLogin.png` con `ghost-3.42.0/03-create-post-change-url/step1-navigateToLogin.png`, y se guarda el resultado en `results/03-create-post-change-url/step1-navigateToLogin.png`
* Se compara `ghost-3.42.0/03-create-post-change-url/step10-setPublishedPostUrl.png` con `ghost-3.42.0/03-create-post-change-url/step10-setPublishedPostUrl.png`, y se guarda el resultado en `results/03-create-post-change-url/step10-setPublishedPostUrl.png`
* Se compara `ghost-3.42.0/03-create-post-change-url/step10-setPublishedPostUrl.png` con `ghost-3.42.0/03-create-post-change-url/step10-setPublishedPostUrl.png`, y se guarda el resultado en `results/03-create-post-change-url/step10-setPublishedPostUrl.png`
* Se guarda un reporte para el escenario `03-create-post-change-url` en `results/03-create-post-change-url/report.hmtl`
* para cada escenario se repite el proceso anterior, por cada paso del escenario
* Al terminar de realizar las comparaciones entre todos los escenarios, se guarda un reporte completo sobre todos los escenarios en `results/report.html`

### Pasos para Generación del Reporte VRT

1. Ejecutar las pruebas de Kraken el la carpeta `ghost-e2e-kraken-vrt` siguiendo los pasos de la sección [Instalación y Ejecución de las Pruebas en Kraken](instalación-y-ejecución-de-las-pruebas-en-kraken). Al finalizar, se debió crear una carpeta `ghost-e2e-kraken-vrt/ghost-3.42.0` que contiene los screenshots de las pruebas
2. Ejecutar las pruebas de Kraken el la carpeta `ghost-e2e-kraken` siguiendo los pasos de la sección [Instalación y Ejecución de las Pruebas en Kraken](instalación-y-ejecución-de-las-pruebas-en-kraken). Al finalizar, se debió crear una carpeta `ghost-e2e-kraken/ghost-5.80.0` que contiene los screenshots de las pruebas
3. Ir al directorio `cd resemble-vrt`
4. Instalar las dependencias del proyecto. Asegurarse de que tiene instaladas las [dependencias requeridas para node-canvas](https://github.com/Automattic/node-canvas?tab=readme-ov-file#compiling) en su computador, ya que `resemblejs` depende de `node-canvas`. Ejecutar `npm install` para instalar las dependencias del projecto
5. Ejecutar el script para realizar el VRT y generar el reporte (puede cambiar los argumentos dependiendo de dónde se tenga las carpetas con las imágenes):
```bash
npm run vrt ../ghost-e2e-kraken-vrt/ghost-3.42.0 ../ghost-e2e-kraken/ghost-5.80.0 ../vrt-comparison-results
```

6. Abrir el archivo `../vrt-comparison-results/report.html` en un navegador, preferiblemente Chrome; encontramos algunos problemas en firefox donde las imágenes no se cargan debido a falta de permisos. (Si se especificó otra carpeta de resultados diferente a `vrt-comparison-results`, buscar el `report.html` dentro de la carpeta especificada)
7. Al abrir el reporte, debería ver algo similar a lo siguiente:

<img width="1476" alt="image" src="https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/42351248/a07ae4c1-ad16-49da-bec9-578dba7af99a">

8. Al hacer click en alguno de los escenarios, debería ver un reporte parecido a:

<img width="1476" alt="image" src="https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/42351248/95c2ea98-99bd-4b81-8730-48cc0b66e572">


## Instalación y Ejecución de las Pruebas en Kraken

Antes de comenzar, asegúrate de cumplir con los siguientes requisitos:

1. **ADB instalado:** Asegúrate de tener Android Debug Bridge (ADB) instalado en tu sistema. Puedes obtenerlo como parte del kit de desarrollo de Android (SDK).

2. **Appium instalado:** Instala Appium globalmente usando npm con el siguiente comando:

```bash
npm install -g appium
```


3. **Node.js versión 18:** Asegúrate de tener Node.js instalado en tu sistema, preferiblemente la versión 18.

4. **URL de Ghost:** Ajusta la URL de la instancia de Ghost en el archivo de propiedades `properties.json`. Puedes encontrar el archivo en este repositorio en [properties.json](https://github.com/jhalep-miso/issues-automatizacion-pruebas/blob/main/ghost-e2e-kraken/properties.json).

5. **Lista de steps predefinidos Kraken:** Puedes encontrar la lista de steps predefinidos para Kraken en el siguiente enlace: [Lista de steps predefinidos Kraken](https://github.com/TheSoftwareDesignLab/Kraken/blob/master/src/steps/web.ts).

Una vez que hayas cumplido con los requisitos anteriores, sigue estos pasos para ejecutar las pruebas:

1. Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/jhalep-miso/issues-automatizacion-pruebas.git
```
2. Navega hasta el directorio del repositorio donde se encuentran los tests e2e de kraken:
```bash
cd issues-automatizacion-pruebas/ghost-e2e-kraken
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

1. Clona este repositorio en tu máquina local:
```bash
git clone https://github.com/jhalep-miso/issues-automatizacion-pruebas.git
```

2. Navega al directorio `ghost-e2e-playwright`
```bash
cd issues-automatizacion-pruebas/ghost-e2e-playwright
```

3. Instala las dependencias del proyecto. Estas pruebas utilizan únicamente `playwright` y `faker` como dependencias
```bash
npm install
```

4. Asegurarse de que las líneas correspondientes a la configuración de la URL `https://ghost-ebcl.onrender.com` estén descomentadas en el archivo `ghost-e2e-playwright/tests/Config.ts` como se muestra a continuación:

<img width="614" alt="image" src="https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/42351248/c10b9e0c-dd57-46fb-89e6-03e7b5f73d80">

5. Ejecuta las pruebas utilizando alguno de los siguientes dos comandos. El segundo permite visualizar las pruebas de forma interactiva con la UI de playwright:
```bash
npx playwright test
```
```bash
npx playwright test --ui
```

6. Si se está utilizando playwright en modo `--ui`, asegurarse de que en el panel de la parte superior izquierda, el campo de `Projects` esté configurado con el valor `all`, para que se muestren todos los tests, como se muestra en la siguiente imagen:

<img width="360" alt="image" src="https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/42351248/7c77f001-3a59-4d77-86af-ca5b4a317bb9">


## Contribución

Si deseas contribuir a este repositorio, no dudes en hacerlo. Puedes abrir un issue para reportar problemas o enviar solicitudes de extracción con mejoras o correcciones.

¡Gracias por tu interés en contribuir!

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

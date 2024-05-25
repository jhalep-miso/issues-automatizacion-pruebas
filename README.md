# Automatización de Pruebas con Kraken

Este repositorio contiene los scripts necesarios para automatizar pruebas utilizando Kraken y Playwright en una aplicación web, específicamente el [CMS Ghost V5.80.0](https://ghost-ebcl.onrender.com/ghost) y [CMS Ghost V3.42.0](https://ghost-fakk.onrender.com/ghost). Las instrucciones a continuación te guiarán a través del proceso de configuración y ejecución de las pruebas que se realizaron en este proyecto; en particular, pruebas con APIs de automatización (Kraken y Playwright), pruebas VRT y pruebas adaptadas con diferentes estrategias de generación de datos

## Participantes

- **Sebastián Lemus Cadena**: [s.lemus@uniandes.edu.co](mailto:s.lemus@uniandes.edu.co)
- **Sergio Augusto Celis Esteban**: [s.celise@uniandes.edu.co](mailto:s.celise@uniandes.edu.co)
- **Alejandro Peña**: [ja.penat1@uniandes.edu.co](mailto:ja.penat1@uniandes.edu.co)
- **Romel Palomino Jaramillo**: [r.palominoj@uniandes.edu.co](mailto:r.palominoj@uniandes.edu.co)

## Tabla de contenidos

- [Pruebas manuales exploratorias](#pruebas-manuales-exploratorias)
- [Pruebas con APIs de automatización](#pruebas-con-apis-de-automatización)
  - [Instalación y Ejecución de las Pruebas en Kraken](#instalación-y-ejecución-de-las-pruebas-en-kraken)
  - [Instalación y Ejecución de las Pruebas con Playwright](#instalación-y-ejecución-de-las-pruebas-con-playwright)
- Pruebas VRT
  - ResembleJS
  - BackstopJS
- Estrategias de Generación de Datos

## Pruebas manuales exploratorias

Para la entrega de la semana 8 del curso, se realizaron Pruebas Manuales Exploratorias como parte de la semana 1 correspondiente a la estrategia de pruebas final. Durante este ejercicio ser registraron 20 incidencias nuevas en [el Inventario de Pruebas](https://docs.google.com/spreadsheets/d/1HwMR1rplEF15GkA96m9bVNkIb6jD0AP0z8fek8IK8-A/edit#gid=108691601)

## Pruebas con APIs de automatización

Se realizaron pruebas de extremo a extremo utilizando Kraken y Playwright. A continuación se presentan los pasos necesarios para ejecutar las pruebas en cada herramienta

### Instalación y Ejecución de las Pruebas en Kraken

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

### Instalación y Ejecución de las Pruebas con Playwright

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

4. Asegurarse que la configuración de las pruebas que se esté utilizando sea la correspondiente a la URL [https://ghost-ebcl.onrender.com](https://ghost-wfml.onrender.com) dentro del archivo `ghost-e2e-playwright/tests/Config.ts`. Existen dos configuraciones, una local y otra para la instancia real de Ghost, asegurarse de que se esté exportando el valor correcto (`export const Config = config`):

<img width="481" alt="image" src="https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/42351248/51074a50-ac01-429a-9baa-4d37b6bb22d9">

5. Ejecuta las pruebas utilizando alguno de los siguientes dos comandos. El segundo permite visualizar las pruebas de forma interactiva con la UI de playwright:
```bash
npx playwright test
```
```bash
npx playwright test --ui
```

6. Si se está utilizando playwright en modo `--ui`, asegurarse de que en el panel de la parte superior izquierda, el campo de `Projects` esté configurado con el valor `all`, para que se muestren todos los tests, como se muestra en la siguiente imagen:

<img width="360" alt="image" src="https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/42351248/7c77f001-3a59-4d77-86af-ca5b4a317bb9">


## Generación de datos aleatorios
En el siguiente documento se encuentra el detalle de las estrategias de generación de datos y cómo se integraron a los escenarios de Kraken y Playwright
[Generación de datos aleatorios](https://github.com/jhalep-miso/issues-automatizacion-pruebas/wiki/Generaci%C3%B3n-de-datos-aleatorios)

Debido a que se reutilizan las estrategias en Kraken y Playwright a través del uso de una librería local, es necesario seguir las siguientes instrucciones para garantizar la correcta ejecución:

1. Dentro del directorio `data-generators` ejecutar los comandos `npm install` y `npm run build`
2. Moverse al directorio `ghost-e2e-kraken` y ejecutar el comando `npm install`. Para ejecutar las pruebas, seguir las instrucciones de [Instalación y Ejecución de las Pruebas en Kraken](#instalación-y-ejecución-de-las-pruebas-en-kraken)
2. Moverse al directorio `ghost-e2e-playwright` y ejecutar el comando `npm install`. Para ejecutar las pruebas, seguir las instrucciones de [Instalación y Ejecución de las Pruebas con Playwright](#instalación-y-ejecución-de-las-pruebas-con-playwright)

**Reporte de Issues** Para esta iteración, las [incidencias reportadas](https://github.com/jhalep-miso/issues-automatizacion-pruebas/issues) son desde el `[ISSUE-024]` hasta el `[ISSUE-033]`. Estas incidencias se obtuvieron durante el proceso de pruebas, utilizando valores en la frontera para diferentes campos de la aplicación

## Visual Regression Testing: Comparación de Imágenes y Generación de Reportes

## 1. ResembleJS

(**Relacionado:** [Pros y Contras de Resemble.js](https://github.com/jhalep-miso/issues-automatizacion-pruebas/wiki/Pros-y-Contras-de-las-Herramientas-Utilizadas#resemblejs))

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

Se compararán las imágenes entre las carpetas (escenarios) `ghost-e2e-kraken/ghost-5.80.0/03-create-post-change-url` y `ghost-e2e-kraken-vrt/ghost-3.42.0/03-create-post-change-url`, y se guardaran los resultados en `results/03-create-post-change-url` para este escenario particular. La comparación ocurre por cada paraja de imagen que tengan el mismo nombre de archivo. Para este ejemplo, se hace lo siguiente:

* Se compara `ghost-3.42.0/03-create-post-change-url/step1-navigateToLogin.png` con `ghost-3.42.0/03-create-post-change-url/step1-navigateToLogin.png`, y se guarda el resultado en `results/03-create-post-change-url/step1-navigateToLogin.png`
* Se compara `ghost-3.42.0/03-create-post-change-url/step10-setPublishedPostUrl.png` con `ghost-3.42.0/03-create-post-change-url/step10-setPublishedPostUrl.png`, y se guarda el resultado en `results/03-create-post-change-url/step10-setPublishedPostUrl.png`
* Se compara `ghost-3.42.0/03-create-post-change-url/step10-setPublishedPostUrl.png` con `ghost-3.42.0/03-create-post-change-url/step10-setPublishedPostUrl.png`, y se guarda el resultado en `results/03-create-post-change-url/step10-setPublishedPostUrl.png`
* Se guarda un reporte para el escenario `03-create-post-change-url` en `results/03-create-post-change-url/report.hmtl`
* para cada escenario se repite el proceso anterior, por cada paso del escenario
* Al terminar de realizar las comparaciones entre todos los escenarios, se guarda un reporte completo sobre todos los escenarios en `results/report.html`

### Pasos para Generación del Reporte VRT

1. Asegúrate de tener Node.js instalado en tu sistema, preferiblemente la versión 18.
2. Ejecutar las pruebas de Kraken el la carpeta `ghost-e2e-kraken-vrt` siguiendo los pasos de la sección [Instalación y Ejecución de las Pruebas en Kraken](#instalación-y-ejecución-de-las-pruebas-en-kraken). Al finalizar, se debió crear una carpeta `ghost-e2e-kraken-vrt/ghost-3.42.0` que contiene los screenshots de las pruebas
3. Ejecutar las pruebas de Kraken el la carpeta `ghost-e2e-kraken` siguiendo los pasos de la sección [Instalación y Ejecución de las Pruebas en Kraken](#instalación-y-ejecución-de-las-pruebas-en-kraken). Al finalizar, se debió crear una carpeta `ghost-e2e-kraken/ghost-5.80.0` que contiene los screenshots de las pruebas
4. Ir al directorio `cd resemble-vrt`
5. Instalar las dependencias del proyecto. Asegurarse de que tiene instaladas las [dependencias requeridas para node-canvas](https://github.com/Automattic/node-canvas?tab=readme-ov-file#compiling) en su computador, ya que `resemblejs` depende de `node-canvas`. Ejecutar `npm install` para instalar las dependencias del projecto
6. Ejecutar el script para realizar el VRT y generar el reporte (puede cambiar los argumentos dependiendo de dónde se tenga las carpetas con las imágenes):
```bash
npm run vrt ../ghost-e2e-kraken-vrt/ghost-3.42.0 ../ghost-e2e-kraken/ghost-5.80.0 ../vrt-comparison-results
```

7. Abrir el archivo `../vrt-comparison-results/report.html` en un navegador, preferiblemente Chrome; encontramos algunos problemas en firefox donde las imágenes no se cargan debido a falta de permisos. (Si se especificó otra carpeta de resultados diferente a `vrt-comparison-results`, buscar el `report.html` dentro de la carpeta especificada)
8. Al abrir el reporte, debería ver algo similar a lo siguiente:

<img width="1476" alt="image" src="https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/42351248/a07ae4c1-ad16-49da-bec9-578dba7af99a">

9. Al hacer click en alguno de los escenarios, debería ver un reporte parecido a:

<img width="1476" alt="image" src="https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/42351248/95c2ea98-99bd-4b81-8730-48cc0b66e572">

## 2. BackstopJS

(**Relacionado:** [Pros y Contras de BackstopJS](https://github.com/jhalep-miso/issues-automatizacion-pruebas/wiki/Pros-y-Contras-de-las-Herramientas-Utilizadas#backstopjs))

Este proyecto tiene la capacidad de realizar VRT entre dos versiones de Ghost, a partir de los screenshots que se toman en cada paso de cada escenario de prueba en Kraken. Dentro de la carpeta `backstop` se encuentra un script que se encarga de crear los archivos `backstop.json` para cada uno de los escenarios de pruebas, así como los reportes y los directorios con las imágenes de referencia y pruebas. Dentro del directorio `backstop_data` encontrará otro directorio llamado `html_report` que contendrá los reportes para cada uno de los escenarios de prueba. En este script se asume lo siguiente sobre las carpetas a comparar:

* Cada imágen corresponde a un step/paso de un escenario
* La carpeta padre de una imagen corresponde al nombre del escenario al que pertenece
* Los escenarios y pasos que se van a comparar tienen el mismo path relativo con respecto a cada directorio base.

### Pasos para generación de los reportes

Cabe aclarar que aunque se podía construir un único reporte con las comparaciones de todos los escenarios, se decidió generar un reporte separado para cada escenario con la intención de tener un orden definido para cada caso.

1. Asegúrese de tener Node.js instalado en su sistema, preferiblemente la versión 18.
2. Ejecutar previamente las pruebas de Kraken en la carpeta `ghost-e2e-kraken-vrt` siguiendo los pasos de la sección [Instalación y Ejecución de las Pruebas en Kraken](#instalación-y-ejecución-de-las-pruebas-en-kraken). Al finalizar, se debió crear una carpeta `ghost-e2e-kraken-vrt/ghost-3.42.0` que contiene los screenshots de las pruebas.
3. De igual manera, es necesario ejecutar previamente las pruebas de Kraken el la carpeta `ghost-e2e-kraken` siguiendo los pasos de la sección [Instalación y Ejecución de las Pruebas en Kraken](#instalación-y-ejecución-de-las-pruebas-en-kraken). Al finalizar, se debió crear una carpeta `ghost-e2e-kraken/ghost-5.80.0` que contiene los screenshots de las pruebas para esta versión de Ghost.
4. Desde el directorio raíz, vaya al directorio de backstop.
```bash
cd backstop
```
5. Ejecutar el script para realizar el VRT y generar el reporte (Esto puede tardar un tiempo. Puede cambiar en el script.js las rutas de directorio1 y directorio2 dependiendo de dónde se tenga las carpetas con las imágenes):
```bash
node script.js
```
6. Se abrirá una pestaña en el navegador para visualizar el reporte de cada escenario. También puede abrir el reporte directamente desde el directorio ubicado en la ruta `backstop/backstop_data/hmtl_report` y allí buscará dentro de la carpeta del escenario que desee el archivo `index.html` el cuál podra abrir en un navegador (recomendamos usar Chrome).
7. Al terminar la ejecución del script, en la consola posiblemente verá unos mensajes de error como los mostrados a continuación. Estos errores indican que los escenarios de los test fallaron debido al alto porcentaje de diferencias que se encuentra en la comparación de las imágenes, pero no tiene que ver con errores del script como tal.
   
![image](https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/158172093/e2d078d9-87f5-4f2f-9a74-2408addb685a)

9. Al terminar la ejecución del script o al abrir el reporte, debería ver en su navegador algo similar a lo siguiente:
    
![image](https://github.com/jhalep-miso/issues-automatizacion-pruebas/assets/158172093/f16b7802-367e-4f33-ac47-cb1c855214c6)


## Contribución

Si deseas contribuir a este repositorio, no dudes en hacerlo. Puedes abrir un issue para reportar problemas o enviar solicitudes de extracción con mejoras o correcciones.

¡Gracias por tu interés en contribuir!

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

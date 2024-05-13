const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const directorio1 = '../ghost-e2e-kraken-vrt/ghost-3.42.0';
const directorio2 = '../ghost-e2e-kraken/ghost-5.80.0';

function generarConfiguracionBackstop(subdirectorio) {

    const match = subdirectorio.match(/^(\d+)/); 
    const id = match ? match[1] : subdirectorio; 

    const backstopConfig = {
        "id": id,
        "viewports": [
            {
                "name": "desktop",
                "width": 1200,
                "height": 761
            }
        ],
        "scenarios": [],
        "paths": {
            "bitmaps_reference": `backstop_data/bitmaps_reference/${subdirectorio}`,
            "bitmaps_test": `backstop_data/bitmaps_test/${subdirectorio}`,
            "engine_scripts": "backstop_data/engine_scripts",
            "html_report": `backstop_data/html_report/${subdirectorio}`,
            "ci_report": `backstop_data/ci_report/${subdirectorio}`
        },
        "report": ["browser"],
        "engine": "puppeteer",
        "engineOptions": {
            "args": ["--no-sandbox"]
        },
        "asyncCaptureLimit": 5,
        "asyncCompareLimit": 50,
        "debug": false,
        "debugWindow": false
    };

    const imagenes = fs.readdirSync(path.join(directorio1, subdirectorio));

    const sortedImagenes = imagenes.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB; 
    });

    sortedImagenes.forEach(imagen => {

        const match = imagen.match(/(step\d+)/);
        const label = match ? match[1] : imagen; 

        const referencia = `file://${path.join(__dirname, directorio1, subdirectorio, imagen)}`;
        const prueba = `file://${path.join(__dirname, directorio2, subdirectorio, imagen)}`;

        backstopConfig.scenarios.push({
            "label": label,
            "referenceUrl": referencia,
            "url": prueba,
            "hideSelectors": [],
            "removeSelectors": [],
            "selectors": [],
            "readyEvent": null,
            "delay": 500,
            "misMatchThreshold": 0.1,
            "requireSameDimensions": true
        });
    });

    const backstopJsonPath = `backstop_${subdirectorio}.json`;
    fs.writeFileSync(backstopJsonPath, JSON.stringify(backstopConfig, null, 2));

    console.log(`backstop_${subdirectorio}.json generado correctamente para el subdirectorio ${subdirectorio}.`);
}

function ejecutarBackstop(subdirectorio) {
    // Ejecutar backstop reference
    exec(`backstop reference --configPath=backstop_${subdirectorio}.json`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar backstop reference para ${subdirectorio}: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Backstop reference stderr para ${subdirectorio}: ${stderr}`);
            return;
        }
        console.log(`Backstop reference completado para ${subdirectorio}.`);
        
        // Ejecutar backstop test
        exec(`backstop test --configPath=backstop_${subdirectorio}.json`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar backstop test para ${subdirectorio}: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Backstop test stderr para ${subdirectorio}: ${stderr}`);
                return;
            }
            console.log(`Backstop test completado para ${subdirectorio}.`);
        });
    });
}

function generarYCompararSubdirectorios() {
    const subdirectorios = fs.readdirSync(directorio1).filter(file => fs.statSync(path.join(directorio1, file)).isDirectory());

    subdirectorios.forEach(subdirectorio => {
        generarConfiguracionBackstop(subdirectorio);
        ejecutarBackstop(subdirectorio);
    });
}

generarYCompararSubdirectorios();

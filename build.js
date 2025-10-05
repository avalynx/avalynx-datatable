const fs = require('fs');

if (process.argv.length < 3) {
    console.error('Please provide the file path as an argument.');
    process.exit(1);
}

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
    console.error(`The file ${filePath} does not exist.`);
    process.exit(1);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file ${filePath}: ${err}`);
        return;
    }

    let result = data.replace(/class AvalynxDataTable /g, 'import * as bootstrap from \'bootstrap\';\n\nexport class AvalynxDataTable ');

    result = result.replace(/\n\nif \(typeof module !== 'undefined' && module\.exports\) \{\n    module\.exports = AvalynxDataTable;\n\}\n?$/, '');

    fs.writeFile(filePath, result, 'utf8', err => {
        if (err) {
            console.error(`Error writing file ${filePath}: ${err}`);
        }
    });
});

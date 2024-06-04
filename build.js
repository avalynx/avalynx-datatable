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

    const result = data.replace(/class /g, 'export class ');

    fs.writeFile(filePath, result, 'utf8', err => {
        if (err) {
            console.error(`Error writing file ${filePath}: ${err}`);
        }
    });
});

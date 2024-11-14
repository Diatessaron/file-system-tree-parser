import fs from "fs";

function init() {
    const args = process.argv.slice(2);
    let dirPath = '.';
    let givenDepth = 1;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--path':
            case '-p':
                if (args[i + 1]) {
                    dirPath = args[i + 1];
                    i++;
                } else {
                    console.error('Error: --path or -p option requires a value.');
                    process.exit(1);
                }
                break;
            case '--depth':
            case '-d':
                if (args[i + 1] && !isNaN(Number(args[i + 1]))) {
                    givenDepth = parseInt(args[i + 1], 10);
                    i++;
                } else {
                    console.error('Error: --depth or -d option requires a numeric value.');
                    process.exit(1);
                }
                break;
            default:
                console.warn(`Warning: Unknown argument "${args[i]}" ignored.`);
                break;
        }
    }

    return { dirPath, givenDepth };
}

const { dirPath, givenDepth } = init();

function traverseFileStructure(dirPath: string, depth: number = 0) {
    if (givenDepth < depth) return;
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(`Could not read directory ${dirPath}:`, err);
            return;
        }

        files.forEach((element) => {
            const fullPath = dirPath + element;
            const tabulations = '\t'.repeat(depth);
            fs.stat(fullPath, (err, stats) => {
                if (stats.isDirectory()) {
                    console.log(tabulations + element)
                    traverseFileStructure(fullPath)
                }
            console.log(element);
            });
        });
    });
}

traverseFileStructure(dirPath, givenDepth)

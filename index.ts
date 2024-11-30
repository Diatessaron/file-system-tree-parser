import fs from "fs";
import path from "path";

function init() {
    const args = process.argv.slice(2);
    let dirPath: string;
    let givenDepth: number;

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

function traverseFileStructure(currentPath: string, depth: number = 0, prefix: string) {
    if (depth > givenDepth) return;

    let items = fs.readdirSync(currentPath);

    items.forEach((item) => {
        const fullPath = path.join(currentPath, item);
        const stats = fs.statSync(fullPath);

        console.log(`${prefix}└── ${item}${stats.isDirectory() ? '/' : ''}`)

        if (stats.isDirectory()) {
            traverseFileStructure(fullPath, depth + 1, prefix + '    ');
        }
    })
}

console.log(path.basename(dirPath) + '/');
traverseFileStructure(dirPath, 1, '')

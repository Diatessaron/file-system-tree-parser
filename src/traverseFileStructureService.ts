import fs from 'fs';
import path from "path";

export class TraverseFileStructureService {
    givenDepth: number

    constructor(givenDepth: number) {
        this.givenDepth = givenDepth;
    }

    traverseFileStructure(currentPath: string, depth: number = 0, prefix: string) {
        if (depth > this.givenDepth) return;

        let items = fs.readdirSync(currentPath);

        items.forEach((item) => {
            const fullPath = path.join(currentPath, item);
            const stats = fs.statSync(fullPath);

            console.log(`${prefix}└── ${item}${stats.isDirectory() ? '/' : ''}`)

            if (stats.isDirectory()) {
                this.traverseFileStructure(fullPath, depth + 1, prefix + '    ');
            }
        })
    }
}

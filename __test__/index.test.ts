import mockFs from 'mock-fs';
import {TraverseFileStructureService} from "../src/traverseFileStructureService";

describe('File Tree Traversal Script', () => {
    let consoleSpy

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    })

    afterEach(() => {
        mockFs.restore();
        jest.clearAllMocks();
    });

    test('Should traverse and log file tree structure with depth 1 correctly', () => {
        mockFs({
            'test-dir': {
                'file1.txt': 'File 1 content',
                'file2.txt': 'File 2 content',
                'sub-dir': {
                    'file3.txt': 'File 3 content',
                },
            },
        });

        const dirPath = 'test-dir';
        const depth = 1;
        const traverseFileStructureService = new TraverseFileStructureService(depth);
        traverseFileStructureService.traverseFileStructure(dirPath, 1, '');

        expect(consoleSpy).toHaveBeenCalledWith('└── file1.txt');
        expect(consoleSpy).toHaveBeenCalledWith('└── file2.txt');
        expect(consoleSpy).toHaveBeenCalledWith('└── sub-dir/');
    });

    test('Should traverse and log file tree structure with depth 2 correctly', () => {
        mockFs({
            'test-dir': {
                'file1.txt': 'File 1 content',
                'file2.txt': 'File 2 content',
                'sub-dir': {
                    'file3.txt': 'File 3 content',
                },
            },
        });

        const dirPath = 'test-dir';
        const depth = 2;
        const traverseFileStructureService = new TraverseFileStructureService(depth);
        traverseFileStructureService.traverseFileStructure(dirPath, 1, '');

        expect(consoleSpy).toHaveBeenCalledWith('└── file1.txt');
        expect(consoleSpy).toHaveBeenCalledWith('└── file2.txt');
        expect(consoleSpy).toHaveBeenCalledWith('└── sub-dir/');
        expect(consoleSpy).toHaveBeenCalledWith('    └── file3.txt');
    });

    test('Should handle empty directories correctly', () => {
        mockFs({
            'empty-dir': {},
        });

        const dirPath = 'empty-dir';
        const depth = 1;
        const traverseFileStructureService = new TraverseFileStructureService(depth);
        traverseFileStructureService.traverseFileStructure(dirPath, 1, '');

        expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('Should traverse and log file tree structure with unprovided depth correctly', () => {
        mockFs({
            'test-dir': {
                'file1.txt': 'File 1 content',
                'file2.txt': 'File 2 content',
                'sub-dir': {
                    'file3.txt': 'File 3 content',
                    'sub-sub-dir1': {
                        'file4.txt': 'File 4 content'
                    },
                    'sub-sub-dir2': {}
                },
            },
        });

        const dirPath = 'test-dir';
        const traverseFileStructureService = new TraverseFileStructureService(undefined);
        traverseFileStructureService.traverseFileStructure(dirPath, 1, '');

        expect(consoleSpy).toHaveBeenCalledWith('└── file1.txt');
        expect(consoleSpy).toHaveBeenCalledWith('└── file2.txt');
        expect(consoleSpy).toHaveBeenCalledWith('└── sub-dir/');
        expect(consoleSpy).toHaveBeenCalledWith('    └── file3.txt');
        expect(consoleSpy).toHaveBeenCalledWith('    └── sub-sub-dir1/');
        expect(consoleSpy).toHaveBeenCalledWith('        └── file4.txt');
        expect(consoleSpy).toHaveBeenCalledWith('    └── sub-sub-dir2/');
    });

    test('Should throw an error when dirPath is not provided', () => {
        const service = new TraverseFileStructureService(1);

        expect(() => {
            service.traverseFileStructure('', 1, '');
        }).toThrow('ENOENT: no such file or directory');
    });
});

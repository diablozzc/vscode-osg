import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

describe('Extension Basic Tests', () => {
  it('Basic math should work', () => {
    assert.strictEqual(1 + 1, 2);
  });

  it('Package.json should exist and have correct publisher', () => {
    const packagePath = path.join(__dirname, '../../../package.json');
    assert.ok(fs.existsSync(packagePath));

    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    assert.strictEqual(packageContent.publisher, 'diablozzc');
    assert.strictEqual(packageContent.name, 'vscode-osg');
  });

  it('Extension source file should exist', () => {
    const extensionPath = path.join(__dirname, '../../src/extension.js');
    assert.ok(fs.existsSync(extensionPath));
  });

  it('String operations should work', () => {
    const testString = 'OSG Language Support';
    assert.ok(testString.includes('OSG'));
    assert.strictEqual(testString.length, 20);
  });

  it('Array operations should work', () => {
    const testArray = ['osg', 'openscenegraph', '3d', 'graphics'];
    assert.strictEqual(testArray.length, 4);
    assert.ok(testArray.includes('osg'));
  });
});

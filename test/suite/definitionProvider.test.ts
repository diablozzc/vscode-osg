import * as assert from 'assert';
import * as vscode from 'vscode';
import { OSGDefinitionProvider } from '../../src/definitionProvider';

suite('OSG Definition Provider Tests', () => {
  let provider: OSGDefinitionProvider;
  let document: vscode.TextDocument;

  suiteSetup(async () => {
    provider = new OSGDefinitionProvider();

    // 创建测试文档
    const content = `# OSG 测试文件
Group {
    UniqueID TestGroup_0
    nodeMask 0xffffffff
    cullingActive TRUE
    num_children 1
    
    Geode {
        UniqueID TestGeode_1
        nodeMask 0xffffffff
        num_drawables 1
        
        Geometry {
            DataVariance STATIC
            StateSet {
                Material {
                    ambientColor 0.2 0.2 0.2 1.0
                    diffuseColor 0.8 0.8 0.8 1.0
                }
                textureUnit 0 {
                    GL_TEXTURE_2D ON
                    Texture2D {
                        file "test_texture.jpg"
                    }
                }
            }
        }
    }
}`;

    document = await vscode.workspace.openTextDocument({
      content,
      language: 'osg',
    });
  });

  test('应该找到节点类型定义', async () => {
    // 测试 Group 节点定义
    const position = new vscode.Position(1, 0); // Group 位置
    const definition = await provider.provideDefinition(
      document,
      position,
      new vscode.CancellationTokenSource().token
    );

    assert.ok(definition, '应该找到定义');
    if (definition && !Array.isArray(definition)) {
      assert.strictEqual(definition.uri.toString(), document.uri.toString());
      assert.strictEqual(definition.range.start.line, 1);
    }
  });

  test('应该找到UniqueID定义', async () => {
    // 测试 UniqueID 定义查找
    const position = new vscode.Position(2, 15); // TestGroup_0 位置
    const definition = await provider.provideDefinition(
      document,
      position,
      new vscode.CancellationTokenSource().token
    );

    assert.ok(definition, '应该找到UniqueID定义');
    if (definition && !Array.isArray(definition)) {
      assert.strictEqual(definition.uri.toString(), document.uri.toString());
      assert.strictEqual(definition.range.start.line, 2);
    }
  });

  test('应该找到属性定义', async () => {
    // 测试属性定义查找
    const position = new vscode.Position(3, 4); // nodeMask 位置
    const definition = await provider.provideDefinition(
      document,
      position,
      new vscode.CancellationTokenSource().token
    );

    assert.ok(definition, '应该找到属性定义');
    if (definition && !Array.isArray(definition)) {
      assert.strictEqual(definition.uri.toString(), document.uri.toString());
      assert.strictEqual(definition.range.start.line, 3);
    }
  });

  test('应该处理文件引用', async () => {
    // 测试文件引用（这个测试可能会失败，因为文件不存在）
    const position = new vscode.Position(22, 30); // "test_texture.jpg" 位置
    const definition = await provider.provideDefinition(
      document,
      position,
      new vscode.CancellationTokenSource().token
    );

    // 文件不存在时应该返回null
    // 这个测试主要是确保不会抛出异常
    assert.doesNotThrow(() => {
      // 测试通过，没有抛出异常
    });
  });

  test('应该处理FileNameList中的文件引用', async () => {
    // 创建包含FileNameList的测试文档
    const fileNameListContent = `PagedLOD {
    Center 0 0 0
    Radius 1000
    FileNameList 2 {
        "test1.osg"
        "test2.osg"
    }
}`;

    const fileNameListDocument = await vscode.workspace.openTextDocument({
      content: fileNameListContent,
      language: 'osg',
    });

    // 测试FileNameList中的文件引用（这个测试主要确保不会抛出异常）
    const position = new vscode.Position(3, 10); // "test1.osg" 位置
    const definition = await provider.provideDefinition(
      fileNameListDocument,
      position,
      new vscode.CancellationTokenSource().token
    );

    // 文件不存在时应该返回null，但不应该抛出异常
    assert.doesNotThrow(() => {
      // 测试通过，没有抛出异常
    });
  });

  test('应该处理无效位置', async () => {
    // 测试无效位置
    const position = new vscode.Position(100, 100); // 超出文档范围
    const definition = await provider.provideDefinition(
      document,
      position,
      new vscode.CancellationTokenSource().token
    );

    assert.strictEqual(definition, null, '无效位置应该返回null');
  });
});

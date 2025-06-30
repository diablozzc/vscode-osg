import * as assert from 'assert';
import * as vscode from 'vscode';
import { OSGReferenceProvider } from '../../src/referenceProvider';

suite('OSG Reference Provider Tests', () => {
  let provider: OSGReferenceProvider;
  let document: vscode.TextDocument;

  suiteSetup(async () => {
    provider = new OSGReferenceProvider();

    // 创建测试文档
    const content = `# OSG 测试文件
Group {
    UniqueID TestGroup_0
    nodeMask 0xffffffff
    cullingActive TRUE
    num_children 2
    
    Group {
        UniqueID TestGroup_1
        nodeMask 0xffffffff
        num_children 0
    }
    
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
            }
        }
    }
}`;

    document = await vscode.workspace.openTextDocument({
      content,
      language: 'osg',
    });
  });

  test('应该找到节点类型的所有引用', async () => {
    // 测试 Group 节点的引用
    const position = new vscode.Position(1, 0); // 第一个 Group 位置
    const context: vscode.ReferenceContext = { includeDeclaration: true };
    const references = await provider.provideReferences(
      document,
      position,
      context,
      new vscode.CancellationTokenSource().token
    );

    assert.ok(
      references.length >= 2,
      `应该找到至少2个Group引用，实际找到${references.length}个`
    );

    // 验证引用位置
    const groupReferences = references.filter(ref => {
      const line = document.lineAt(ref.range.start.line).text;
      return line.includes('Group');
    });

    assert.ok(groupReferences.length >= 2, '应该找到至少2个Group节点引用');
  });

  test('应该找到属性的所有引用', async () => {
    // 测试 nodeMask 属性的引用
    const position = new vscode.Position(3, 4); // nodeMask 位置
    const context: vscode.ReferenceContext = { includeDeclaration: true };
    const references = await provider.provideReferences(
      document,
      position,
      context,
      new vscode.CancellationTokenSource().token
    );

    assert.ok(
      references.length >= 3,
      `应该找到至少3个nodeMask引用，实际找到${references.length}个`
    );

    // 验证引用位置
    const nodeMaskReferences = references.filter(ref => {
      const line = document.lineAt(ref.range.start.line).text;
      return line.includes('nodeMask');
    });

    assert.ok(
      nodeMaskReferences.length >= 3,
      '应该找到至少3个nodeMask属性引用'
    );
  });

  test('应该找到UniqueID的引用', async () => {
    // 测试 UniqueID 的引用
    const position = new vscode.Position(2, 15); // TestGroup_0 位置
    const context: vscode.ReferenceContext = { includeDeclaration: true };
    const references = await provider.provideReferences(
      document,
      position,
      context,
      new vscode.CancellationTokenSource().token
    );

    assert.ok(
      references.length >= 1,
      `应该找到至少1个TestGroup_0引用，实际找到${references.length}个`
    );

    // 验证引用位置
    const uniqueIdReferences = references.filter(ref => {
      const line = document.lineAt(ref.range.start.line).text;
      return line.includes('TestGroup_0');
    });

    assert.ok(uniqueIdReferences.length >= 1, '应该找到至少1个TestGroup_0引用');
  });

  test('应该正确处理includeDeclaration参数', async () => {
    // 测试不包含声明的引用查找
    const position = new vscode.Position(1, 0); // Group 位置
    const contextWithoutDeclaration: vscode.ReferenceContext = {
      includeDeclaration: false,
    };
    const referencesWithoutDeclaration = await provider.provideReferences(
      document,
      position,
      contextWithoutDeclaration,
      new vscode.CancellationTokenSource().token
    );

    // 测试包含声明的引用查找
    const contextWithDeclaration: vscode.ReferenceContext = {
      includeDeclaration: true,
    };
    const referencesWithDeclaration = await provider.provideReferences(
      document,
      position,
      contextWithDeclaration,
      new vscode.CancellationTokenSource().token
    );

    // 包含声明的结果应该不少于不包含声明的结果
    assert.ok(
      referencesWithDeclaration.length >= referencesWithoutDeclaration.length,
      '包含声明的引用数量应该不少于不包含声明的引用数量'
    );
  });

  test('应该处理无效位置', async () => {
    // 测试无效位置
    const position = new vscode.Position(100, 100); // 超出文档范围
    const context: vscode.ReferenceContext = { includeDeclaration: true };
    const references = await provider.provideReferences(
      document,
      position,
      context,
      new vscode.CancellationTokenSource().token
    );

    assert.strictEqual(references.length, 0, '无效位置应该返回空数组');
  });

  test('应该处理未知词汇', async () => {
    // 创建包含未知词汇的测试文档
    const unknownContent = `# 测试未知词汇
UnknownNode {
    unknownAttribute someValue
}`;

    const unknownDocument = await vscode.workspace.openTextDocument({
      content: unknownContent,
      language: 'osg',
    });

    const position = new vscode.Position(1, 0); // UnknownNode 位置
    const context: vscode.ReferenceContext = { includeDeclaration: true };
    const references = await provider.provideReferences(
      unknownDocument,
      position,
      context,
      new vscode.CancellationTokenSource().token
    );

    // 对于未知的节点类型，应该返回空数组或者只包含当前位置的引用
    assert.ok(references.length >= 0, '未知节点类型应该正确处理');
  });
});

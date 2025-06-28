# 测试文件

本目录包含 VSCode OSG 扩展的测试文件和测试数据。

## 目录结构

- `suite/` - 测试套件代码
- `fixtures/` - 测试数据文件
- `README.md` - 本文档

## 测试数据

### fixtures/test.osg
基础的 OSG 测试文件，用于验证语法高亮功能。

### fixtures/output.osg
大型的 OSG 文件，包含复杂的场景图结构，用于性能测试。

## 运行测试

### 前置要求
- Node.js 16.x 或更高版本
- VS Code 1.74.0 或更高版本

### 安装依赖
```bash
npm install
```

### 编译项目
```bash
npm run compile
```

### 运行测试
```bash
npm test
```

### 调试测试
在 VS Code 中：
1. 打开项目
2. 选择 "Run and Debug" 面板
3. 选择 "Run Extension Tests" 配置
4. 按 F5 开始调试

## 测试覆盖

目前的测试覆盖以下功能：

- [x] 扩展基本激活
- [x] 语法高亮基本功能
- [ ] 代码片段功能（计划中）
- [ ] 语言配置功能（计划中）
- [ ] 性能测试（计划中）

## 添加新测试

### 测试文件结构
```
test/
├── suite/
│   ├── index.ts          # 测试入口
│   ├── extension.test.ts # 扩展测试
│   └── syntax.test.ts    # 语法测试
└── fixtures/
    ├── *.osg            # 测试用的 OSG 文件
    └── expected/        # 预期结果文件
```

### 编写测试用例

测试使用 Mocha 框架：

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('osg-team.vscode-osg');
    assert.ok(extension);
    
    await extension.activate();
    assert.ok(extension.isActive);
  });
});
```

### 语法高亮测试

创建测试文件验证语法高亮：

```typescript
suite('Syntax Highlighting', () => {
  test('Should highlight OSG nodes', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: 'Group {\n  name "TestGroup"\n}',
      language: 'osg'
    });
    
    // 验证语法高亮
    const tokens = await vscode.languages.getTokensAtPosition(doc, new vscode.Position(0, 0));
    assert.ok(tokens.length > 0);
  });
});
```

## 测试数据管理

### 创建测试数据
1. 在 `fixtures/` 目录创建 `.osg` 文件
2. 确保文件包含各种语法元素
3. 添加注释说明测试用途

### 测试数据要求
- 文件应该是有效的 OSG 格式
- 包含多种节点类型和属性
- 涵盖边界情况和特殊语法
- 文件大小适中（避免过大影响测试速度）

## 持续集成

测试通过 GitHub Actions 自动运行：

```yaml
- name: Run tests
  run: npm test
```

本地测试应该在提交前运行，确保不会破坏现有功能。

## 性能测试

对于大型 OSG 文件的性能测试：

1. 使用 `fixtures/output.osg` 等大文件
2. 测量语法高亮响应时间
3. 监控内存使用情况
4. 验证在大文件中的扩展性能

## 故障排除

### 常见问题

**测试无法运行**
- 检查 Node.js 版本
- 确保依赖已正确安装
- 验证 VS Code 版本兼容性

**语法高亮测试失败**
- 检查语法定义文件
- 验证测试用例的语法正确性
- 确保作用域名称正确

**扩展激活失败**
- 检查 package.json 配置
- 验证激活事件设置
- 查看扩展日志输出

## 贡献测试

欢迎为项目添加更多测试：

1. 识别未覆盖的功能
2. 编写相应的测试用例
3. 添加必要的测试数据
4. 更新文档
5. 提交 Pull Request

更多信息请参考 [贡献指南](../CONTRIBUTING.md)。 
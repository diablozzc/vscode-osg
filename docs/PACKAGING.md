# VSCode OSG 扩展打包指南

## 快速打包

由于 vsce 工具存在依赖问题，我们提供了手动打包解决方案。

### 自动打包（推荐）

```bash
npm run package
```

这将自动编译代码并创建 vscode-osg-0.1.0.vsix 文件。

### 分步骤打包

```bash
# 编译代码
npm run compile

# 手动打包
node package-manual.js
```

## 安装扩展

### 本地安装

```bash
code --install-extension vscode-osg-0.1.0.vsix
```

### VSCode 界面安装

1. 打开 VSCode
2. Ctrl+Shift+P 打开命令面板
3. 输入 "Extensions: Install from VSIX..."
4. 选择 vscode-osg-0.1.0.vsix 文件

## 故障排除

### 已修复的问题

✅ **问题**: "Extract: 在 Zip 中找不到 extension/package.json"
- **原因**: VSIX 文件结构不正确
- **解决**: 已修复，所有文件现在正确放置在 `extension/` 目录下

### 其他可能问题

如果遇到 css-what 模块错误，这是已知问题，请使用手动打包方案。

确保运行编译后再打包：
```bash
npm run compile
```

### 验证安装

安装成功后，你应该看到：
```
Installing extensions...
Extension 'vscode-osg-0.1.0.vsix' was successfully installed.
``` 
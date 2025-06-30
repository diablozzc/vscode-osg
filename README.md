# VSCode OSG 语言支持扩展

[![CI](https://github.com/diablozzc/vscode-osg/workflows/CI/badge.svg)](https://github.com/diablozzc/vscode-osg/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/diablozzc.vscode-osg)](https://marketplace.visualstudio.com/items?itemName=diablozzc.vscode-osg)

为 Visual Studio Code 提供 OSG (OpenSceneGraph) 文件格式的完整语言支持。

## ✨ 功能特性

### ✅ 已实现

- **🎨 语法高亮**: 完整的 `.osg` 文件语法高亮支持
  - 节点类型高亮 (Group, Geode, Geometry, StateSet, Material 等)
  - 属性关键字高亮 (name, DataVariance, nodeMask 等)
  - 数据类型高亮 (Vec3, Vec4, Matrix, Quat 等)
  - 常量高亮 (TRUE, FALSE, STATIC, DYNAMIC 等)
  - 数字、字符串和注释高亮

- **🚀 智能自动完成**: 上下文感知的代码自动完成
  - 节点类型自动完成 (Group, Geode, MatrixTransform 等)
  - 属性名称自动完成，根据当前节点类型智能过滤
  - 属性值自动完成，提供枚举值选择
  - 常量和数据类型自动完成
  - 智能代码片段，包含默认值和占位符

- **📖 悬停提示文档**: 丰富的中文文档提示
  - 节点类型详细说明，包含支持的属性和子节点
  - 属性详细文档，包含类型、描述和使用示例
  - 数据类型格式说明和示例
  - 常量值说明和适用场景
  - 特殊关键字解释

- **⚡ 代码片段**: 提供常用 OSG 结构的代码片段
  - `group` - 创建 Group 节点
  - `geode` - 创建 Geode 节点
  - `geometry` - 创建 Geometry 对象
  - `stateset` - 创建 StateSet 对象
  - `material` - 创建 Material 对象
  - `texture2d` - 创建 Texture2D 对象
  - `vec3array` - 创建 Vec3Array 数组
  - `drawelements` - 创建 DrawElementsUInt 图元集合
  - `matrixtransform` - 创建 MatrixTransform 节点

- **⚙️ 语言配置**: 
  - 支持 `#` 单行注释
  - 大括号、方括号、圆括号自动匹配和关闭
  - 自动缩进支持

- **🔍 定义跳转**: 智能定义跳转功能
  - 节点类型定义跳转（Group、Geode、MatrixTransform 等）
  - 属性定义跳转（nodeMask、DataVariance 等）
  - UniqueID 引用跳转，快速定位到定义位置
  - 文件引用跳转，支持纹理和模型文件路径跳转
  - 支持 F12 快捷键和右键菜单"转到定义"

- **📍 引用查找**: 全面的引用查找功能
  - 节点类型引用查找，显示所有使用位置
  - 属性引用查找，追踪属性在项目中的使用
  - UniqueID 引用查找，查看标识符的所有引用
  - 文件引用查找，查找资源文件的引用位置
  - 支持 Shift+F12 快捷键和右键菜单"查找所有引用"
  - 跨文件引用查找，支持整个工作区搜索

### 🚧 开发中

- 语法错误检查和诊断
- 代码格式化功能
- 大纲视图支持

## 🚀 快速开始

### 安装

**从 VS Code 市场安装：**
1. 打开 VS Code
2. 进入扩展面板 (`Ctrl+Shift+X`)
3. 搜索 "OSG Language Support"
4. 点击安装

**从源码安装：**
```bash
git clone https://github.com/diablozzc/vscode-osg.git
cd vscode-osg
npm install
npm run package
code --install-extension dist/vscode-osg-1.0.0.vsix
```

### 使用

1. 打开任何 `.osg` 文件
2. 扩展自动激活并提供语法高亮
3. 享受智能自动完成功能：
   - 输入节点名称获得自动完成建议
   - 在节点内部输入属性名称获得相关建议
   - 输入属性值时获得枚举选项
4. 悬停在任何关键字上查看详细文档
5. 输入代码片段前缀（如 `group`）并按 `Tab` 键快速插入模板
6. 使用 `#` 添加注释

## 📁 项目结构

```
vscode-osg/
├── .github/              # GitHub 配置和模板
├── docs/                 # 项目文档
├── src/                  # 源代码
├── resources/            # 扩展资源文件
│   ├── syntaxes/         # 语法定义
│   └── snippets/         # 代码片段
├── examples/             # 示例 OSG 文件
├── test/                 # 测试文件
├── scripts/              # 构建脚本
└── dist/                 # 构建输出
```

## 🛠️ 开发

### 前置要求

- Node.js 16.x 或更高版本
- VS Code 1.74.0 或更高版本
- Git

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/diablozzc/vscode-osg.git
cd vscode-osg

# 安装依赖
npm install

# 编译项目
npm run compile

# 运行测试
npm test

# 启动开发模式
# 在 VS Code 中按 F5 或使用 "Run Extension" 调试配置
```

### 构建和打包

```bash
# 清理构建
npm run clean

# 编译并打包
npm run package

# 仅使用 vsce 打包（需要先安装 vsce）
npm run package-vsce
```

## 📖 文档

- [开发指南](docs/DEVELOPMENT.md)
- [API 文档](docs/API.md)
- [更新日志](docs/CHANGELOG.md)
- [示例文件说明](examples/README.md)

## 🤝 贡献

我们欢迎各种形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 快速贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 🐛 问题反馈

遇到问题？请通过以下方式反馈：

- [GitHub Issues](https://github.com/diablozzc/vscode-osg/issues) - Bug 报告和功能请求
- [GitHub Discussions](https://github.com/diablozzc/vscode-osg/discussions) - 一般讨论和问答

提交 Bug 报告时请包含：
- 操作系统信息
- VS Code 版本
- 扩展版本
- 重现步骤
- 相关的 OSG 文件示例

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🔗 相关链接

- [OpenSceneGraph 官网](http://www.openscenegraph.org/)
- [OSG 文件格式规范](http://www.openscenegraph.org/documentation/osg_file_format.html)
- [VS Code 扩展开发文档](https://code.visualstudio.com/api)

## ⭐ 支持项目

如果这个项目对您有帮助，请考虑给它一个星标 ⭐ ！

---

**开发者**: 张志超 ([@diablozzc](https://github.com/diablozzc))  
**维护状态**: 积极维护  
**版本**: 1.1.0 
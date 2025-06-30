# 更新日志

本文档记录了 VSCode OSG 扩展的所有重要变更。

## [1.2.1] - 2024-12-19

### 🐛 问题修复

**修复内容：**
- 🔧 **修复 FileNameList 文件引用跳转** - 解决 PagedLOD 节点中 FileNameList 内的 OSG 文件无法跳转的问题
  - 新增 `findFileInFileNameList` 方法，专门处理 FileNameList 块内的文件引用
  - 改进上下文识别算法，准确判断当前位置是否在 FileNameList 块内
  - 扩展文件查找路径，包含 `data/` 目录和更多可能的路径
  - 优化引用查找功能，更好地支持 FileNameList 中的文件引用

**技术改进：**
- 🏗️ 重构 `findFileReference` 方法，提取公共的文件查找逻辑
- 📁 新增 `findFileInPaths` 辅助方法，统一文件路径查找逻辑
- 🎯 改进大括号层级计算，更准确地识别 FileNameList 作用域
- 🧪 新增 FileNameList 功能的单元测试

**测试文件：**
- 📝 新增 `examples/basic/filenamelist-test.osg` 测试文件
- 🔍 包含详细的测试说明和使用示例

## [1.2.0] - 2024-12-19

### 🚀 重大功能更新

**新功能：**
- 🔍 **定义跳转功能** - 智能定义跳转支持
  - 节点类型定义跳转（Group、Geode、MatrixTransform 等）
  - 属性定义跳转（nodeMask、DataVariance 等）
  - UniqueID 引用跳转，快速定位到定义位置
  - 文件引用跳转，支持纹理和模型文件路径跳转
  - 支持 F12 快捷键和右键菜单"转到定义"

- 📍 **引用查找功能** - 全面的引用查找支持
  - 节点类型引用查找，显示所有使用位置
  - 属性引用查找，追踪属性在项目中的使用
  - UniqueID 引用查找，查看标识符的所有引用
  - 文件引用查找，查找资源文件的引用位置
  - 支持 Shift+F12 快捷键和右键菜单"查找所有引用"
  - 跨文件引用查找，支持整个工作区搜索

**技术改进：**
- 🏗️ 新增 `OSGDefinitionProvider` 定义跳转提供者
- 🔗 新增 `OSGReferenceProvider` 引用查找提供者
- 📁 支持文件系统级别的文件引用查找
- 🎯 实现智能的上下文识别算法
- 🧪 新增单元测试覆盖新功能

**开发体验提升：**
- 💡 快速导航到定义位置，提升代码阅读效率
- 🔍 轻松查找所有引用，便于代码重构和维护
- ⚡ 支持跨文件查找，适用于大型 OSG 项目
- 🎨 与 VS Code 原生功能完美集成

## [1.1.0] - 2024-12-19

### 🚀 重大功能更新

**新功能：**
- ✨ **智能自动完成功能** - 上下文感知的代码自动完成
  - 节点类型自动完成 (Group, Geode, MatrixTransform 等)
  - 属性名称自动完成，根据当前节点类型智能过滤
  - 属性值自动完成，提供枚举值选择
  - 常量和数据类型自动完成
  - 智能代码片段，包含默认值和占位符

- 📖 **悬停提示文档** - 丰富的中文文档提示
  - 节点类型详细说明，包含支持的属性和子节点
  - 属性详细文档，包含类型、描述和使用示例
  - 数据类型格式说明和示例
  - 常量值说明和适用场景
  - 特殊关键字解释

**技术改进：**
- 🏗️ 重构扩展架构，添加模块化的语言服务提供者
- 📚 建立完整的 OSG 语法数据库，包含节点、属性、数据类型定义
- 🎯 实现上下文感知的智能提示算法
- 🌐 全面的中文文档支持

**开发体验提升：**
- 💡 输入时即时获得相关建议
- 🔍 悬停查看详细文档，无需查阅外部资料
- ⚡ 大幅提升 OSG 文件编写效率
- 🎨 更好的代码可读性和维护性

## [1.0.0] - 2024-12-19

### 🎉 首次正式发布

**新功能：**
- ✨ 完整的 `.osg` 文件语法高亮支持
- ⚡ 丰富的代码片段集合
- ⚙️ 智能语言配置（注释、括号匹配、自动缩进）

**语法高亮支持：**
- 节点类型高亮 (Group, Geode, Geometry, StateSet, Material 等)
- 属性关键字高亮 (name, DataVariance, nodeMask 等)
- 数据类型高亮 (Vec3, Vec4, Matrix, Quat 等)
- 常量高亮 (TRUE, FALSE, STATIC, DYNAMIC 等)
- 数字、字符串和注释高亮

**代码片段：**
- `group` - 创建 Group 节点
- `geode` - 创建 Geode 节点
- `geometry` - 创建 Geometry 对象
- `stateset` - 创建 StateSet 对象
- `material` - 创建 Material 对象
- `texture2d` - 创建 Texture2D 对象
- `vec3array` - 创建 Vec3Array 数组
- `drawelements` - 创建 DrawElementsUInt 图元集合
- `matrixtransform` - 创建 MatrixTransform 节点

**其他：**
- 📝 完整的项目文档
- 🧪 单元测试覆盖
- 🔧 完善的开发环境配置

---

## 版本号说明

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **主版本**：进行不兼容的 API 修改
- **次版本**：向下兼容的功能性新增
- **修订版本**：向下兼容的问题修正

## 链接

- [GitHub 仓库](https://github.com/diablozzc/vscode-osg)
- [VS Code 市场](https://marketplace.visualstudio.com/items?itemName=diablozzc.vscode-osg)
- [问题反馈](https://github.com/diablozzc/vscode-osg/issues) 
# 更新日志

本文档记录了 VSCode OSG 扩展的所有重要变更。

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
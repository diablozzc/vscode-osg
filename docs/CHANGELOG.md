# 更新日志

所有此项目的重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且此项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划中
- 自动完成功能
- 悬停提示和文档
- 语法错误检查和诊断
- 代码格式化功能
- 大纲视图支持
- 更多代码片段

## [0.1.0] - 2024-06-28

### 新增
- 初始版本发布
- OSG 文件语法高亮支持
  - 节点类型高亮 (Group, Geode, Geometry, StateSet, Material 等)
  - 属性关键字高亮 (name, DataVariance, nodeMask 等)
  - 数据类型高亮 (Vec3, Vec4, Matrix, Quat 等)
  - 常量高亮 (TRUE, FALSE, STATIC, DYNAMIC 等)
  - 数字、字符串和注释高亮
- 代码片段支持
  - `group` - 创建 Group 节点
  - `geode` - 创建 Geode 节点
  - `geometry` - 创建 Geometry 对象
  - `stateset` - 创建 StateSet 对象
  - `material` - 创建 Material 对象
  - `texture2d` - 创建 Texture2D 对象
  - `vec3array` - 创建 Vec3Array 数组
  - `drawelements` - 创建 DrawElementsUInt 图元集合
  - `matrixtransform` - 创建 MatrixTransform 节点
- 语言配置支持
  - 支持 `#` 单行注释
  - 大括号、方括号、圆括号自动匹配和关闭
  - 自动缩进支持
- 基础项目文档和示例文件

### 技术更新
- 使用 TypeScript 开发
- 支持 VS Code 1.74.0 及以上版本
- 基于 TextMate 语法定义 
# OSG 示例文件

本目录包含各种 OSG 文件示例，用于演示扩展的语法高亮和功能。

## 目录结构

- `basic/` - 基础示例文件
- `advanced/` - 高级示例文件（未来添加）

## 基础示例

### basic/test.osg
一个简单的 OSG 场景文件，包含：
- Group 节点层次结构
- Geode 和 Geometry 对象
- Material 和 StateSet 配置
- 基础的顶点和索引数据

### basic/sample.osg
更复杂的示例文件，展示：
- 多层次的场景图结构
- 不同类型的几何体
- 纹理和材质配置
- 变换矩阵应用

## 使用方法

1. 在 VS Code 中打开任何 `.osg` 文件
2. 扩展会自动激活并提供语法高亮
3. 尝试输入代码片段前缀（如 `group`、`material`）并按 Tab 键
4. 使用 `#` 添加注释

## 语法元素演示

这些示例文件展示了扩展支持的各种语法元素：

### 节点类型
- Group, Geode, Geometry
- MatrixTransform, PositionAttitudeTransform
- StateSet, Material, Texture2D
- Light, LightSource, Camera

### 属性关键字
- name, DataVariance, StateSet
- nodeMask, cullingActive, description
- Center, Radius, RangeMode

### 数据类型
- Vec2, Vec3, Vec4, Matrix, Quat
- BoundingBox, BoundingSphere
- float, double, int, bool

### 常量
- TRUE, FALSE, STATIC, DYNAMIC
- OVERRIDE, PROTECTED, ON, OFF
- OpenGL 常量 (GL_TRIANGLES, GL_QUADS 等)

## 贡献新示例

如果您有有趣的 OSG 文件示例，欢迎贡献：

1. 将文件添加到相应的目录（basic/ 或 advanced/）
2. 在文件中添加注释说明其用途和特点
3. 更新此 README 文件
4. 提交 Pull Request

## 参考资源

- [OpenSceneGraph 官方文档](http://www.openscenegraph.org/)
- [OSG 文件格式规范](http://www.openscenegraph.org/documentation/osg_file_format.html)
- [OSG 快速入门指南](http://www.openscenegraph.org/projects/osg/wiki/Support/UserGuides) 
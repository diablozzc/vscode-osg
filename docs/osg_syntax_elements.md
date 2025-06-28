.osg 文件语法元素表

1. 基本结构元素
	•	节点类型（Node Types）例如：⁠Group⁠、⁠Geode⁠、⁠Geometry⁠、⁠Transform⁠、⁠MatrixTransform⁠、⁠StateSet⁠、⁠Material⁠、⁠Light⁠、⁠LightSource⁠ 等，通常作为块的开头关键字。
	•	属性（Attributes）通常是节点下的子项，如 ⁠name⁠、⁠DataVariance⁠、⁠StateSet⁠、⁠Drawables⁠、⁠VertexArray⁠、⁠NormalArray⁠、⁠ColorArray⁠、⁠TexCoordArray⁠ 等。
	•	数据块（Data Blocks）用于存储数组、列表或矩阵数据，格式类似于嵌套括号，如：VertexArray Vec3Array 4 {
  1 2 3
  4 5 6
  7 8 9
  10 11 12
}

2. 语法关键字
	•	类型关键字⁠Group⁠, ⁠Geode⁠, ⁠Geometry⁠, ⁠StateSet⁠, ⁠Material⁠, ⁠MatrixTransform⁠, ⁠Light⁠, ⁠Drawable⁠, ⁠Array⁠, ⁠Vec3Array⁠, ⁠Vec4Array⁠, ⁠FloatArray⁠, ⁠IntArray⁠ 等。
	•	属性关键字⁠name⁠, ⁠DataVariance⁠, ⁠StateSet⁠, ⁠Drawables⁠, ⁠VertexArray⁠, ⁠NormalArray⁠, ⁠ColorArray⁠, ⁠TexCoordArray⁠, ⁠PrimitiveSetList⁠, ⁠ModeList⁠, ⁠UserDataContainer⁠ 等。
	•	数据类型⁠Vec2⁠, ⁠Vec3⁠, ⁠Vec4⁠, ⁠Matrix⁠, ⁠Quat⁠, ⁠BoundingBox⁠, ⁠BoundingSphere⁠, ⁠float⁠, ⁠double⁠, ⁠int⁠, ⁠bool⁠。

3. 结构符号
	•	大括号 ⁠{}⁠用于包裹节点体、数组体、数据块等。
	•	方括号 ⁠[]⁠部分特殊数据结构使用。
	•	括号 ⁠()⁠少量情况下用于参数列表。
	•	等号 ⁠=⁠用于属性赋值，如 ⁠DataVariance DYNAMIC⁠。

4. 注释
	•	单行注释以 ⁠#⁠ 开头，整行或行尾注释。
	•	不支持多行注释，但可以多行连续 ⁠#⁠。

5. 数值和常量
	•	数字整数、浮点数（支持科学计数法）。
	•	布尔值⁠TRUE⁠、⁠FALSE⁠
	•	常量/枚举如 ⁠STATIC⁠, ⁠DYNAMIC⁠, ⁠ON⁠, ⁠OFF⁠, ⁠DEFAULT⁠, ⁠INHERIT⁠ 等。

6. 字符串
	•	名称或路径用双引号包裹，如 ⁠"myNode"⁠，也有直接裸字符串的情况。

7. 特殊结构
	•	数组声明⁠Vec3Array 4 { ... }⁠
	•	索引⁠DrawElementsUInt TRIANGLES 6 { 0 1 2 2 3 0 }⁠
	•	属性设置⁠StateSet { ModeList { GL_LIGHTING ON } }⁠

8. 其他
	•	空格和换行空格、Tab 和换行用于分隔元素，无特殊语义（除非在字符串中）。
	•	嵌套结构支持节点递归嵌套，结构类似 JSON/XML。

# API 文档

本文档描述了 VSCode OSG 扩展提供的 API 接口和扩展点。

## 扩展激活

扩展在检测到 `.osg` 文件时自动激活。激活事件在 `package.json` 中定义：

```json
"activationEvents": [
  "onLanguage:osg"
]
```

## 语言支持

### 语言标识符

- **ID**: `osg`
- **别名**: `OSG`, `OpenSceneGraph`
- **文件扩展名**: `.osg`

### 语法高亮

语法高亮通过 `resources/syntaxes/osg.tmLanguage.json` 定义，包含以下作用域：

#### 节点类型
- `entity.name.type.node.osg` - OSG 节点类型
- `entity.name.type.drawable.osg` - 可绘制对象类型
- `entity.name.type.state.osg` - 状态对象类型

#### 属性和关键字
- `variable.other.property.osg` - 属性名称
- `keyword.other.attribute.osg` - 属性关键字
- `constant.language.boolean.osg` - 布尔常量

#### 数据类型
- `support.type.primitive.osg` - 基本数据类型
- `support.type.vector.osg` - 向量类型
- `support.type.matrix.osg` - 矩阵类型

#### 字面量
- `constant.numeric.integer.osg` - 整数
- `constant.numeric.float.osg` - 浮点数
- `string.quoted.double.osg` - 字符串
- `comment.line.number-sign.osg` - 注释

### 代码片段

代码片段在 `resources/snippets/osg.json` 中定义。每个片段包含：

- `prefix` - 触发前缀
- `body` - 代码模板
- `description` - 描述信息

#### 可用片段

| 前缀 | 描述 | 用途 |
|------|------|------|
| `group` | Group 节点 | 创建场景图分组节点 |
| `geode` | Geode 节点 | 创建几何体容器节点 |
| `geometry` | Geometry 对象 | 创建几何体对象 |
| `stateset` | StateSet 对象 | 创建渲染状态对象 |
| `material` | Material 对象 | 创建材质对象 |
| `texture2d` | Texture2D 对象 | 创建 2D 纹理对象 |
| `vec3array` | Vec3Array 数组 | 创建三维向量数组 |
| `drawelements` | DrawElementsUInt 图元集合 | 创建绘制图元集合 |
| `matrixtransform` | MatrixTransform 节点 | 创建矩阵变换节点 |

### 语言配置

语言配置在 `language-configuration.json` 中定义：

```json
{
  "comments": {
    "lineComment": "#"
  },
  "brackets": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  "autoClosingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["\"", "\""]
  ],
  "surroundingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["\"", "\""]
  ]
}
```

## 扩展架构

### 主要文件

- `src/extension.ts` - 扩展入口点
- `resources/syntaxes/osg.tmLanguage.json` - 语法定义
- `resources/snippets/osg.json` - 代码片段定义
- `language-configuration.json` - 语言配置

### 扩展点

扩展通过 VS Code 的贡献点系统注册功能：

```json
"contributes": {
  "languages": [...],
  "grammars": [...],
  "snippets": [...]
}
```

## 未来 API 计划

### 语言服务器

计划实现语言服务器协议 (LSP) 支持，提供：

- 自动完成 (`textDocument/completion`)
- 悬停信息 (`textDocument/hover`)
- 语法诊断 (`textDocument/publishDiagnostics`)
- 文档符号 (`textDocument/documentSymbol`)
- 定义跳转 (`textDocument/definition`)

### 自定义命令

计划添加自定义命令：

- `osg.format` - 格式化 OSG 文件
- `osg.validate` - 验证 OSG 文件语法
- `osg.preview` - 预览 OSG 场景（如果可能）

### 配置选项

计划添加扩展配置：

```json
"configuration": {
  "properties": {
    "osg.format.enable": {
      "type": "boolean",
      "default": true,
      "description": "启用 OSG 文件格式化"
    },
    "osg.validation.enable": {
      "type": "boolean", 
      "default": true,
      "description": "启用 OSG 文件语法验证"
    }
  }
}
```

## 贡献

如果您想为 API 添加新功能，请参考 [贡献指南](../CONTRIBUTING.md)。 
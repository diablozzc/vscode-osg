# VSCode OSG 扩展开发指南

## 项目结构

```
vscode-osg/
├── .vscode/                    # VSCode 配置文件
│   ├── launch.json            # 调试配置
│   └── tasks.json             # 任务配置
├── docs/                      # 文档目录
│   └── osg_syntax_elements.md # OSG 语法元素表
├── examples/                  # 示例文件
│   └── output.osg            # OSG 样例文件
├── src/                       # 源代码目录
│   └── extension.ts          # 扩展主入口文件
├── snippets/                  # 代码片段
│   └── osg.json              # OSG 代码片段定义
├── syntaxes/                  # 语法定义
│   └── osg.tmLanguage.json   # TextMate 语法规则
├── test/                      # 测试文件
│   └── sample.osg            # 测试用 OSG 文件
├── .gitignore                 # Git 忽略文件
├── .vscodeignore             # VSCode 扩展忽略文件
├── language-configuration.json # 语言配置
├── package.json               # 扩展清单文件
├── tsconfig.json             # TypeScript 配置
├── README.md                 # 说明文档
└── DEVELOPMENT.md            # 开发指南（本文件）
```

## 开发环境设置

### 1. 安装依赖

```bash
# 确保已安装 Node.js (建议 16.x 或更高版本)
npm install
```

### 2. 编译项目

```bash
# 编译 TypeScript 代码
npm run compile

# 或者启动监听模式，自动编译
npm run watch
```

### 3. 调试扩展

1. 在 VSCode 中打开项目根目录
2. 按 F5 或使用菜单 "运行 > 启动调试"
3. 这将打开一个新的 VSCode 窗口（扩展开发主机）
4. 在新窗口中打开一个 .osg 文件测试语法高亮

### 4. 测试扩展

使用 `test/sample.osg` 文件测试各种语法高亮功能：

1. 在扩展开发主机窗口中打开 `test/sample.osg`
2. 验证语法高亮是否正常工作
3. 测试代码片段功能（输入 `group` 然后按 Tab）
4. 测试注释、括号匹配等功能

## 扩展功能

### 已实现功能

1. **语法高亮**
   - 节点类型：Group, Geode, Geometry 等
   - 属性关键字：name, DataVariance 等
   - 数据类型：Vec3, Matrix 等
   - 常量：TRUE, FALSE, STATIC 等
   - 数字、字符串、注释

2. **代码片段**
   - group, geode, geometry 等常用结构

3. **语言配置**
   - 注释支持（#）
   - 括号匹配
   - 自动缩进

### 待实现功能

1. **自动完成**
   - 属性名补全
   - 值建议

2. **悬停提示**
   - 属性说明
   - 数据类型信息

3. **语法检查**
   - 结构验证
   - 类型检查

4. **代码格式化**
   - 自动缩进
   - 结构整理

## 开发注意事项

### 语法规则优先级

在 `syntaxes/osg.tmLanguage.json` 中，模式匹配按照 `patterns` 数组中的顺序进行，因此：

1. 注释应该首先匹配
2. 字符串其次
3. 然后是具体的关键字
4. 最后是通用模式

### 添加新的语法元素

1. 在 `syntaxes/osg.tmLanguage.json` 中添加新的匹配规则
2. 使用适当的 scope 名称（如 `entity.name.type.node.osg`）
3. 测试确保新规则不会干扰现有功能

### 添加新的代码片段

1. 在 `snippets/osg.json` 中添加新条目
2. 使用清晰的 prefix 和描述
3. 提供合理的占位符和默认值

## 打包和发布

### 1. 安装 vsce

```bash
npm install -g vsce
```

### 2. 打包扩展

```bash
vsce package
```

这将生成一个 `.vsix` 文件。

### 3. 本地安装测试

```bash
code --install-extension vscode-osg-0.1.0.vsix
```

### 4. 发布到市场

```bash
vsce publish
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

欢迎贡献代码、报告 bug 或提出功能建议！ 
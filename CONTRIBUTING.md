# 贡献指南

感谢您对 VSCode OSG 扩展项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告 Bug

如果您发现了 bug，请通过 GitHub Issues 报告：

1. 使用清晰的标题描述问题
2. 描述重现步骤
3. 说明预期行为和实际行为
4. 提供环境信息（VS Code 版本、操作系统等）
5. 如果可能，请提供相关的 OSG 文件作为示例

### 功能请求

我们欢迎新功能的建议：

1. 在 Issues 中描述您的想法
2. 解释为什么这个功能对用户有用
3. 考虑是否有替代方案
4. 愿意的话，可以提供实现思路

### 提交代码

1. **Fork 项目** - 在 GitHub 上 fork 这个仓库
2. **创建分支** - 为您的修改创建一个特性分支
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **编写代码** - 进行您的修改
4. **测试** - 确保您的修改不会破坏现有功能
5. **提交** - 使用清晰的提交信息
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **推送** - 推送到您的分支
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Pull Request** - 创建 Pull Request

## 开发环境设置

### 前置要求

- Node.js (16.x 或更高版本)
- VS Code (1.74.0 或更高版本)
- Git

### 设置步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/osg-team/vscode-osg.git
   cd vscode-osg
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **编译项目**
   ```bash
   npm run compile
   ```

4. **开发模式运行**
   - 在 VS Code 中打开项目
   - 按 F5 启动调试模式
   - 这会打开一个新的 VS Code 窗口用于测试扩展

## 代码规范

### TypeScript

- 使用 TypeScript 编写代码
- 遵循项目的 ESLint 配置
- 使用有意义的变量和函数名
- 添加适当的类型注解

### 代码风格

- 使用 2 个空格缩进
- 使用分号结尾
- 字符串使用单引号（除非包含单引号）
- 保持代码简洁和可读

### 提交信息

使用清晰的提交信息，格式：

```
type(scope): description

- feat: 新功能
- fix: 修复 bug
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- test: 测试相关修改
- chore: 构建或辅助工具修改
```

示例：
```
feat(syntax): add support for new OSG node types
fix(snippets): correct Material snippet template
docs(readme): update installation instructions
```

## 测试

### 运行测试

```bash
npm test
```

### 添加测试

- 为新功能添加相应的测试
- 确保测试覆盖边界情况
- 使用描述性的测试名称

## 文档

### 更新文档

如果您的修改影响了用户体验，请更新相关文档：

- README.md - 主要功能描述
- docs/ 目录下的相关文档
- 代码注释

### 文档风格

- 使用简洁清晰的语言
- 提供示例代码
- 保持文档与代码同步

## 发布

项目维护者会处理版本发布。如果您的贡献被合并，它将在下个版本中发布。

## 获得帮助

如果您在贡献过程中遇到问题：

1. 查看现有的 Issues 和 Pull Requests
2. 在 Issues 中提问
3. 查看项目文档

## 行为准则

我们希望所有贡献者都能：

- 保持友善和专业
- 尊重不同观点
- 专注于对项目最有利的事情
- 帮助维护友好的社区环境

感谢您的贡献！🎉 
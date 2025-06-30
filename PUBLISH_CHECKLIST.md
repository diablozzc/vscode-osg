# 📋 发布准备检查清单

在发布 VSCode OSG 扩展到市场之前，请确认以下所有项目都已完成：

## ✅ 文件修改确认

- [x] **package.json** - 已更新发布者信息和仓库链接
- [x] **README.md** - 已更新所有GitHub链接和作者信息  
- [x] **LICENSE** - 已更新版权信息
- [x] **CONTRIBUTING.md** - 已更新仓库链接
- [x] **CHANGELOG.md** - 已创建版本更新日志

## 🔧 技术准备

### GitHub 仓库设置
- [x] 在您的GitHub账户创建名为 `vscode-osg` 的新仓库
- [x] 将代码推送到新仓库
- [x] 设置仓库描述和主题标签
- [x] 确保仓库是公开的

### 本地构建测试
- [x] 运行 `npm install` 安装依赖
- [x] 运行 `npm run compile` 编译项目
- [x] 运行 `npm test` 确保测试通过
- [x] 运行 `npm run package-vsce` 生成扩展包

### VS Code 市场准备
- [ ] 在 [VS Code Marketplace](https://marketplace.visualstudio.com/manage) 注册发布者账户
- [ ] 发布者ID确认为：`diablozzc`
- [ ] 获取个人访问令牌 (Personal Access Token)

## 📤 发布流程

### 1. 安装发布工具
```bash
npm install -g vsce
```

### 2. 登录发布者账户
```bash
vsce login diablozzc
```

### 3. 打包扩展（可选，用于本地测试）
```bash
vsce package
```

### 4. 发布到市场
```bash
vsce publish
```

## 🎯 发布后检查

- [ ] 在VS Code市场搜索确认扩展已发布
- [ ] 测试从市场安装扩展
- [ ] 确认扩展功能正常工作
- [ ] 更新GitHub仓库的README徽章状态

## 📞 支持信息

**发布者信息：**
- 姓名：张志超
- GitHub：[@diablozzc](https://github.com/diablozzc)
- 发布者ID：diablozzc

**扩展信息：**
- 扩展名称：OSG Language Support
- 包名：vscode-osg
- 当前版本：1.0.0

## 🔍 故障排除

### 常见问题：

1. **发布失败 - 权限错误**
   - 确认已正确登录发布者账户
   - 检查Personal Access Token是否有效

2. **包名重复**
   - 确认市场上没有同名扩展
   - 必要时修改package.json中的name字段

3. **版本号问题**
   - 确保版本号遵循语义化版本规范
   - 每次发布都需要递增版本号

4. **文件大小超限**
   - 检查是否包含了不必要的文件
   - 使用.vscodeignore排除不需要的文件

---

**注意：** 首次发布可能需要几分钟到几小时才能在市场中显示。请耐心等待。 
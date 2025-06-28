import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("OSG Language Support extension is now active!");

  // 注册命令
  let disposable = vscode.commands.registerCommand("osg.helloWorld", () => {
    vscode.window.showInformationMessage("Hello from OSG Extension!");
  });

  context.subscriptions.push(disposable);

  // 为 OSG 文件添加语言特性
  const osgSelector: vscode.DocumentSelector = {
    language: "osg",
    scheme: "file",
  };

  // 未来可以在这里添加更多语言特性，如：
  // - 自动完成
  // - 悬停提示
  // - 语法检查
  // - 格式化

  console.log("OSG Language Support extension activated successfully!");
}

export function deactivate() {
  console.log("OSG Language Support extension deactivated");
}

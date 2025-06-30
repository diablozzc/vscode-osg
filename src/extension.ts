import * as vscode from 'vscode';
import { OSGCompletionProvider } from './completionProvider';
import { OSGHoverProvider } from './hoverProvider';
import { OSGDefinitionProvider } from './definitionProvider';
import { OSGReferenceProvider } from './referenceProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('OSG Language Support extension is now active!');

  // 注册命令
  let disposable = vscode.commands.registerCommand('osg.helloWorld', () => {
    vscode.window.showInformationMessage('Hello from OSG Extension!');
  });

  context.subscriptions.push(disposable);

  // 为 OSG 文件添加语言特性
  const osgSelector: vscode.DocumentSelector = {
    language: 'osg',
    scheme: 'file',
  };

  // 注册自动完成提供者
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    osgSelector,
    new OSGCompletionProvider(),
    ' ', // 触发字符：空格
    '{', // 触发字符：左大括号
    '.' // 触发字符：点号
  );

  // 注册悬停提示提供者
  const hoverProvider = vscode.languages.registerHoverProvider(
    osgSelector,
    new OSGHoverProvider()
  );

  // 注册定义跳转提供者
  const definitionProvider = vscode.languages.registerDefinitionProvider(
    osgSelector,
    new OSGDefinitionProvider()
  );

  // 注册引用查找提供者
  const referenceProvider = vscode.languages.registerReferenceProvider(
    osgSelector,
    new OSGReferenceProvider()
  );

  context.subscriptions.push(
    completionProvider,
    hoverProvider,
    definitionProvider,
    referenceProvider
  );

  console.log('OSG Language Support extension activated successfully!');
}

export function deactivate() {
  console.log('OSG Language Support extension deactivated');
}

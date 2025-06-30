import * as vscode from 'vscode';
import {
  getNodeTypeCompletions,
  getAttributeCompletions,
  getConstantCompletions,
  getDataTypeCompletions,
  OSG_NODE_TYPES,
  OSG_ATTRIBUTES,
} from './osgData';

export class OSGCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const lineText = document.lineAt(position).text;
    const linePrefix = lineText.substr(0, position.character);

    // 获取当前上下文
    const currentContext = this.getCurrentContext(document, position);

    // 根据上下文提供不同的完成项
    const completions: vscode.CompletionItem[] = [];

    // 如果在节点内部，提供属性完成
    if (currentContext.inNode) {
      completions.push(
        ...this.getContextualAttributeCompletions(currentContext.nodeType)
      );
      completions.push(...getConstantCompletions());
      completions.push(...getDataTypeCompletions());
    }

    // 如果在根级别或者可以添加子节点的位置，提供节点类型完成
    if (
      !currentContext.inNode ||
      this.canAddChildNode(currentContext.nodeType)
    ) {
      completions.push(...getNodeTypeCompletions());
    }

    // 总是提供常量和数据类型
    if (currentContext.inNode) {
      // 如果当前行看起来像是在设置属性值，提供相关的常量
      const attributeMatch = linePrefix.match(/(\w+)\s+$/);
      if (attributeMatch) {
        const attrName = attributeMatch[1];
        const attrCompletions = this.getAttributeValueCompletions(attrName);
        if (attrCompletions.length > 0) {
          completions.push(...attrCompletions);
        }
      }
    }

    // 过滤重复项
    const uniqueCompletions = this.removeDuplicates(completions);

    return uniqueCompletions;
  }

  /**
   * 获取当前光标所在的上下文信息
   */
  private getCurrentContext(
    document: vscode.TextDocument,
    position: vscode.Position
  ): {
    inNode: boolean;
    nodeType: string | null;
    depth: number;
  } {
    let inNode = false;
    let nodeType: string | null = null;
    let depth = 0;
    let braceCount = 0;

    // 向上扫描找到当前所在的节点
    for (let i = position.line; i >= 0; i--) {
      const line = document.lineAt(i).text.trim();

      // 跳过注释和空行
      if (line.startsWith('#') || line === '') {
        continue;
      }

      // 计算大括号
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;

      if (i === position.line) {
        // 当前行，只计算光标位置之前的大括号
        const linePrefix = line.substr(0, position.character);
        const prefixOpenBraces = (linePrefix.match(/\{/g) || []).length;
        const prefixCloseBraces = (linePrefix.match(/\}/g) || []).length;
        braceCount += prefixOpenBraces - prefixCloseBraces;
      } else {
        braceCount += openBraces - closeBraces;
      }

      // 如果找到节点定义行
      const nodeMatch = line.match(/^(\w+)\s*\{/);
      if (nodeMatch && braceCount > 0) {
        inNode = true;
        nodeType = nodeMatch[1];
        depth = braceCount;
        break;
      }

      // 如果遇到闭合大括号且braceCount为0，说明不在任何节点内
      if (braceCount <= 0) {
        break;
      }
    }

    return { inNode, nodeType, depth };
  }

  /**
   * 根据节点类型获取相关的属性完成项
   */
  private getContextualAttributeCompletions(
    nodeType: string | null
  ): vscode.CompletionItem[] {
    if (!nodeType || !OSG_NODE_TYPES[nodeType]) {
      return getAttributeCompletions();
    }

    const nodeInfo = OSG_NODE_TYPES[nodeType];
    const contextualCompletions: vscode.CompletionItem[] = [];

    // 添加该节点类型支持的属性
    for (const attrName of nodeInfo.attributes) {
      if (OSG_ATTRIBUTES[attrName]) {
        const attr = OSG_ATTRIBUTES[attrName];
        const item = new vscode.CompletionItem(
          attr.name,
          vscode.CompletionItemKind.Property
        );
        item.detail = `${attr.type} - ${attr.description}`;
        item.documentation = new vscode.MarkdownString(
          `**${attr.name}** (${attr.type})\n\n${attr.description}\n\n**示例：**\n\`\`\`osg\n${attr.example}\n\`\`\``
        );

        if (attr.values) {
          item.documentation.appendMarkdown(
            `\n\n**可选值：** ${attr.values.join(', ')}`
          );
        }

        // 设置插入文本，包含合理的默认值
        item.insertText = this.getAttributeInsertText(attr);

        contextualCompletions.push(item);
      }
    }

    return contextualCompletions;
  }

  /**
   * 获取属性的插入文本，包含合理的默认值
   */
  private getAttributeInsertText(attr: any): vscode.SnippetString {
    switch (attr.type) {
      case 'boolean':
        return new vscode.SnippetString(`${attr.name} \${1|TRUE,FALSE|}`);
      case 'enum':
        if (attr.values && attr.values.length > 0) {
          const choices = attr.values.join(',');
          return new vscode.SnippetString(`${attr.name} \${1|${choices}|}`);
        }
        return new vscode.SnippetString(`${attr.name} $1`);
      case 'integer':
        return new vscode.SnippetString(`${attr.name} \${1:1}`);
      case 'float':
        return new vscode.SnippetString(`${attr.name} \${1:1.0}`);
      case 'hex':
        return new vscode.SnippetString(`${attr.name} \${1:0xffffffff}`);
      case 'string':
        return new vscode.SnippetString(`${attr.name} "\${1:value}"`);
      case 'Vec3':
        return new vscode.SnippetString(
          `${attr.name} \${1:0.0} \${2:0.0} \${3:0.0}`
        );
      case 'Vec4':
        return new vscode.SnippetString(
          `${attr.name} \${1:0.0} \${2:0.0} \${3:0.0} \${4:1.0}`
        );
      case 'Matrix4':
        return new vscode.SnippetString(
          `${attr.name} {\n\t\${1:1.0 0.0 0.0 0.0}\n\t\${2:0.0 1.0 0.0 0.0}\n\t\${3:0.0 0.0 1.0 0.0}\n\t\${4:0.0 0.0 0.0 1.0}\n}`
        );
      default:
        return new vscode.SnippetString(`${attr.name} $1`);
    }
  }

  /**
   * 检查是否可以在当前节点类型中添加子节点
   */
  private canAddChildNode(nodeType: string | null): boolean {
    if (!nodeType || !OSG_NODE_TYPES[nodeType]) {
      return true; // 如果不确定，允许添加
    }

    const nodeInfo = OSG_NODE_TYPES[nodeType];
    return nodeInfo.children !== undefined && nodeInfo.children.length > 0;
  }

  /**
   * 获取特定属性的值完成项
   */
  private getAttributeValueCompletions(
    attributeName: string
  ): vscode.CompletionItem[] {
    const attr = OSG_ATTRIBUTES[attributeName];
    if (!attr || !attr.values) {
      return [];
    }

    return attr.values.map(value => {
      const item = new vscode.CompletionItem(
        value,
        vscode.CompletionItemKind.Value
      );
      item.detail = `${attributeName} 的可选值`;
      return item;
    });
  }

  /**
   * 移除重复的完成项
   */
  private removeDuplicates(
    completions: vscode.CompletionItem[]
  ): vscode.CompletionItem[] {
    const seen = new Set<string>();
    return completions.filter(item => {
      const key = item.label.toString();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

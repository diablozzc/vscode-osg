import * as vscode from 'vscode';
import {
  OSG_NODE_TYPES,
  OSG_ATTRIBUTES,
  OSG_DATA_TYPES,
  OSG_CONSTANTS,
} from './osgData';

export class OSGHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // 获取当前光标位置的单词
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return null;
    }

    const word = document.getText(wordRange);

    // 检查是否是OSG节点类型
    if (OSG_NODE_TYPES[word]) {
      return this.createNodeTypeHover(word, wordRange);
    }

    // 检查是否是OSG属性
    if (OSG_ATTRIBUTES[word]) {
      return this.createAttributeHover(word, wordRange);
    }

    // 检查是否是OSG数据类型
    if (OSG_DATA_TYPES[word]) {
      return this.createDataTypeHover(word, wordRange);
    }

    // 检查是否是OSG常量
    if (OSG_CONSTANTS[word]) {
      return this.createConstantHover(word, wordRange);
    }

    // 检查是否是特殊的OSG关键字
    const specialKeywords = this.getSpecialKeywordInfo(word);
    if (specialKeywords) {
      return new vscode.Hover(specialKeywords, wordRange);
    }

    return null;
  }

  /**
   * 创建节点类型的悬停提示
   */
  private createNodeTypeHover(
    nodeType: string,
    range: vscode.Range
  ): vscode.Hover {
    const nodeInfo = OSG_NODE_TYPES[nodeType];

    const markdown = new vscode.MarkdownString();
    markdown.isTrusted = true;

    // 添加标题
    markdown.appendMarkdown(`### ${nodeInfo.name}\n\n`);

    // 添加描述
    markdown.appendMarkdown(`**描述：** ${nodeInfo.description}\n\n`);

    // 添加支持的属性
    if (nodeInfo.attributes && nodeInfo.attributes.length > 0) {
      markdown.appendMarkdown(`**支持的属性：**\n`);
      nodeInfo.attributes.forEach(attr => {
        const attrInfo = OSG_ATTRIBUTES[attr];
        if (attrInfo) {
          markdown.appendMarkdown(
            `- \`${attr}\` (${attrInfo.type}) - ${attrInfo.description}\n`
          );
        } else {
          markdown.appendMarkdown(`- \`${attr}\`\n`);
        }
      });
      markdown.appendMarkdown(`\n`);
    }

    // 添加可包含的子节点
    if (nodeInfo.children && nodeInfo.children.length > 0) {
      markdown.appendMarkdown(
        `**可包含的子节点：** ${nodeInfo.children.join(', ')}\n\n`
      );
    }

    // 添加示例
    if (nodeInfo.example) {
      markdown.appendMarkdown(
        `**示例：**\n\`\`\`osg\n${nodeInfo.example}\n\`\`\``
      );
    }

    return new vscode.Hover(markdown, range);
  }

  /**
   * 创建属性的悬停提示
   */
  private createAttributeHover(
    attributeName: string,
    range: vscode.Range
  ): vscode.Hover {
    const attrInfo = OSG_ATTRIBUTES[attributeName];

    const markdown = new vscode.MarkdownString();
    markdown.isTrusted = true;

    // 添加标题
    markdown.appendMarkdown(`### ${attrInfo.name}\n\n`);

    // 添加类型和描述
    markdown.appendMarkdown(`**类型：** \`${attrInfo.type}\`\n\n`);
    markdown.appendMarkdown(`**描述：** ${attrInfo.description}\n\n`);

    // 添加可选值
    if (attrInfo.values && attrInfo.values.length > 0) {
      markdown.appendMarkdown(
        `**可选值：** ${attrInfo.values.map(v => `\`${v}\``).join(', ')}\n\n`
      );
    }

    // 添加示例
    if (attrInfo.example) {
      markdown.appendMarkdown(
        `**示例：**\n\`\`\`osg\n${attrInfo.example}\n\`\`\``
      );
    }

    // 添加使用该属性的节点类型
    const nodeTypes = this.getNodeTypesUsingAttribute(attributeName);
    if (nodeTypes.length > 0) {
      markdown.appendMarkdown(
        `\n\n**使用此属性的节点：** ${nodeTypes.join(', ')}`
      );
    }

    return new vscode.Hover(markdown, range);
  }

  /**
   * 创建数据类型的悬停提示
   */
  private createDataTypeHover(
    dataType: string,
    range: vscode.Range
  ): vscode.Hover {
    const typeInfo = OSG_DATA_TYPES[dataType];

    const markdown = new vscode.MarkdownString();
    markdown.isTrusted = true;

    // 添加标题
    markdown.appendMarkdown(`### ${typeInfo.name}\n\n`);

    // 添加描述
    markdown.appendMarkdown(`**描述：** ${typeInfo.description}\n\n`);

    // 添加格式
    markdown.appendMarkdown(`**格式：** \`${typeInfo.format}\`\n\n`);

    // 添加示例
    if (typeInfo.example) {
      markdown.appendMarkdown(
        `**示例：**\n\`\`\`osg\n${typeInfo.example}\n\`\`\``
      );
    }

    return new vscode.Hover(markdown, range);
  }

  /**
   * 创建常量的悬停提示
   */
  private createConstantHover(
    constant: string,
    range: vscode.Range
  ): vscode.Hover {
    const description = OSG_CONSTANTS[constant];

    const markdown = new vscode.MarkdownString();
    markdown.isTrusted = true;

    // 添加标题
    markdown.appendMarkdown(`### ${constant}\n\n`);

    // 添加描述
    markdown.appendMarkdown(`**描述：** ${description}\n\n`);

    // 添加使用该常量的属性
    const attributes = this.getAttributesUsingConstant(constant);
    if (attributes.length > 0) {
      markdown.appendMarkdown(`**常用于属性：** ${attributes.join(', ')}`);
    }

    return new vscode.Hover(markdown, range);
  }

  /**
   * 获取特殊关键字的信息
   */
  private getSpecialKeywordInfo(word: string): vscode.MarkdownString | null {
    const specialKeywords: { [key: string]: string } = {
      num_children: '子节点数量 - 指定当前节点包含的子节点数量',
      num_drawables: '可绘制对象数量 - 指定Geode节点包含的几何体数量',
      textureUnit: '纹理单元 - 指定纹理绑定的纹理单元编号',
      light_num: '光源编号 - 指定光源的编号（0-7）',
      PrimitiveSets: '图元集合 - 定义几何体的图元绘制方式',
      VertexArray: '顶点数组 - 定义几何体的顶点坐标',
      NormalArray: '法线数组 - 定义几何体的法线向量',
      ColorArray: '颜色数组 - 定义几何体的顶点颜色',
      TexCoordArray: '纹理坐标数组 - 定义几何体的纹理坐标',
      ModeList: '模式列表 - 定义OpenGL状态模式',
      referenceFrame: '参考坐标系 - 定义变换的参考坐标系',
      RELATIVE_RF: '相对参考坐标系 - 相对于父节点的坐标系',
      ABSOLUTE_RF: '绝对参考坐标系 - 绝对世界坐标系',
      GL_TEXTURE_2D: 'OpenGL纹理2D模式',
      GL_LEQUAL: 'OpenGL小于等于比较函数',
      GL_LUMINANCE: 'OpenGL亮度纹理格式',
    };

    if (specialKeywords[word]) {
      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(`### ${word}\n\n${specialKeywords[word]}`);
      return markdown;
    }

    return null;
  }

  /**
   * 获取使用指定属性的节点类型
   */
  private getNodeTypesUsingAttribute(attributeName: string): string[] {
    const nodeTypes: string[] = [];

    for (const [nodeType, nodeInfo] of Object.entries(OSG_NODE_TYPES)) {
      if (nodeInfo.attributes.includes(attributeName)) {
        nodeTypes.push(nodeType);
      }
    }

    return nodeTypes;
  }

  /**
   * 获取使用指定常量的属性
   */
  private getAttributesUsingConstant(constant: string): string[] {
    const attributes: string[] = [];

    for (const [attrName, attrInfo] of Object.entries(OSG_ATTRIBUTES)) {
      if (attrInfo.values && attrInfo.values.includes(constant)) {
        attributes.push(attrName);
      }
    }

    return attributes;
  }
}

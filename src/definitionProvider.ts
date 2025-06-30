import * as vscode from 'vscode';
import * as path from 'path';
import { OSG_NODE_TYPES, OSG_ATTRIBUTES } from './osgData';

export class OSGDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Definition | null> {
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return null;
    }

    const word = document.getText(wordRange);
    const line = document.lineAt(position.line).text;

    // 检查是否是文件引用
    const fileReference = this.findFileReference(
      word,
      line,
      document,
      position
    );
    if (fileReference) {
      return fileReference;
    }

    // 检查是否是节点类型定义
    const nodeDefinition = this.findNodeDefinition(word, document);
    if (nodeDefinition) {
      return nodeDefinition;
    }

    // 检查是否是属性定义
    const attributeDefinition = this.findAttributeDefinition(word, document);
    if (attributeDefinition) {
      return attributeDefinition;
    }

    // 检查是否是UniqueID引用
    const uniqueIdDefinition = this.findUniqueIdDefinition(word, document);
    if (uniqueIdDefinition) {
      return uniqueIdDefinition;
    }

    return null;
  }

  /**
   * 查找文件引用定义
   */
  private async findFileReference(
    word: string,
    line: string,
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Location | null> {
    // 检查是否是文件路径引用（通常在引号中）
    const filePattern =
      /["']([^"']+\.(?:osg|ive|osgb|jpg|png|bmp|tga|dds|tif|tiff))["']/gi;
    const matches = [...line.matchAll(filePattern)];

    for (const match of matches) {
      const fileName = match[1];
      const matchStart = match.index!;
      const matchEnd = matchStart + match[0].length;

      // 检查当前位置是否在文件名范围内
      if (position.character >= matchStart && position.character <= matchEnd) {
        return await this.findFileInPaths(fileName, document);
      }
    }

    // 检查是否在 FileNameList 中的文件引用
    const fileNameListMatch = await this.findFileInFileNameList(
      word,
      line,
      document,
      position
    );
    if (fileNameListMatch) {
      return fileNameListMatch;
    }

    return null;
  }

  /**
   * 在FileNameList中查找文件引用
   */
  private async findFileInFileNameList(
    word: string,
    line: string,
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Location | null> {
    // 检查是否在FileNameList块内
    const text = document.getText();
    const lines = text.split('\n');
    const currentLineIndex = position.line;

    // 向上查找FileNameList声明
    let inFileNameList = false;
    let braceCount = 0;

    for (let i = currentLineIndex; i >= 0; i--) {
      const checkLine = lines[i];

      // 计算大括号层级
      const openBraces = (checkLine.match(/\{/g) || []).length;
      const closeBraces = (checkLine.match(/\}/g) || []).length;

      if (i === currentLineIndex) {
        // 当前行，只计算当前位置之前的大括号
        const beforeCursor = checkLine.substring(0, position.character);
        const openBracesBeforeCursor = (beforeCursor.match(/\{/g) || []).length;
        const closeBracesBeforeCursor = (beforeCursor.match(/\}/g) || [])
          .length;
        braceCount += openBracesBeforeCursor - closeBracesBeforeCursor;
      } else {
        braceCount += closeBraces - openBraces;
      }

      // 检查是否找到FileNameList声明
      if (checkLine.includes('FileNameList')) {
        if (braceCount >= 0) {
          inFileNameList = true;
        }
        break;
      }

      // 如果遇到其他节点声明，停止查找
      if (braceCount > 0) {
        break;
      }
    }

    if (inFileNameList) {
      // 在FileNameList中，检查当前行是否包含文件引用
      const fileInQuotes = /["']([^"']+\.(?:osg|ive|osgb))["']/gi;
      const matches = [...line.matchAll(fileInQuotes)];

      for (const match of matches) {
        const fileName = match[1];
        const matchStart = match.index!;
        const matchEnd = matchStart + match[0].length;

        // 检查当前位置是否在文件名范围内
        if (
          position.character >= matchStart &&
          position.character <= matchEnd
        ) {
          return await this.findFileInPaths(fileName, document);
        }
      }
    }

    return null;
  }

  /**
   * 在可能的路径中查找文件
   */
  private async findFileInPaths(
    fileName: string,
    document: vscode.TextDocument
  ): Promise<vscode.Location | null> {
    const currentDir = path.dirname(document.uri.fsPath);
    const possiblePaths = [
      path.join(currentDir, fileName),
      path.join(currentDir, '..', fileName),
      path.join(currentDir, 'textures', fileName),
      path.join(currentDir, 'models', fileName),
      path.join(currentDir, 'data', fileName),
      path.join(currentDir, '..', 'data', fileName),
      path.join(currentDir, '..', 'models', fileName),
      path.join(currentDir, '..', 'textures', fileName),
    ];

    for (const filePath of possiblePaths) {
      try {
        const fileUri = vscode.Uri.file(filePath);
        const stat = await vscode.workspace.fs.stat(fileUri);
        if (stat.type === vscode.FileType.File) {
          return new vscode.Location(fileUri, new vscode.Position(0, 0));
        }
      } catch {
        // 文件不存在，继续尝试下一个路径
      }
    }

    return null;
  }

  /**
   * 查找节点类型定义
   */
  private findNodeDefinition(
    word: string,
    document: vscode.TextDocument
  ): vscode.Location | null {
    // 如果是已知的节点类型，返回该节点在文档中的第一个定义位置
    if (OSG_NODE_TYPES[word]) {
      const text = document.getText();
      const lines = text.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // 查找节点定义（节点名称后跟空格和大括号）
        const nodePattern = new RegExp(`\\b${word}\\s*\\{`, 'g');
        const match = nodePattern.exec(line);

        if (match) {
          const position = new vscode.Position(i, match.index);
          return new vscode.Location(document.uri, position);
        }
      }
    }

    return null;
  }

  /**
   * 查找属性定义
   */
  private findAttributeDefinition(
    word: string,
    document: vscode.TextDocument
  ): vscode.Location | null {
    // 如果是已知的属性，返回该属性在文档中的第一个定义位置
    if (OSG_ATTRIBUTES[word]) {
      const text = document.getText();
      const lines = text.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // 查找属性定义（属性名称在行首或空白后）
        const attrPattern = new RegExp(`^\\s*${word}\\b`, 'g');
        const match = attrPattern.exec(line);

        if (match) {
          const position = new vscode.Position(
            i,
            match.index + match[0].indexOf(word)
          );
          return new vscode.Location(document.uri, position);
        }
      }
    }

    return null;
  }

  /**
   * 查找UniqueID定义
   */
  private findUniqueIdDefinition(
    word: string,
    document: vscode.TextDocument
  ): vscode.Location | null {
    const text = document.getText();
    const lines = text.split('\n');

    // 查找UniqueID定义
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const uniqueIdPattern = new RegExp(`^\\s*UniqueID\\s+${word}\\b`, 'g');
      const match = uniqueIdPattern.exec(line);

      if (match) {
        const wordStart = match[0].indexOf(word);
        const position = new vscode.Position(i, match.index + wordStart);
        return new vscode.Location(document.uri, position);
      }
    }

    return null;
  }
}

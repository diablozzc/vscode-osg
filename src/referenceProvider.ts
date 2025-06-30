import * as vscode from 'vscode';
import { OSG_NODE_TYPES, OSG_ATTRIBUTES } from './osgData';

export class OSGReferenceProvider implements vscode.ReferenceProvider {
  async provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ReferenceContext,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[]> {
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return [];
    }

    const word = document.getText(wordRange);
    const references: vscode.Location[] = [];

    // 查找当前文档中的引用
    const currentDocReferences = await this.findReferencesInDocument(
      document,
      word,
      context.includeDeclaration
    );
    references.push(...currentDocReferences);

    // 查找工作区中其他OSG文件的引用
    const workspaceReferences = await this.findReferencesInWorkspace(
      word,
      document.uri,
      context.includeDeclaration
    );
    references.push(...workspaceReferences);

    return references;
  }

  /**
   * 在当前文档中查找引用
   */
  private async findReferencesInDocument(
    document: vscode.TextDocument,
    word: string,
    includeDeclaration: boolean
  ): Promise<vscode.Location[]> {
    const references: vscode.Location[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineReferences = this.findReferencesInLine(
        line,
        word,
        document,
        i,
        includeDeclaration
      );
      references.push(...lineReferences);
    }

    return references;
  }

  /**
   * 在工作区中查找引用
   */
  private async findReferencesInWorkspace(
    word: string,
    currentUri: vscode.Uri,
    includeDeclaration: boolean
  ): Promise<vscode.Location[]> {
    const references: vscode.Location[] = [];

    // 查找所有OSG文件
    const osgFiles = await vscode.workspace.findFiles(
      '**/*.osg',
      '**/node_modules/**'
    );

    for (const fileUri of osgFiles) {
      // 跳过当前文件（已经在上面处理过）
      if (fileUri.toString() === currentUri.toString()) {
        continue;
      }

      try {
        const fileDocument = await vscode.workspace.openTextDocument(fileUri);
        const fileReferences = await this.findReferencesInDocument(
          fileDocument,
          word,
          includeDeclaration
        );
        references.push(...fileReferences);
      } catch (error) {
        // 无法读取文件，跳过
        console.warn(`无法读取文件 ${fileUri.fsPath}:`, error);
      }
    }

    return references;
  }

  /**
   * 在单行中查找引用
   */
  private findReferencesInLine(
    line: string,
    word: string,
    document: vscode.TextDocument,
    lineNumber: number,
    includeDeclaration: boolean
  ): vscode.Location[] {
    const references: vscode.Location[] = [];

    // 节点类型引用
    if (OSG_NODE_TYPES[word]) {
      const nodeReferences = this.findNodeReferences(
        line,
        word,
        document,
        lineNumber,
        includeDeclaration
      );
      references.push(...nodeReferences);
    }

    // 属性引用
    if (OSG_ATTRIBUTES[word]) {
      const attrReferences = this.findAttributeReferences(
        line,
        word,
        document,
        lineNumber,
        includeDeclaration
      );
      references.push(...attrReferences);
    }

    // UniqueID引用
    const uniqueIdReferences = this.findUniqueIdReferences(
      line,
      word,
      document,
      lineNumber,
      includeDeclaration
    );
    references.push(...uniqueIdReferences);

    // 文件引用
    const fileReferences = this.findFileReferences(
      line,
      word,
      document,
      lineNumber
    );
    references.push(...fileReferences);

    return references;
  }

  /**
   * 查找节点类型引用
   */
  private findNodeReferences(
    line: string,
    word: string,
    document: vscode.TextDocument,
    lineNumber: number,
    includeDeclaration: boolean
  ): vscode.Location[] {
    const references: vscode.Location[] = [];

    // 查找节点定义和引用
    const nodePattern = new RegExp(`\\b${word}\\b`, 'g');
    let match;

    while ((match = nodePattern.exec(line)) !== null) {
      // 检查是否是节点定义（后面跟大括号）
      const isDefinition = /\s*\{/.test(
        line.substring(match.index + word.length)
      );

      if (includeDeclaration || !isDefinition) {
        const position = new vscode.Position(lineNumber, match.index);
        references.push(new vscode.Location(document.uri, position));
      }
    }

    return references;
  }

  /**
   * 查找属性引用
   */
  private findAttributeReferences(
    line: string,
    word: string,
    document: vscode.TextDocument,
    lineNumber: number,
    includeDeclaration: boolean
  ): vscode.Location[] {
    const references: vscode.Location[] = [];

    // 查找属性使用
    const attrPattern = new RegExp(`\\b${word}\\b`, 'g');
    let match;

    while ((match = attrPattern.exec(line)) !== null) {
      // 检查是否是属性定义（在行首或空白后，且不在注释中）
      const beforeMatch = line.substring(0, match.index);
      const isDefinition =
        /^\s*$/.test(beforeMatch) && !line.trim().startsWith('#');

      if (includeDeclaration || !isDefinition) {
        const position = new vscode.Position(lineNumber, match.index);
        references.push(new vscode.Location(document.uri, position));
      }
    }

    return references;
  }

  /**
   * 查找UniqueID引用
   */
  private findUniqueIdReferences(
    line: string,
    word: string,
    document: vscode.TextDocument,
    lineNumber: number,
    includeDeclaration: boolean
  ): vscode.Location[] {
    const references: vscode.Location[] = [];

    // 查找UniqueID定义
    const uniqueIdDefPattern = new RegExp(`^\\s*UniqueID\\s+(${word})\\b`, 'g');
    let defMatch = uniqueIdDefPattern.exec(line);

    if (defMatch && includeDeclaration) {
      const wordStart = defMatch[0].indexOf(word);
      const position = new vscode.Position(
        lineNumber,
        defMatch.index + wordStart
      );
      references.push(new vscode.Location(document.uri, position));
    }

    // 查找UniqueID引用（在其他地方使用）
    const uniqueIdRefPattern = new RegExp(`\\b${word}\\b`, 'g');
    let refMatch;

    while ((refMatch = uniqueIdRefPattern.exec(line)) !== null) {
      // 跳过定义行
      if (!line.match(/^\s*UniqueID\s+/)) {
        const position = new vscode.Position(lineNumber, refMatch.index);
        references.push(new vscode.Location(document.uri, position));
      }
    }

    return references;
  }

  /**
   * 查找文件引用
   */
  private findFileReferences(
    line: string,
    word: string,
    document: vscode.TextDocument,
    lineNumber: number
  ): vscode.Location[] {
    const references: vscode.Location[] = [];

    // 查找文件路径引用（包括纹理文件和OSG文件）
    const filePattern =
      /["']([^"']*\.(?:osg|ive|osgb|jpg|png|bmp|tga|dds|tif|tiff))['"]/gi;
    let match;

    while ((match = filePattern.exec(line)) !== null) {
      const fileName = match[1];

      // 检查文件名是否包含查找的词
      if (fileName.includes(word)) {
        const wordIndex = fileName.indexOf(word);
        if (wordIndex !== -1) {
          const position = new vscode.Position(
            lineNumber,
            match.index + 1 + wordIndex // +1 跳过引号
          );
          references.push(new vscode.Location(document.uri, position));
        }
      }
    }

    // 特别处理完整文件名匹配（用于FileNameList等场景）
    const exactFilePattern = new RegExp(`["']([^"']*${word}[^"']*)["']`, 'gi');
    let exactMatch;

    while ((exactMatch = exactFilePattern.exec(line)) !== null) {
      const fileName = exactMatch[1];

      // 检查是否是完整的文件名匹配
      if (
        fileName === word ||
        fileName.endsWith('/' + word) ||
        fileName.endsWith('\\' + word)
      ) {
        const position = new vscode.Position(
          lineNumber,
          exactMatch.index + 1 // +1 跳过引号，指向文件名开始
        );
        references.push(new vscode.Location(document.uri, position));
      }
    }

    return references;
  }
}

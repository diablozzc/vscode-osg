import * as vscode from 'vscode';

// OSG 节点类型定义
export interface OSGNodeType {
  name: string;
  description: string;
  attributes: string[];
  children?: string[];
  example?: string;
}

// OSG 属性定义
export interface OSGAttribute {
  name: string;
  description: string;
  type: string;
  values?: string[];
  example?: string;
}

// OSG 数据类型定义
export interface OSGDataType {
  name: string;
  description: string;
  format: string;
  example?: string;
}

// OSG 节点类型数据
export const OSG_NODE_TYPES: { [key: string]: OSGNodeType } = {
  PagedLOD: {
    name: 'PagedLOD',
    description: '分页细节层次节点，用于管理大规模场景数据',
    attributes: [
      'nodeMask',
      'cullingActive',
      'Center',
      'Radius',
      'RangeMode',
      'RangeList',
      'DatabasePath',
      'NumChildrenThatCannotBeExpired',
      'DisableExternalChildrenPaging',
      'FileNameList',
      'num_children',
    ],
    children: ['Geode', 'Group'],
    example: `PagedLOD {
    Center 0 0 0
    Radius 100
    RangeMode DISTANCE_FROM_EYE_POINT
    RangeList {
        0 100
        100 1000
    }
    FileNameList {
        "child1.osg"
        "child2.osg"
    }
}`,
  },
  Group: {
    name: 'Group',
    description: '组节点，用于组织和管理子节点的容器',
    attributes: [
      'UniqueID',
      'nodeMask',
      'cullingActive',
      'num_children',
      'name',
      'description',
    ],
    children: [
      'Group',
      'Geode',
      'MatrixTransform',
      'LightSource',
      'Switch',
      'LOD',
      'PagedLOD',
    ],
    example: `Group {
    UniqueID Group_0
    nodeMask 0xffffffff
    cullingActive TRUE
    num_children 1
    # 子节点
}`,
  },

  Geode: {
    name: 'Geode',
    description: '几何节点，包含可绘制对象的叶子节点',
    attributes: [
      'nodeMask',
      'cullingActive',
      'num_drawables',
      'name',
      'description',
    ],
    children: ['Geometry', 'ShapeDrawable'],
    example: `Geode {
    nodeMask 0xffffffff
    cullingActive TRUE
    num_drawables 1
    # 几何体
}`,
  },

  Geometry: {
    name: 'Geometry',
    description: '几何体对象，定义顶点数据和图元',
    attributes: [
      'DataVariance',
      'useDisplayList',
      'useVertexBufferObjects',
      'PrimitiveSets',
      'VertexArray',
      'NormalArray',
      'ColorArray',
      'TexCoordArray',
      'StateSet',
    ],
    children: ['StateSet'],
    example: `Geometry {
    DataVariance STATIC
    useDisplayList TRUE
    useVertexBufferObjects FALSE
    PrimitiveSets 1 {
        DrawElementsUInt TRIANGLES 6 {
            0 1 2 2 1 3
        }
    }
    VertexArray Vec3Array 4 {}
    TexCoordArray 0 Vec2Array 4 {}
}`,
  },

  MatrixTransform: {
    name: 'MatrixTransform',
    description: '矩阵变换节点，用于对子节点进行空间变换',
    attributes: [
      'UniqueID',
      'DataVariance',
      'nodeMask',
      'cullingActive',
      'referenceFrame',
      'Matrix',
      'num_children',
    ],
    children: ['Group', 'Geode', 'MatrixTransform'],
    example: `MatrixTransform {
    DataVariance STATIC
    Matrix {
        1.0 0.0 0.0 0.0
        0.0 1.0 0.0 0.0
        0.0 0.0 1.0 0.0
        0.0 0.0 0.0 1.0
    }
    num_children 1
}`,
  },

  StateSet: {
    name: 'StateSet',
    description: '状态集合，定义渲染状态和材质属性',
    attributes: [
      'DataVariance',
      'rendering_hint',
      'renderBinMode',
      'ModeList',
      'textureUnit',
      'GL_TEXTURE_2D',
    ],
    example: `StateSet {
    DataVariance STATIC
    rendering_hint DEFAULT_BIN
    renderBinMode INHERIT
    textureUnit 0 {
        GL_TEXTURE_2D ON
        Texture2D {
            file "texture.jpg"
        }
    }
}`,
  },

  Material: {
    name: 'Material',
    description: '材质对象，定义表面光照属性',
    attributes: [
      'UniqueID',
      'DataVariance',
      'ColorMode',
      'ambientColor',
      'diffuseColor',
      'specularColor',
      'emissionColor',
      'shininess',
    ],
    example: `Material {
    UniqueID Material_1
    DataVariance STATIC
    ColorMode OFF
    ambientColor 1 1 1 1
    diffuseColor 1 1 1 1
    specularColor 0 0 0 1
    emissionColor 0 0 0 1
    shininess 0
}`,
  },

  Texture2D: {
    name: 'Texture2D',
    description: '二维纹理对象，用于贴图映射',
    attributes: [
      'DataVariance',
      'file',
      'wrap_s',
      'wrap_t',
      'wrap_r',
      'min_filter',
      'mag_filter',
      'maxAnisotropy',
      'borderColor',
      'borderWidth',
      'useHardwareMipMapGeneration',
      'unRefImageDataAfterApply',
      'internalFormatMode',
      'resizeNonPowerOfTwo',
      'shadowComparison',
      'shadowCompareFunc',
      'shadowTextureMode',
    ],
    example: `Texture2D {
    DataVariance STATIC
    file "texture.jpg"
    wrap_s REPEAT
    wrap_t REPEAT
    min_filter LINEAR_MIPMAP_LINEAR
    mag_filter LINEAR
}`,
  },

  LightSource: {
    name: 'LightSource',
    description: '光源节点，包含光照对象',
    attributes: ['nodeMask', 'cullingActive', 'Light'],
    example: `LightSource {
    nodeMask 0xffffffff
    cullingActive TRUE
    Light {
        light_num 0
        ambient 0.1 0.1 0.1 1.0
        diffuse 0.8 0.8 0.8 1.0
    }
}`,
  },

  Light: {
    name: 'Light',
    description: '光照对象，定义光源属性',
    attributes: [
      'light_num',
      'ambient',
      'diffuse',
      'specular',
      'position',
      'direction',
      'constantAttenuation',
      'linearAttenuation',
      'quadraticAttenuation',
      'spotExponent',
      'spotCutoff',
    ],
    example: `Light {
    light_num 0
    ambient 0.1 0.1 0.1 1.0
    diffuse 0.8 0.8 0.8 1.0
    position 0.0 0.0 1.0 0.0
}`,
  },
};

// OSG 属性数据
export const OSG_ATTRIBUTES: { [key: string]: OSGAttribute } = {
  UniqueID: {
    name: 'UniqueID',
    description: '节点的唯一标识符',
    type: 'string',
    example: 'UniqueID Group_0',
  },

  nodeMask: {
    name: 'nodeMask',
    description: '节点掩码，用于控制节点的可见性和遍历',
    type: 'hex',
    example: 'nodeMask 0xffffffff',
  },

  cullingActive: {
    name: 'cullingActive',
    description: '是否启用剔除检测',
    type: 'boolean',
    values: ['TRUE', 'FALSE'],
    example: 'cullingActive TRUE',
  },

  DataVariance: {
    name: 'DataVariance',
    description: '数据变化频率，影响渲染优化',
    type: 'enum',
    values: ['STATIC', 'DYNAMIC'],
    example: 'DataVariance STATIC',
  },

  num_children: {
    name: 'num_children',
    description: '子节点数量',
    type: 'integer',
    example: 'num_children 1',
  },

  num_drawables: {
    name: 'num_drawables',
    description: '可绘制对象数量',
    type: 'integer',
    example: 'num_drawables 1',
  },

  useDisplayList: {
    name: 'useDisplayList',
    description: '是否使用显示列表进行渲染优化',
    type: 'boolean',
    values: ['TRUE', 'FALSE'],
    example: 'useDisplayList TRUE',
  },

  useVertexBufferObjects: {
    name: 'useVertexBufferObjects',
    description: '是否使用顶点缓冲对象(VBO)',
    type: 'boolean',
    values: ['TRUE', 'FALSE'],
    example: 'useVertexBufferObjects FALSE',
  },

  rendering_hint: {
    name: 'rendering_hint',
    description: '渲染提示，指定渲染顺序',
    type: 'enum',
    values: ['DEFAULT_BIN', 'OPAQUE_BIN', 'TRANSPARENT_BIN'],
    example: 'rendering_hint DEFAULT_BIN',
  },

  renderBinMode: {
    name: 'renderBinMode',
    description: '渲染箱模式',
    type: 'enum',
    values: ['INHERIT', 'USE_RENDERBIN_DETAILS', 'OVERRIDE_RENDERBIN_DETAILS'],
    example: 'renderBinMode INHERIT',
  },

  ColorMode: {
    name: 'ColorMode',
    description: '颜色模式',
    type: 'enum',
    values: ['OFF', 'AMBIENT', 'DIFFUSE', 'SPECULAR', 'AMBIENT_AND_DIFFUSE'],
    example: 'ColorMode OFF',
  },

  ambientColor: {
    name: 'ambientColor',
    description: '环境光颜色 (R G B A)',
    type: 'Vec4',
    example: 'ambientColor 0.2 0.2 0.2 1.0',
  },

  diffuseColor: {
    name: 'diffuseColor',
    description: '漫反射颜色 (R G B A)',
    type: 'Vec4',
    example: 'diffuseColor 0.8 0.8 0.8 1.0',
  },

  specularColor: {
    name: 'specularColor',
    description: '镜面反射颜色 (R G B A)',
    type: 'Vec4',
    example: 'specularColor 1.0 1.0 1.0 1.0',
  },

  emissionColor: {
    name: 'emissionColor',
    description: '自发光颜色 (R G B A)',
    type: 'Vec4',
    example: 'emissionColor 0.0 0.0 0.0 1.0',
  },

  shininess: {
    name: 'shininess',
    description: '光泽度，控制镜面反射的锐利程度',
    type: 'float',
    example: 'shininess 64.0',
  },

  file: {
    name: 'file',
    description: '纹理文件路径',
    type: 'string',
    example: 'file "texture.jpg"',
  },

  wrap_s: {
    name: 'wrap_s',
    description: 'S方向纹理包装模式',
    type: 'enum',
    values: ['CLAMP', 'CLAMP_TO_EDGE', 'CLAMP_TO_BORDER', 'REPEAT', 'MIRROR'],
    example: 'wrap_s REPEAT',
  },

  wrap_t: {
    name: 'wrap_t',
    description: 'T方向纹理包装模式',
    type: 'enum',
    values: ['CLAMP', 'CLAMP_TO_EDGE', 'CLAMP_TO_BORDER', 'REPEAT', 'MIRROR'],
    example: 'wrap_t REPEAT',
  },

  wrap_r: {
    name: 'wrap_r',
    description: 'R方向纹理包装模式',
    type: 'enum',
    values: ['CLAMP', 'CLAMP_TO_EDGE', 'CLAMP_TO_BORDER', 'REPEAT', 'MIRROR'],
    example: 'wrap_r REPEAT',
  },

  min_filter: {
    name: 'min_filter',
    description: '纹理缩小过滤方式',
    type: 'enum',
    values: [
      'LINEAR',
      'NEAREST',
      'LINEAR_MIPMAP_LINEAR',
      'LINEAR_MIPMAP_NEAREST',
      'NEAREST_MIPMAP_LINEAR',
      'NEAREST_MIPMAP_NEAREST',
    ],
    example: 'min_filter LINEAR_MIPMAP_LINEAR',
  },

  mag_filter: {
    name: 'mag_filter',
    description: '纹理放大过滤方式',
    type: 'enum',
    values: ['LINEAR', 'NEAREST'],
    example: 'mag_filter LINEAR',
  },

  maxAnisotropy: {
    name: 'maxAnisotropy',
    description: '最大各向异性过滤级别',
    type: 'float',
    example: 'maxAnisotropy 1.0',
  },

  borderColor: {
    name: 'borderColor',
    description: '边框颜色 (R G B A)',
    type: 'Vec4',
    example: 'borderColor 0.0 0.0 0.0 0.0',
  },

  borderWidth: {
    name: 'borderWidth',
    description: '边框宽度',
    type: 'float',
    example: 'borderWidth 0.0',
  },

  useHardwareMipMapGeneration: {
    name: 'useHardwareMipMapGeneration',
    description: '是否使用硬件Mipmap生成',
    type: 'boolean',
    values: ['TRUE', 'FALSE'],
    example: 'useHardwareMipMapGeneration TRUE',
  },

  unRefImageDataAfterApply: {
    name: 'unRefImageDataAfterApply',
    description: '应用后是否取消引用图像数据',
    type: 'boolean',
    values: ['TRUE', 'FALSE'],
    example: 'unRefImageDataAfterApply TRUE',
  },

  internalFormatMode: {
    name: 'internalFormatMode',
    description: '内部格式模式',
    type: 'enum',
    values: ['USE_IMAGE_DATA_FORMAT', 'USE_USER_DEFINED_FORMAT'],
    example: 'internalFormatMode USE_IMAGE_DATA_FORMAT',
  },

  resizeNonPowerOfTwo: {
    name: 'resizeNonPowerOfTwo',
    description: '是否调整非2的幂次纹理',
    type: 'boolean',
    values: ['TRUE', 'FALSE'],
    example: 'resizeNonPowerOfTwo TRUE',
  },

  shadowComparison: {
    name: 'shadowComparison',
    description: '是否启用阴影比较',
    type: 'boolean',
    values: ['TRUE', 'FALSE'],
    example: 'shadowComparison FALSE',
  },

  shadowCompareFunc: {
    name: 'shadowCompareFunc',
    description: '阴影比较函数',
    type: 'enum',
    values: [
      'GL_LEQUAL',
      'GL_GEQUAL',
      'GL_LESS',
      'GL_GREATER',
      'GL_EQUAL',
      'GL_NOTEQUAL',
      'GL_ALWAYS',
      'GL_NEVER',
    ],
    example: 'shadowCompareFunc GL_LEQUAL',
  },

  shadowTextureMode: {
    name: 'shadowTextureMode',
    description: '阴影纹理模式',
    type: 'enum',
    values: ['GL_LUMINANCE', 'GL_INTENSITY', 'GL_ALPHA'],
    example: 'shadowTextureMode GL_LUMINANCE',
  },

  Center: {
    name: 'Center',
    description: 'PagedLOD节点的中心点',
    type: 'Vec3',
    example: 'Center 0.0 0.0 0.0',
  },

  Radius: {
    name: 'Radius',
    description: 'PagedLOD节点的半径',
    type: 'float',
    example: 'Radius 100.0',
  },

  RangeMode: {
    name: 'RangeMode',
    description: 'PagedLOD节点的范围模式',
    type: 'enum',
    values: ['DISTANCE_FROM_EYE_POINT', 'PIXEL_SIZE_ON_SCREEN'],
    example: 'RangeMode DISTANCE_FROM_EYE_POINT',
  },

  RangeList: {
    name: 'RangeList',
    description: 'PagedLOD节点的范围列表',
    type: 'array',
    example: `RangeList {
    0 100
    100 1000
  }`,
  },

  DatabasePath: {
    name: 'DatabasePath',
    description: 'PagedLOD节点的数据库路径',
    type: 'string',
    example: 'DatabasePath "data/"',
  },

  NumChildrenThatCannotBeExpired: {
    name: 'NumChildrenThatCannotBeExpired',
    description: 'PagedLOD节点中不能被过期的子节点数量',
    type: 'integer',
    example: 'NumChildrenThatCannotBeExpired 0',
  },

  DisableExternalChildrenPaging: {
    name: 'DisableExternalChildrenPaging',
    description: 'PagedLOD节点是否禁用外部子节点分页',
    type: 'boolean',
    values: ['TRUE', 'FALSE'],
    example: 'DisableExternalChildrenPaging FALSE',
  },

  FileNameList: {
    name: 'FileNameList',
    description: 'PagedLOD节点的子文件名列表',
    type: 'array',
    example: `FileNameList {
    "child1.osg"
    "child2.osg"
  }`,
  },

  Matrix: {
    name: 'Matrix',
    description: '4x4变换矩阵',
    type: 'Matrix4',
    example: `Matrix {
    1.0 0.0 0.0 0.0
    0.0 1.0 0.0 0.0
    0.0 0.0 1.0 0.0
    0.0 0.0 0.0 1.0
}`,
  },

  // 新增属性
  textureUnit: {
    name: 'textureUnit',
    description: '纹理单元，指定纹理绑定的单元号',
    type: 'integer',
    example: 'textureUnit 0',
  },

  GL_TEXTURE_2D: {
    name: 'GL_TEXTURE_2D',
    description: '2D纹理状态',
    type: 'enum',
    values: ['ON', 'OFF'],
    example: 'GL_TEXTURE_2D ON',
  },

  PrimitiveSets: {
    name: 'PrimitiveSets',
    description: '图元集合数量',
    type: 'integer',
    example: 'PrimitiveSets 1',
  },

  VertexArray: {
    name: 'VertexArray',
    description: '顶点数组',
    type: 'array',
    example: 'VertexArray Vec3Array 13079',
  },

  NormalArray: {
    name: 'NormalArray',
    description: '法向量数组',
    type: 'array',
    example: 'NormalArray Vec3Array 1024',
  },

  ColorArray: {
    name: 'ColorArray',
    description: '颜色数组',
    type: 'array',
    example: 'ColorArray Vec4Array 1024',
  },

  TexCoordArray: {
    name: 'TexCoordArray',
    description: '纹理坐标数组',
    type: 'array',
    example: 'TexCoordArray 0 Vec2Array 13079',
  },

  name: {
    name: 'name',
    description: '节点名称',
    type: 'string',
    example: 'name "MyNode"',
  },

  description: {
    name: 'description',
    description: '节点描述信息',
    type: 'string',
    example: 'description "Node description"',
  },
};

// OSG 数据类型
export const OSG_DATA_TYPES: { [key: string]: OSGDataType } = {
  Vec2: {
    name: 'Vec2',
    description: '二维向量 (x, y)',
    format: 'float float',
    example: '1.0 0.0',
  },

  Vec3: {
    name: 'Vec3',
    description: '三维向量 (x, y, z)',
    format: 'float float float',
    example: '1.0 0.0 0.0',
  },

  Vec4: {
    name: 'Vec4',
    description: '四维向量 (x, y, z, w)',
    format: 'float float float float',
    example: '1.0 0.0 0.0 1.0',
  },

  Vec3Array: {
    name: 'Vec3Array',
    description: '三维向量数组',
    format: 'Vec3Array count { ... }',
    example: `Vec3Array 4 {
    -1.0 -1.0 0.0
     1.0 -1.0 0.0
     1.0  1.0 0.0
    -1.0  1.0 0.0
}`,
  },

  Vec2Array: {
    name: 'Vec2Array',
    description: '二维向量数组',
    format: 'Vec2Array count { ... }',
    example: `Vec2Array 4 {
    0.0 0.0
    1.0 0.0
    1.0 1.0
    0.0 1.0
}`,
  },

  DrawElementsUInt: {
    name: 'DrawElementsUInt',
    description: '无符号整数索引图元集合',
    format: 'DrawElementsUInt primitive_type count { indices... }',
    example: `DrawElementsUInt TRIANGLES 6 {
    0 1 2 2 1 3
}`,
  },

  Matrix4: {
    name: 'Matrix4',
    description: '4x4矩阵',
    format: '16个浮点数，按行排列',
    example: `Matrix {
    1.0 0.0 0.0 0.0
    0.0 1.0 0.0 0.0
    0.0 0.0 1.0 0.0
    0.0 0.0 0.0 1.0
}`,
  },

  PrimitiveSet: {
    name: 'PrimitiveSet',
    description: '图元集合',
    format: 'PrimitiveSet type count { data... }',
    example: `DrawElementsUInt TRIANGLES 3 {
    0 1 2
}`,
  },
};

// OSG 常量
export const OSG_CONSTANTS: { [key: string]: string } = {
  TRUE: '布尔值：真',
  FALSE: '布尔值：假',
  STATIC: '数据变化频率：静态，数据不经常改变',
  DYNAMIC: '数据变化频率：动态，数据经常改变',
  ON: '状态：开启',
  OFF: '状态：关闭',
  DEFAULT_BIN: '默认渲染箱',
  OPAQUE_BIN: '不透明渲染箱',
  TRANSPARENT_BIN: '透明渲染箱',
  INHERIT: '继承父节点设置',
  TRIANGLES: '图元类型：三角形',
  TRIANGLE_STRIP: '图元类型：三角形带',
  TRIANGLE_FAN: '图元类型：三角形扇',
  QUADS: '图元类型：四边形',
  POINTS: '图元类型：点',
  LINES: '图元类型：线段',
  LINE_STRIP: '图元类型：线带',
  REPEAT: '纹理包装：重复',
  CLAMP: '纹理包装：夹取',
  CLAMP_TO_EDGE: '纹理包装：夹取到边缘',
  CLAMP_TO_BORDER: '纹理包装：夹取到边框',
  MIRROR: '纹理包装：镜像',
  LINEAR: '过滤方式：线性插值',
  NEAREST: '过滤方式：最近邻',
  LINEAR_MIPMAP_LINEAR: '过滤方式：线性Mipmap线性插值',
  LINEAR_MIPMAP_NEAREST: '过滤方式：线性Mipmap最近邻',
  NEAREST_MIPMAP_LINEAR: '过滤方式：最近邻Mipmap线性',
  NEAREST_MIPMAP_NEAREST: '过滤方式：最近邻Mipmap最近邻',
  PIXEL_SIZE_ON_SCREEN: 'PagedLOD范围模式：基于屏幕像素大小',
  DISTANCE_FROM_EYE_POINT: 'PagedLOD范围模式：基于视点距离',
  USE_IMAGE_DATA_FORMAT: '内部格式模式：使用图像数据格式',
  USE_USER_DEFINED_FORMAT: '内部格式模式：使用用户定义格式',
  GL_LEQUAL: 'OpenGL比较函数：小于等于',
  GL_GEQUAL: 'OpenGL比较函数：大于等于',
  GL_LESS: 'OpenGL比较函数：小于',
  GL_GREATER: 'OpenGL比较函数：大于',
  GL_EQUAL: 'OpenGL比较函数：等于',
  GL_NOTEQUAL: 'OpenGL比较函数：不等于',
  GL_ALWAYS: 'OpenGL比较函数：总是通过',
  GL_NEVER: 'OpenGL比较函数：从不通过',
  GL_LUMINANCE: 'OpenGL纹理模式：亮度',
  GL_INTENSITY: 'OpenGL纹理模式：强度',
  GL_ALPHA: 'OpenGL纹理模式：透明度',
  AMBIENT: '颜色模式：环境光',
  DIFFUSE: '颜色模式：漫反射',
  SPECULAR: '颜色模式：镜面反射',
  AMBIENT_AND_DIFFUSE: '颜色模式：环境光和漫反射',
};

// 获取节点类型的完成项
export function getNodeTypeCompletions(): vscode.CompletionItem[] {
  return Object.values(OSG_NODE_TYPES).map(nodeType => {
    const item = new vscode.CompletionItem(
      nodeType.name,
      vscode.CompletionItemKind.Class
    );
    item.detail = nodeType.description;
    item.documentation = new vscode.MarkdownString(
      `**${nodeType.name}**\n\n${nodeType.description}\n\n**示例：**\n\`\`\`osg\n${nodeType.example}\n\`\`\``
    );
    item.insertText = new vscode.SnippetString(nodeType.name + ' {\n\t$0\n}');
    return item;
  });
}

// 获取属性的完成项
export function getAttributeCompletions(): vscode.CompletionItem[] {
  return Object.values(OSG_ATTRIBUTES).map(attr => {
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

    return item;
  });
}

// 获取常量的完成项
export function getConstantCompletions(): vscode.CompletionItem[] {
  return Object.entries(OSG_CONSTANTS).map(([name, description]) => {
    const item = new vscode.CompletionItem(
      name,
      vscode.CompletionItemKind.Constant
    );
    item.detail = description;
    item.documentation = new vscode.MarkdownString(
      `**${name}**\n\n${description}`
    );
    return item;
  });
}

// 获取数据类型的完成项
export function getDataTypeCompletions(): vscode.CompletionItem[] {
  return Object.values(OSG_DATA_TYPES).map(dataType => {
    const item = new vscode.CompletionItem(
      dataType.name,
      vscode.CompletionItemKind.Struct
    );
    item.detail = dataType.description;
    item.documentation = new vscode.MarkdownString(
      `**${dataType.name}**\n\n${dataType.description}\n\n**格式：** ${dataType.format}\n\n**示例：**\n\`\`\`osg\n${dataType.example}\n\`\`\``
    );
    return item;
  });
}

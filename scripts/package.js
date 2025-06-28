const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function createVsix() {
  // 确保 dist 目录存在
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  const output = fs.createWriteStream('dist/vscode-osg-0.1.0.vsix');
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  output.on('close', function () {
    console.log('✅ VSIX 包创建成功！');
    console.log(`📦 文件大小: ${archive.pointer()} bytes`);
    console.log('📁 输出文件: dist/vscode-osg-0.1.0.vsix');
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);

  // 添加必要的文件到 extension/ 目录
  const filesToInclude = [
    'package.json',
    'README.md',
    'language-configuration.json',
    'resources/syntaxes/osg.tmLanguage.json',
    'resources/snippets/osg.json',
    'out/extension.js',
    'out/extension.js.map',
  ];

  filesToInclude.forEach(file => {
    if (fs.existsSync(file)) {
      archive.file(file, { name: `extension/${file}` });
      console.log(`✓ 添加文件: extension/${file}`);
    } else {
      console.log(`⚠️  文件不存在: ${file}`);
    }
  });

  // 创建 [Content_Types].xml
  const contentTypes =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n' +
    '    <Default Extension="json" ContentType="application/json" />\n' +
    '    <Default Extension="vsixmanifest" ContentType="text/xml" />\n' +
    '    <Default Extension="js" ContentType="application/javascript" />\n' +
    '    <Default Extension="map" ContentType="application/json" />\n' +
    '    <Default Extension="md" ContentType="text/plain" />\n' +
    '</Types>';

  archive.append(contentTypes, { name: '[Content_Types].xml' });
  console.log('✓ 添加文件: [Content_Types].xml');

  // 读取 package.json 信息
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  // 创建扩展清单
  const manifest =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">\n' +
    '    <Metadata>\n' +
    `        <Identity Language="en-US" Id="${packageJson.name}" Version="${packageJson.version}" Publisher="${packageJson.publisher}" />\n` +
    `        <DisplayName>${packageJson.displayName}</DisplayName>\n` +
    `        <Description xml:space="preserve">${packageJson.description}</Description>\n` +
    `        <Categories>${packageJson.categories.join(',')}</Categories>\n` +
    '        <GalleryFlags>Public</GalleryFlags>\n' +
    '        <Properties>\n' +
    `            <Property Id="Microsoft.VisualStudio.Code.Engine" Value="${packageJson.engines.vscode}" />\n` +
    '        </Properties>\n' +
    '    </Metadata>\n' +
    '    <Installation>\n' +
    '        <InstallationTarget Id="Microsoft.VisualStudio.Code"/>\n' +
    '    </Installation>\n' +
    '    <Dependencies/>\n' +
    '    <Assets>\n' +
    '        <Asset Type="Microsoft.VisualStudio.Code.Manifest" d:Source="File" Path="extension/package.json" Addressable="true" />\n' +
    '        <Asset Type="Microsoft.VisualStudio.Services.Content.Details" d:Source="File" Path="extension/README.md" Addressable="true" />\n' +
    '    </Assets>\n' +
    '</PackageManifest>';

  archive.append(manifest, { name: 'extension.vsixmanifest' });
  console.log('✓ 添加文件: extension.vsixmanifest');

  archive.finalize();
}

// 检查依赖
try {
  require('archiver');
  createVsix();
} catch (e) {
  console.log('❌ 需要安装 archiver 依赖');
  console.log('请运行: npm install archiver');
  console.log('然后再次运行: node package-manual.js');
}

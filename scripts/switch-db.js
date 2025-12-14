const fs = require('fs');
const path = require('path');

const mode = process.argv[2]; // 'local' or 'prod'

if (!mode || (mode !== 'local' && mode !== 'prod')) {
    console.error('Usage: node scripts/switch-db.js [local|prod]');
    process.exit(1);
}

const prismaDir = path.join(__dirname, '..', 'prisma');
const targetFile = path.join(prismaDir, 'schema.prisma');
const sourceFile = path.join(prismaDir, mode === 'local' ? 'schema.local.prisma' : 'schema.prod.prisma');

try {
    const content = fs.readFileSync(sourceFile, 'utf8');
    fs.writeFileSync(targetFile, content);
    console.log(`Successfully switched schema.prisma to ${mode} configuration.`);
} catch (error) {
    console.error('Error switching schema:', error);
    process.exit(1);
}

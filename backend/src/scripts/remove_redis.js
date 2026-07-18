const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../routes');

// Clean route files
const files = fs.readdirSync(routesDir);
for (const file of files) {
  if (file.endsWith('.ts')) {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the import statement
    content = content.replace(/import\s*{\s*cacheable\s*,\s*invalidates\s*}\s*from\s*'[^']+\/cache\.middleware';\n?/g, '');
    
    // Remove cacheable({ ... }) and invalidates('...') from route definitions
    content = content.replace(/,\s*cacheable\(\{[^\}]+\}\)/g, '');
    content = content.replace(/cacheable\(\{[^\}]+\}\),\s*/g, '');
    content = content.replace(/,\s*invalidates\('[^']+'\)/g, '');
    content = content.replace(/invalidates\('[^']+'\),\s*/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// Clean rateLimiter
const rateLimiterPath = path.join(__dirname, '../middlewares/rateLimiter.ts');
let rateLimiterContent = fs.readFileSync(rateLimiterPath, 'utf8');
rateLimiterContent = rateLimiterContent.replace(/import { getRedis } from '..\/..\/config\/redis';\n?/, '');
rateLimiterContent = rateLimiterContent.replace(/function makeRedisStore.*?}\n\n/s, '');
rateLimiterContent = rateLimiterContent.replace(/store:\s*makeRedisStore\([^)]+\)\s*as\s*any,\n/g, '');
fs.writeFileSync(rateLimiterPath, rateLimiterContent, 'utf8');

// Clean server.ts
const serverPath = path.join(__dirname, '../server.ts');
let serverContent = fs.readFileSync(serverPath, 'utf8');
serverContent = serverContent.replace(/import\s*{\s*connectRedis\s*,\s*closeRedis\s*}\s*from\s*'..\/config\/redis';\n?/g, '');
serverContent = serverContent.replace(/\s*if\s*\(environment\.redisUrl\)\s*\{\s*try\s*\{\s*await connectRedis\(\);\s*console\.log\('[^']+'\);\s*\}\s*catch\s*\(err\)\s*\{\s*console\.warn\('[^']+',\s*\(err as Error\)\.message\);\s*\}\s*\}\s*else\s*\{\s*console\.log\('[^']+'\);\s*\}/g, '');
serverContent = serverContent.replace(/\s*await closeRedis\(\);\s*console\.log\('Conexión de Redis cerrada correctamente\.'\);/g, '');
fs.writeFileSync(serverPath, serverContent, 'utf8');

console.log("Cleanup done.");

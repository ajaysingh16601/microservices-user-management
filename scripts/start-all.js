const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const env = process.argv[2] || 'dev';
const rootDir = path.join(__dirname, '..');

console.log('=============================================');
console.log(`  Starting All Services (${env.toUpperCase()} environment)`);
console.log('=============================================\n');

// Step 1: Install concurrently if not installed
const concurrentlyPath = path.join(rootDir, 'node_modules', '.bin', 'concurrently');
if (!fs.existsSync(concurrentlyPath) && !fs.existsSync(concurrentlyPath + '.cmd')) {
  console.log('Installing root dependencies...\n');
  execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
}

// Step 2: Make sure uploads folders exist
const authUploads = path.join(rootDir, 'auth-service', 'uploads', 'profile');
const userUploads = path.join(rootDir, 'user-service', 'uploads', 'profile');
[authUploads, userUploads].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${path.relative(rootDir, dir)}`);
  }
});

// Step 3: Check env files exist
const authEnv = path.join(rootDir, 'auth-service', `.env.${env}`);
const userEnv = path.join(rootDir, 'user-service', `.env.${env}`);

if (!fs.existsSync(authEnv)) {
  console.error(`\nERROR: auth-service/.env.${env} not found!`);
  process.exit(1);
}
if (!fs.existsSync(userEnv)) {
  console.error(`\nERROR: user-service/.env.${env} not found!`);
  process.exit(1);
}

// Step 4: Start all services
console.log('--- Starting Services ---\n');

const command = (env === 'live') 
  ? `node dist/main`
  : `npx nodemon`;

const child = spawn(
  'npx',
  [
    'concurrently',
    '--names', 'AUTH,USER,FRONTEND',
    '--prefix-colors', 'blue,green,yellow',
    `"cd auth-service && set NODE_ENV=${env}&& ${command}"`,
    `"cd user-service && set NODE_ENV=${env}&& ${command}"`,
    '"cd frontend-angularjs && npx http-server . -p 4200 -c-1"',
  ],
  { cwd: rootDir, stdio: 'inherit', shell: true }
);
child.on('exit', (code) => process.exit(code));

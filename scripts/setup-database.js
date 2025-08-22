#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up database for Navigation App...\n')

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!')
  console.log('Please copy .env.example to .env and configure your database settings.')
  console.log('Example:')
  console.log('  cp .env.example .env')
  console.log('  # Edit .env with your MySQL connection details')
  process.exit(1)
}

try {
  // Check if Prisma is installed
  console.log('📦 Checking dependencies...')
  execSync('npx prisma --version', { stdio: 'ignore' })
  
  // Generate Prisma Client
  console.log('🔧 Generating Prisma Client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Push database schema
  console.log('🗄️  Pushing database schema...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  
  // Create upload directories
  console.log('📁 Creating upload directories...')
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'icons')
  fs.mkdirSync(uploadDir, { recursive: true })
  
  console.log('\n✅ Database setup completed successfully!')
  console.log('\n📋 Next steps:')
  console.log('  1. Start the development server: npm run dev')
  console.log('  2. Open http://localhost:3000 in your browser')
  console.log('  3. Use the admin password from your .env file to manage websites')
  
} catch (error) {
  console.error('\n❌ Setup failed:', error.message)
  console.log('\n🔧 Troubleshooting:')
  console.log('  1. Make sure MySQL is running')
  console.log('  2. Verify your DATABASE_URL in .env is correct')
  console.log('  3. Ensure the database exists (create it if needed)')
  console.log('  4. Check database user permissions')
  process.exit(1)
}

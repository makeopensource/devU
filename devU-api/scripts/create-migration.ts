import { exec } from 'child_process'

// Get the migration name from command line arguments
const migrationName = process.argv[2]

if (!migrationName) {
  console.error('Migration name is required!')
  console.error('Usage: npm run create-mig MigrationName')
  process.exit(1)
}

const command = `npm run typeorm -- migration:generate -d src/database.ts src/migration/${migrationName}`
console.log(`Executing: ${command}`)

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (stdout) console.log(stdout)
  if (stderr) console.error(stderr)

  if (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }

  console.log('Migration file created successfully!')
})

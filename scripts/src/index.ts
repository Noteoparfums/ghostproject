const command = process.argv[2] ?? 'migrate';

const modules: Record<string, string> = {
  migrate: './migrate.js',
  'migrate:status': './migrate-status.js',
  seed: './seed.js',
  reset: './db-reset.js',
};

const modulePath = modules[command];
if (!modulePath) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

await import(modulePath);

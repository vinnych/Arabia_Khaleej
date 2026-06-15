import * as fs from 'fs';
import * as path from 'path';

// Load environment variables before dynamic imports
try {
  const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)="(.*)"$/) || line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].replace(/\r$/, '');
    }
  });
} catch (err) {
  console.warn('Could not read .env.local file. Relying on system environment variables.');
}

async function cleanList(lang: 'en' | 'ar') {
  // Why dynamic import: Environment variables must be parsed and loaded into process.env 
  // before the Redis module resolves its configuration, otherwise it defaults to memory backend.
  const { getWithCompression, setWithCompression } = await import('../lib/database/redis');

  const listKey = `insights:list:${lang}`;
  const draftsKey = `insights:drafts:${lang}`;
  for (const key of [listKey, draftsKey]) {
    console.log(`Cleaning ${key}...`);
    const currentList = await getWithCompression<any[]>(key);
    if (!currentList || !Array.isArray(currentList)) {
      console.log(`No items found in ${key}`);
      continue;
    }
    console.log(`Found ${currentList.length} items in ${key}.`);
    const cleanedList = currentList.map(item => {
      delete item.content;
      return item;
    });
    // Why no TTL: Cleaned published and draft feeds are saved without an expiration to prevent automated eviction
    await setWithCompression(key, cleanedList);
    console.log(`Cleaned and saved ${key}`);
  }
}

async function run() {
  await cleanList('en');
  await cleanList('ar');
  console.log('Cleanup complete.');
  process.exit(0);
}

run().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});

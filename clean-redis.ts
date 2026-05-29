import * as fs from 'fs';
import * as path from 'path';

const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="(.*)"$/) || line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1]] = match[2].replace(/\r$/, '');
  }
});

// Important: import redis *after* environment variables are set
const { redis, getWithCompression, setWithCompression } = require('./lib/redis.ts');

async function cleanList(lang: 'en' | 'ar') {
  const listKey = `insights:list:${lang}`;
  const draftsKey = `insights:drafts:${lang}`;
  for (const key of [listKey, draftsKey]) {
    console.log(`Cleaning ${key}...`);
    const currentList = await getWithCompression(key);
    if (!currentList || !Array.isArray(currentList)) {
      console.log(`No items found in ${key}`);
      continue;
    }
    console.log(`Found ${currentList.length} items in ${key}.`);
    const cleanedList = currentList.map(item => {
      delete item.content;
      return item;
    });
    await setWithCompression(key, cleanedList, { ex: 2592000 });
    console.log(`Cleaned and saved ${key}`);
  }
}

async function run() {
  await cleanList('en');
  await cleanList('ar');
  console.log('Cleanup complete.');
  process.exit(0);
}

run();

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Why load environment variables first:
// Standalone or Upstash Redis modules require process.env bindings (like UPSTASH_REDIS_REST_URL)
// to be initialized before module compilation, otherwise they default to local memory clients.
try {
  const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)="(.*)"$/) || line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].replace(/\r$/, '');
    }
  });
  console.log('[setup] Successfully loaded environment variables from .env.local');
} catch (err) {
  console.warn('[setup] Could not read .env.local file. Relying on system environment variables.');
}

async function run() {
  const isRemote = process.argv.includes('--remote');
  const remoteFlag = isRemote ? '--remote' : '--local';

  console.log(`\n🧹 Starting complete article purge (${isRemote ? 'PRODUCTION REMOTE' : 'LOCAL DEVELOPER'} D1 & REDIS)...`);

  // 1. Wipe D1 SQLite tables
  try {
    console.log(`[D1] Executing SQL purges on D1 via wrangler (${remoteFlag})...`);
    execSync(`npx wrangler d1 execute arabiakhaleej-db ${remoteFlag} --command "DELETE FROM articles;"`, { stdio: 'inherit' });
    execSync(`npx wrangler d1 execute arabiakhaleej-db ${remoteFlag} --command "DELETE FROM drafts;"`, { stdio: 'inherit' });
    console.log('[D1] Successfully wiped all records from D1 SQLite database tables.');
  } catch (err: any) {
    console.error('[D1] Purge failed. Make sure wrangler is installed and you are logged in:', err.message || err);
  }

  // 2. Wipe Redis cache keys
  try {
    console.log('[Redis] Connecting to cache layer...');
    // Why dynamic import: Enforces env load completion before Redis instantiates connection endpoints
    const { redis } = await import('../lib/database/redis');

    const feedKeys = [
      'insights:list:en',
      'insights:list:ar',
      'insights:drafts:en',
      'insights:drafts:ar',
      'lock:insights:list'
    ];

    console.log('[Redis] Purging main index feed keys...');
    for (const key of feedKeys) {
      const deleted = await redis.del(key);
      if (deleted) {
        console.log(`[Redis] -> Deleted list index: "${key}"`);
      }
    }

    console.log('[Redis] Querying and purging individual serialized article cache entries...');
    // Fetch all keys from Redis cache and clear both drafts (article:*) and live details (insights:article:*)
    const keys = await redis.keys('*');
    const targetKeys = keys.filter(k => k.startsWith('insights:article:') || k.startsWith('article:'));

    if (targetKeys.length > 0) {
      console.log(`[Redis] Found ${targetKeys.length} article-related cache entries. Deleting...`);
      for (const key of targetKeys) {
        await redis.del(key);
      }
      console.log('[Redis] Successfully purged all serialized article cache keys.');
    } else {
      console.log('[Redis] No serialized article or draft keys found in cache.');
    }

  } catch (err: any) {
    console.error('[Redis] Cache cleanup failed:', err.message || err);
  }

  console.log('\n✨ Purge execution completed successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error('Reset execution failed:', err);
  process.exit(1);
});

import * as fs from 'fs';
import * as path from 'path';

// Why load environment variables first:
// We need the CRON_SECRET and NEXT_PUBLIC_SITE_URL to authenticate and locate the endpoint.
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arabiakhaleej.com';
const CRON_SECRET = process.env.CRON_SECRET;
const GENERATE_URL = `${SITE_URL}/api/cron/generate`;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  if (!CRON_SECRET) {
    console.error('[error] CRON_SECRET is not set in environment or .env.local file.');
    process.exit(1);
  }

  const count = 50;
  const delayMs = 20000; // 20 seconds delay between triggers

  console.log(`\n🚀 Starting Bulk Post Generation...`);
  console.log(`Target: ${GENERATE_URL}`);
  console.log(`Total Posts to Trigger: ${count}`);
  console.log(`Delay between triggers: ${delayMs / 1000}s (to prevent API rate limits & allow DB deduplication)\n`);

  for (let i = 1; i <= count; i++) {
    console.log(`[${i}/${count}] Sending generation request...`);
    try {
      const startTime = Date.now();
      const res = await fetch(GENERATE_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CRON_SECRET}`,
          'User-Agent': 'ArabiaKhaleej-BulkGenerator/1.0',
        },
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      if (!res.ok) {
        console.error(`[${i}/${count}] Failed. HTTP Status: ${res.status}. Response: ${await res.text()}`);
      } else {
        const body = await res.json().catch(() => ({}));
        console.log(`[${i}/${count}] Success! (took ${duration}s)`);
        console.log(`    Topic: "${body.topic || 'Unknown'}"`);
      }
    } catch (err: any) {
      console.error(`[${i}/${count}] Fetch failed:`, err.message || err);
    }

    if (i < count) {
      console.log(`⏳ Waiting ${delayMs / 1000}s before next request...`);
      await delay(delayMs);
    }
  }

  console.log('\n✨ Bulk post generation trigger run complete.');
  process.exit(0);
}

run().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});

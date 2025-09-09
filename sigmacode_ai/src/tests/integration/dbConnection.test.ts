import { MongoClient } from 'mongodb';
import { createClient } from 'redis';
import { MeiliSearch } from 'meilisearch';
import { describe, test, expect } from '@jest/globals';

describe('Database Connection Tests', () => {
  test('MongoDB connection', async () => {
    const client = new MongoClient(process.env.MONGODB_URI!);
    try {
      await client.connect();
      expect(client.db().databaseName).toBeDefined();
    } finally {
      await client.close();
    }
  });

  test('Redis connection', async () => {
    const client = createClient({ url: process.env.REDIS_URL });
    try {
      await client.connect();
      expect(await client.ping()).toBe('PONG');
    } finally {
      await client.disconnect();
    }
  });

  test('MeiliSearch connection', async () => {
    const client = new MeiliSearch({
      host: process.env.MEILI_HOST!,
      apiKey: process.env.MEILI_MASTER_KEY!
    });
    const health = await client.health();
    expect(health.status).toBe('available');
  });
});

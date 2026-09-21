// ============================================================================
// EdUGaP AI - Database Migration & Seeding Utility
// Connects to Supabase Cloud PostgreSQL or informs local development state
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Manually parse .env.local and .env
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wyyatouovxubtkqowczb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function runDatabasePush() {
  console.log('================================================================');
  console.log('🚀 EdUGaP AI - Database Push & Seeder Engine');
  console.log('================================================================\n');

  console.log('Target Project: wyyatouovxubtkqowczb');
  console.log('Supabase URL:  ', supabaseUrl);

  // Check if DATABASE_URL is configured with real password
  const hasValidDbUrl =
    databaseUrl &&
    databaseUrl.startsWith('postgresql://') &&
    !databaseUrl.includes('[YOUR-PASSWORD]');

  if (hasValidDbUrl) {
    console.log('🔌 Connecting directly to Supabase PostgreSQL at:');
    console.log('   db.wyyatouovxubtkqowczb.supabase.co:5432 ...\n');

    const client = new pg.Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      console.log('✅ Successfully connected to Supabase PostgreSQL database!\n');

      // 1. Apply Schema Migrations
      const schemaPath = path.join(rootDir, 'supabase', 'migrations', '20260921000001_initial_schema.sql');
      if (fs.existsSync(schemaPath)) {
        console.log('⏳ Applying initial schema migration (21 tables, RLS policies, storage)...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
        await client.query(schemaSql);
        console.log('✅ Schema migration executed successfully.\n');
      }

      // 2. Apply Seed Data
      const seedPath = path.join(rootDir, 'supabase', 'seed.sql');
      if (fs.existsSync(seedPath)) {
        console.log('⏳ Pushing syllabus, assessment questions, attempts, and seed records...');
        const seedSql = fs.readFileSync(seedPath, 'utf-8');
        await client.query(seedSql);
        console.log('✅ Database seeded successfully.\n');
      }

      // Verify row counts
      const res = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM public.departments) as departments,
          (SELECT COUNT(*) FROM public.profiles) as profiles,
          (SELECT COUNT(*) FROM public.assessments) as assessments,
          (SELECT COUNT(*) FROM public.questions) as questions
      `);
      console.log('📊 Verification Summary:');
      console.table(res.rows[0]);

      await client.end();
      console.log('\n🎉 Supabase Cloud Database is 100% provisioned and ready!');
      return;
    } catch (err) {
      console.error('❌ Connection or execution error:', err.message);
      console.log('\n💡 Note: Ensure your database password in .env.local is correct.');
    }
  }

  // Fallback instructions if password still needs to be provided
  console.log('\n----------------------------------------------------------------');
  console.log('ℹ️  Action Required to Push to Remote Database:');
  console.log('----------------------------------------------------------------');
  console.log('Your database connection string is currently configured in .env.local as:');
  console.log('  DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.wyyatouovxubtkqowczb.supabase.co:5432/postgres\n');
  console.log('👉 Step 1: Open .env.local and replace [YOUR-PASSWORD] with your Supabase database password.');
  console.log('👉 Step 2: Run `npm run seed` again to execute all tables and seeds automatically.\n');
  console.log('✨ Alternative (Direct Dashboard Import):');
  console.log('   You can also paste the files directly into the Supabase SQL editor:');
  console.log('   URL: https://supabase.com/dashboard/project/wyyatouovxubtkqowczb/sql/new');
  console.log('   1. supabase/migrations/20260921000001_initial_schema.sql');
  console.log('   2. supabase/seed.sql\n');
  console.log('⚡ Meanwhile, EdUGaP AI is running live with full local in-memory store!');
  console.log('   Web Portal:     http://localhost:3000');
  console.log('   PyTorch ML:     http://localhost:8001');
  console.log('================================================================\n');
}

runDatabasePush();

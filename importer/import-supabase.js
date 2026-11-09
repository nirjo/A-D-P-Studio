/**
 * Supabase Product Catalog Importer & Sync Script
 * -----------------------------------------------
 * Upserts normalized t-shirt products and variations into Supabase (PostgreSQL).
 *
 * Supported Flags:
 *   --dry-run       Simulate without modifying database records
 *   --changed-only  Compare with existing database rows and only update modified items
 *   --limit=N       Only process the first N products
 *
 * Usage:
 *   node import-supabase.js [--dry-run] [--changed-only] [--limit=5]
 */

const fs = require('fs');
const path = require('path');

// Read environment variables from .env file
function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../aiel-studio-canvas/.env'),
    path.resolve(__dirname, '.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
      console.log(`[ENV] Loaded configurations from: ${envPath}`);
      return;
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[ERROR] Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

// Parse CLI flags
const args = process.argv.slice(2);
const IS_DRY_RUN = args.includes('--dry-run');
const CHANGED_ONLY = args.includes('--changed-only');
const limitArg = args.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

console.log('=====================================================');
console.log(' SUPABASE PRODUCT SYNC / IMPORTER');
console.log('=====================================================');
console.log(`- Supabase URL:  ${SUPABASE_URL}`);
console.log(`- Dry Run Mode:  ${IS_DRY_RUN ? 'YES (No DB writes)' : 'NO (Live DB writes)'}`);
console.log(`- Changed Only:  ${CHANGED_ONLY ? 'YES (Skip unchanged items)' : 'NO (Upsert all)'}`);
if (LIMIT !== Infinity) console.log(`- Product Limit: ${LIMIT}`);

/**
 * Direct PostgREST API client for reliable upserting
 */
async function postgrestRequest(endpoint, method = 'GET', body = null, extraHeaders = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...extraHeaders
  };

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    throw new Error(`PostgREST error HTTP ${res.status}: ${typeof data === 'object' ? JSON.stringify(data) : data}`);
  }

  return data;
}

async function main() {
  const jsonPath = path.join(__dirname, 'products.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`[ERROR] File not found: ${jsonPath}. Run "node extract.js" first!`);
    process.exit(1);
  }

  let products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if (LIMIT && LIMIT < products.length) {
    products = products.slice(0, LIMIT);
  }

  console.log(`\n[INFO] Loaded ${products.length} products to process.\n`);

  // Fetch existing products for changed-only comparison
  let existingMap = new Map();
  try {
    const existing = await postgrestRequest('products?select=id,slug,name,price,is_sold_out,updated_at');
    if (Array.isArray(existing)) {
      existing.forEach(p => existingMap.set(p.slug, p));
      console.log(`[INFO] Found ${existingMap.size} existing products in Supabase.`);
    }
  } catch (err) {
    console.warn(`[WARN] Could not fetch existing products for diff check: ${err.message}`);
  }

  let stats = {
    total: products.length,
    upserted: 0,
    skipped: 0,
    errors: 0,
    variantsUpserted: 0
  };

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const prefix = `[${i + 1}/${products.length}]`;

    // Check if changed-only is active
    if (CHANGED_ONLY && existingMap.has(p.slug)) {
      const ex = existingMap.get(p.slug);
      const isPriceSame = Number(ex.price) === Number(p.price);
      const isStockSame = Boolean(ex.is_sold_out) === Boolean(p.is_sold_out);
      const isNameSame = ex.name === p.name;

      if (isPriceSame && isStockSame && isNameSame) {
        console.log(`${prefix} [SKIP] "${p.name}" (Slug: ${p.slug}) has no changes.`);
        stats.skipped++;
        continue;
      }
    }

    // Prepare Supabase row payload matching schema.sql
    const productPayload = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      category_label: p.category_label,
      price: p.price,
      original_price: p.original_price,
      badge: p.badge || null,
      is_sold_out: p.is_sold_out,
      image: p.image,
      gallery: p.gallery,
      description: p.description,
      sizes: p.sizes,
      colors: p.colors,
      print_types: p.print_types,
      bulk_pricing: p.bulk_pricing,
      min_order: p.min_order,
      turnaround: p.turnaround,
      rating: p.rating,
      reviews_count: p.reviews_count,
      updated_at: new Date().toISOString()
    };

    if (IS_DRY_RUN) {
      console.log(`${prefix} [DRY-RUN] Would upsert product "${p.name}" (Slug: ${p.slug}, ₹${p.price}, MOQ: ${p.min_order})`);
      stats.upserted++;
      stats.variantsUpserted += (p.variations || []).length;
      continue;
    }

    try {
      // Upsert product by slug
      await postgrestRequest(
        'products?on_conflict=slug',
        'POST',
        productPayload,
        { 'Prefer': 'resolution=merge-duplicates,return=representation' }
      );

      console.log(`${prefix} [OK] Upserted product: "${p.name}" (Slug: ${p.slug}, ₹${p.price})`);
      stats.upserted++;

      // Upsert variants if table exists
      if (Array.isArray(p.variations) && p.variations.length > 0) {
        const variantPayloads = p.variations.map(v => ({
          product_id: p.id,
          sku: v.sku,
          size: v.size,
          color_name: v.color_name,
          color_hex: v.color_hex,
          print_type: v.print_type,
          additional_price: v.additional_price || 0,
          stock_quantity: v.stock_quantity || 100,
          is_available: v.is_available,
          updated_at: new Date().toISOString()
        }));

        try {
          await postgrestRequest(
            'variants?on_conflict=sku',
            'POST',
            variantPayloads,
            { 'Prefer': 'resolution=merge-duplicates' }
          );
          stats.variantsUpserted += variantPayloads.length;
        } catch (vErr) {
          // If variants table has different constraints, log warning without breaking product import
          console.warn(`  [WARN] Variant upsert for ${p.slug}: ${vErr.message}`);
        }
      }
    } catch (err) {
      console.error(`${prefix} [ERROR] Failed to upsert product ${p.slug}: ${err.message}`);
      stats.errors++;
    }
  }

  console.log('\n=====================================================');
  console.log(' SYNC SUMMARY REPORT');
  console.log('=====================================================');
  console.log(`Total Products:     ${stats.total}`);
  console.log(`Upserted:           ${stats.upserted}`);
  console.log(`Skipped (Unchanged):${stats.skipped}`);
  console.log(`Errors:             ${stats.errors}`);
  console.log(`Variants Upserted:  ${stats.variantsUpserted}`);
  console.log('=====================================================\n');
}

main().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});

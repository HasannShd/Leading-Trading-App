import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const envPath = resolve(root, '.env');
const baseUrl = (process.env.QA_BASE_URL || 'https://www.lte-bh.com').replace(/\/+$/, '');

const readEnvApiUrl = async () => {
  try {
    const env = await readFile(envPath, 'utf8');
    const match = env
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line.startsWith('VITE_API_URL='));
    return match ? match.slice('VITE_API_URL='.length).trim() : '';
  } catch {
    return '';
  }
};

const check = async (label, url, expectedStatus = 200, redirect = 'follow') => {
  const response = await fetch(url, { redirect });
  const ok = response.status === expectedStatus;
  console.log(`${ok ? 'ok' : 'fail'} ${label}: ${response.status} ${response.url}`);
  if (!ok) {
    throw new Error(`${label} returned ${response.status}, expected ${expectedStatus}`);
  }
};

const checkJson = async (label, url, validate) => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`${label} returned ${response.status}`);
  }
  const data = await response.json();
  if (!validate(data)) {
    throw new Error(`${label} returned an unexpected payload`);
  }
  console.log(`ok ${label}: ${url}`);
};

const main = async () => {
  const apiUrl = (process.env.VITE_API_URL || await readEnvApiUrl()).replace(/\/+$/, '');

  await check('home', `${baseUrl}/`);
  await check('shop', `${baseUrl}/shop`);
  await check('contact quote params', `${baseUrl}/contact?source=product&product=test&productName=Smoke%20Test&sku=LTE-SMOKE`);
  await check('category route', `${baseUrl}/categories/medical-equipment`);
  await check('legacy products redirect', `${baseUrl}/products`, 301, 'manual');

  if (apiUrl) {
    await checkJson('categories api', `${apiUrl}/categories`, (data) => Array.isArray(data) && data.length > 0);
    await checkJson('products api includes descriptions', `${apiUrl}/products?limit=3`, (data) => {
      const items = Array.isArray(data) ? data : data.items || [];
      return items.length > 0 && Object.prototype.hasOwnProperty.call(items[0], 'description');
    });
  }
};

main().catch((error) => {
  console.error(`Smoke QA failed: ${error.message}`);
  process.exit(1);
});

/**
 * TEST DE CHARGE — APRÈS OPTIMISATION
 *
 * Deux scénarios en parallèle :
 *   1. products  → GET /api/products         (PUBLIC  — doit retourner X-Cache: HIT)
 *   2. me        → GET /api/me               (PRIVATE — doit retourner X-Cache: PASS)
 *
 * Objectif :
 *   - Prouver que le cache réduit la charge CPU (Flamegraph Pyroscope)
 *   - Démontrer la distinction Public HIT vs Private PASS (étape 9 du projet)
 *
 * Exécution k6 Cloud :
 *   k6 cloud k6/after-optimisation.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const responsTimeProducts = new Trend('products_response_ms', true);
const responseTimeMe      = new Trend('me_response_ms',       true);
const errorRate           = new Rate('error_rate');
const cacheHits           = new Counter('cache_hits');
const cacheMisses         = new Counter('cache_misses');

const BASE_URL = __ENV.BASE_URL || 'https://eco-conception.vercel.app';

export const options = {
  scenarios: {
    // Scénario 1 : route publique → doit HIT le cache
    products: {
      executor:    'ramping-vus',
      startVUs:    0,
      stages: [
        { duration: '30s', target: 15 },
        { duration: '1m',  target: 30 },
        { duration: '20s', target: 0  },
      ],
      exec: 'testProducts',
    },
    // Scénario 2 : route privée → doit toujours MISS/PASS
    me: {
      executor:    'constant-vus',
      vus:         5,
      duration:    '2m',
      exec:        'testMe',
    },
  },
  thresholds: {
    products_response_ms: ['p(95)<800'],  // après cache : bien plus rapide
    me_response_ms:       ['p(95)<500'],
    error_rate:           ['rate<0.02'],
  },
};

// Scénario 1 — Route PUBLIQUE (catalogue produits)
export function testProducts() {
  const res = http.get(`${BASE_URL}/api/products`);

  const ok = check(res, {
    'status 200':  (r) => r.status === 200,
    'has X-Cache': (r) => ['HIT', 'MISS'].includes(r.headers['X-Cache'] ?? ''),
  });

  if (res.headers['X-Cache'] === 'HIT')  cacheHits.add(1);
  if (res.headers['X-Cache'] === 'MISS') cacheMisses.add(1);

  responsTimeProducts.add(res.timings.duration);
  errorRate.add(!ok);

  sleep(0.5);
}

// Scénario 2 — Route PRIVÉE (données utilisateur)
export function testMe() {
  const res = http.get(`${BASE_URL}/api/me`);

  const ok = check(res, {
    'status 200':       (r) => r.status === 200,
    'cache PASS/MISS':  (r) => ['PASS', 'MISS'].includes(r.headers['X-Cache'] ?? ''),
    'no-store header':  (r) => (r.headers['Cache-Control'] ?? '').includes('no-store'),
  });

  responseTimeMe.add(res.timings.duration);
  errorRate.add(!ok);

  sleep(1);
}

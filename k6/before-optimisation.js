/**
 * TEST DE CHARGE — AVANT OPTIMISATION
 *
 * Cible : GET /api/products?expensive=1&count=10000
 * Cette route effectue un tri O(n log n) + calcul CPU à chaque requête,
 * sans passer par le cache. Elle simule la version non optimisée.
 *
 * Objectif : établir la baseline CPU/mémoire pour la comparaison Avant/Après
 * dans Grafana Pyroscope (Flamegraph).
 *
 * Exécution k6 Cloud :
 *   k6 cloud k6/before-optimisation.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const responseTime = new Trend('response_time_ms', true);
const errorRate    = new Rate('error_rate');

// ⚠️ Remplace par ton URL Vercel déployée
const BASE_URL = __ENV.BASE_URL || 'https://eco-conception.vercel.app';

export const options = {
  // Scénario : montée progressive, plateau, descente
  stages: [
    { duration: '30s', target: 10 },  // montée à 10 VU
    { duration: '1m',  target: 20 },  // plateau 20 VU (charge réelle)
    { duration: '20s', target: 0  },  // descente
  ],
  thresholds: {
    response_time_ms: ['p(95)<5000'], // 95% des réponses < 5s
    error_rate:       ['rate<0.05'],  // moins de 5% d'erreurs
  },
};

export default function () {
  // Route coûteuse : calcul CPU lourd, PAS de cache
  const res = http.get(`${BASE_URL}/api/products?expensive=1&count=10000`);

  const ok = check(res, {
    'status 200':     (r) => r.status === 200,
    'cache BYPASS':   (r) => r.headers['X-Cache'] === 'BYPASS',
  });

  responseTime.add(res.timings.duration);
  errorRate.add(!ok);

  sleep(1);
}

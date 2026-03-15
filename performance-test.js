import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  // Configuración de la prueba de carga
  vus: 10,          // 10 usuarios virtuales al mismo tiempo
  duration: '10s',  // La prueba durará 10 segundos
  thresholds: {
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones deben durar menos de 500ms
  },
};

export default function () {
  // K6 le pegará a tu IP pública para probar el rendimiento
  const res = http.get('http://35.226.72.47/'); 
  
  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo de respuesta aceptable': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}

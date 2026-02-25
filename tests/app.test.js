const request = require('supertest');
const app = require('../app');
const { calculateValue } = require('../lib/logic');

describe('Suite de Pruebas de Calidad de Software', () => {
  describe('Pruebas Unitarias - Lógica de Inventario', () => {
    test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
      const result = calculateValue(10, 5);
      expect(result).toBe(50);
    });

    test('Debe retornar 0 si se ingresan valores negativos', () => {
      const result = calculateValue(-10, 5);
      expect(result).toBe(0);
    });

    // VALIDACIÓN ADICIONAL 1: Valores cero
    test('Debe calcular correctamente con valores cero (0 * 5 = 0)', () => {
      const result = calculateValue(0, 5);
      expect(result).toBe(0);
    });

    // VALIDACIÓN ADICIONAL 2: Valores grandes
    test('Debe calcular correctamente con valores grandes (100 * 100 = 10000)', () => {
      const result = calculateValue(100, 100);
      expect(result).toBe(10000);
    });
  });

  describe('Pruebas de Integración - API Endpoints', () => {
    test('GET /health - Debe responder con status 200 y JSON correcto', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });

    test('GET /items - Debe validar la estructura del inventario', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('stock');
    });

    // VALIDACIÓN ADICIONAL 3: Validar propiedad uptime en health
    test('GET /health - Debe retornar la propiedad uptime (tiempo en línea)', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    // VALIDACIÓN ADICIONAL 4: Validar estructura completa de items
    test('GET /items - Debe validar que cada item contiene name, id y stock', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('stock');
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.stock).toBe('number');
      });
    });
  });
});

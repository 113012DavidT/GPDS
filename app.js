var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 1. IMPORTAR EL CLIENTE DE PROMETHEUS
const client = require('prom-client'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var itemsRouter = require('./routes/items');

var app = express();

// 2. CONFIGURAR MÉTRICAS POR DEFECTO (RAM, CPU del contenedor)
client.collectDefaultMetrics();

// 3. CREAR MÉTRICA PERSONALIZADA (Contador de peticiones)
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP procesadas',
  labelNames: ['metodo', 'ruta', 'estado_http'],
});

// Middleware para contar cada petición que entra
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      metodo: req.method,
      ruta: req.route ? req.route.path : req.path,
      estado_http: res.statusCode
    });
  });
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 4. RUTA CRÍTICA PARA PROMETHEUS
// Aquí es donde Prometheus "leerá" los datos cada 10 segundos
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

module.exports = app;

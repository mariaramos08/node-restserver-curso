// ================================
// PUERTO
// ================================
process.env.PORT = process.env.PORT || 3000

// ======================
// ENTORNO
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Vencimiento del Token
// ======================
// 60 minutos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

// ======================
// SEED de autenticacion
// ======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ======================
// BASE DE DATOS
// ======================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MOGO_URI;
}

// ======================
// Google Client ID
// ======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '513681126671-1m5ghkjt2e08ecd2kj55648dti5p4e8n.apps.googleusercontent.com';


process.env.URLDB = urlDB;
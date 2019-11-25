//==========================
// Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;

//==========================
// Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//==========================
// Vencimiento del TOKEN
//==========================
// 60 seg * 60 min * 24 hrs * 30 dias

process.env.CADUCIDAD_TOKEN = '48h';
//==========================
// Seed de autenticacion
//==========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==========================
// Base de datos
//==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==========================
// Google Client ID
//==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '34312866495-9ij20tsdcnp7c7r42mf74tnlminr61l3.apps.googleusercontent.com';
import express from 'express';
import IndexController from '../controllers/index.js';

const router = express.Router();
const indexController = new IndexController();

export function setRoutes(app) {
    app.use('/api', router);
    
    router.get('/', indexController.home);
    router.get('/data', indexController.getData);
    // Add more routes as needed
}
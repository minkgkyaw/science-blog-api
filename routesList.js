import listEndpoints from 'express-list-routes';
import consola from 'consola'

import app from './src/app.js'

listEndpoints(app, {logger: console.info});


process.exit(0)
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');



const app = express();
const port = process.env.PORT || 3000;

// importa as rotas
const userRoutes = require('./routes/userRoutes')
const baseRoutes = require('./routes/baseRoutes')
const impostosRoutes = require('./routes/impostoRoutes')
const gestorFinancasRoute = require('./routes/gestor_financas_route');
const loginFixoEquipeTresRoutes = require('./routes/loginFixoEquipeTresRoutes');



app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', baseRoutes);
app.use('/users', userRoutes);
app.use('/imposto', impostosRoutes);
app.use('/gf', gestorFinancasRoute);
app.use('/loginFixoEquipeTres', loginFixoEquipeTresRoutes);



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Swagger em http://localhost:${port}/api-docs`);
});

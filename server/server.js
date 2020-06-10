const express = require('express');
const morgan = require('morgan');
const db_interaction = require('./db_interaction.js');
const {check, validationResult} = require('express-validator');

const PORT = 3001;

app = new express();
// Logger
app.use(morgan('tiny'));

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

// GET /api/vehicles
// Parameters: ?categories: set of categories to match, separated by |
//             ?brands: set of brands to match, separated by |
app.get('/api/vehicles', (req, res) => {
    db_interaction.getVehicles(req.query.categories, req.query.brands)
        .then((vehicles) => { res.json(vehicles); })
        .catch(() => { res.status(500).end(); });
});
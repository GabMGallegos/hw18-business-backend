const express = require('express');
const { requestDataApi } = require('../services/dataApiService');

const router = express.Router();

function parseNumber(value, fieldName) {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        const error = new Error(`${fieldName} must be a number`);
        error.statusCode = 400;
        throw error;
    }

    return parsedValue;
}

function validateCustomerBody(body, mode = 'create') {
    const data = {};

    if (mode === 'create' && (body.name === undefined || String(body.name).trim() === '')) {
        const error = new Error('Name is required');
        error.statusCode = 400;
        throw error;
    }

    if (body.name !== undefined) {
        data.name = String(body.name).trim();

        if (data.name === '') {
            const error = new Error('Name cannot be empty');
            error.statusCode = 400;
            throw error;
        }
    }

    if (body.id !== undefined && body.id !== null && body.id !== '') {
        data.id = parseNumber(body.id, 'Customer id');

        if (data.id < 0) {
            const error = new Error('Customer id cannot be negative');
            error.statusCode = 400;
            throw error;
        }
    }

    if (mode === 'create' && body.age === undefined) {
        const error = new Error('Age is required');
        error.statusCode = 400;
        throw error;
    }

    if (body.age !== undefined) {
        data.age = parseNumber(body.age, 'Age');

        if (data.age < 0) {
            const error = new Error('Age cannot be negative');
            error.statusCode = 400;
            throw error;
        }
    }

    if (mode === 'create' && body.moneySpent === undefined) {
        const error = new Error('Money spent is required');
        error.statusCode = 400;
        throw error;
    }

    if (body.moneySpent !== undefined) {
        data.moneySpent = parseNumber(body.moneySpent, 'Money spent');

        if (data.moneySpent < 0) {
            const error = new Error('Money spent cannot be negative');
            error.statusCode = 400;
            throw error;
        }
    }

    if (mode === 'update' && Object.keys(data).length === 0) {
        const error = new Error('At least one field is required to update a customer');
        error.statusCode = 400;
        throw error;
    }

    return data;
}

router.get('/health', async (req, res, next) => {
    try {
        const dataBackendHealth = await requestDataApi('/health');

        res.json({
            service: 'hw18-business-backend',
            status: 'running',
            dataBackend: dataBackendHealth
        });
    } catch (error) {
        next(error);
    }
});

router.get('/customers', async (req, res, next) => {
    try {
        res.json(await requestDataApi('/customers'));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/name', async (req, res, next) => {
    try {
        res.json(await requestDataApi('/customers/name-fields'));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/age', async (req, res, next) => {
    try {
        res.json(await requestDataApi('/customers/age-fields'));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/money-spent', async (req, res, next) => {
    try {
        res.json(await requestDataApi('/customers/money-spent-fields'));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/money-spent/total', async (req, res, next) => {
    try {
        res.json(await requestDataApi('/customers/money-spent/total'));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/count', async (req, res, next) => {
    try {
        res.json(await requestDataApi('/customers/count'));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/summary', async (req, res, next) => {
    try {
        res.json(await requestDataApi('/customers/summary'));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/name/:name', async (req, res, next) => {
    try {
        const encodedName = encodeURIComponent(req.params.name);
        res.json(await requestDataApi(`/customers/by-name/${encodedName}`));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/age/:age', async (req, res, next) => {
    try {
        parseNumber(req.params.age, 'Age');
        res.json(await requestDataApi(`/customers/by-age/${req.params.age}`));
    } catch (error) {
        next(error);
    }
});

router.get('/customers/money-spent/range/:min/:max', async (req, res, next) => {
    try {
        const min = parseNumber(req.params.min, 'Minimum money spent');
        const max = parseNumber(req.params.max, 'Maximum money spent');

        if (min > max) {
            return res.status(400).json({
                message: 'Minimum money spent cannot be greater than maximum money spent'
            });
        }

        res.json(await requestDataApi(`/customers/by-money-spent-range/${min}/${max}`));
    } catch (error) {
        next(error);
    }
});

router.get('/customer/:id', async (req, res, next) => {
    try {
        const id = parseNumber(req.params.id, 'Customer id');
        res.json(await requestDataApi(`/customers/${id}`));
    } catch (error) {
        next(error);
    }
});

router.post('/customers', async (req, res, next) => {
    try {
        const customerData = validateCustomerBody(req.body, 'create');
        const createdCustomer = await requestDataApi('/customers', {
            method: 'POST',
            body: customerData
        });

        res.status(201).json(createdCustomer);
    } catch (error) {
        next(error);
    }
});

router.put('/customers/:id', async (req, res, next) => {
    try {
        const id = parseNumber(req.params.id, 'Customer id');
        const updateData = validateCustomerBody(req.body, 'update');
        const updatedCustomer = await requestDataApi(`/customers/${id}`, {
            method: 'PUT',
            body: updateData
        });

        res.json(updatedCustomer);
    } catch (error) {
        next(error);
    }
});

router.delete('/customers/:id', async (req, res, next) => {
    try {
        const id = parseNumber(req.params.id, 'Customer id');
        const result = await requestDataApi(`/customers/${id}`, {
            method: 'DELETE'
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

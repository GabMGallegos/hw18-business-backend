const express = require('express');
const { requestDataApi } = require('../services/dataApiService');
const { applyBusinessRule, calculateAdjustedTime } = require('../services/vinylBusinessService');

const router = express.Router();

function validateId(id) {
    const serialNumber = Number(id);

    if (!Number.isInteger(serialNumber) || serialNumber < 0) {
        const error = new Error('Invalid serial number');
        error.statusCode = 400;
        throw error;
    }

    return serialNumber;
}

function validateVinylBody(body) {
    if (!body.brand || !body.model) {
        const error = new Error('Brand and model are required');
        error.statusCode = 400;
        throw error;
    }

    if (body.time_record === undefined || body.qualitydisk === undefined) {
        const error = new Error('time_record and qualitydisk are required');
        error.statusCode = 400;
        throw error;
    }

    return {
        serial_number: body.serial_number !== undefined ? Number(body.serial_number) : undefined,
        brand: String(body.brand).trim(),
        model: String(body.model).trim(),
        time_record: Number(body.time_record),
        qualitydisk: Number(body.qualitydisk)
    };
}

router.get('/vinyls', async (req, res, next) => {
    try {
        const vinyls = await requestDataApi('/vinyls');
        res.json(vinyls);
    } catch (error) {
        next(error);
    }
});

router.post('/vinyls', async (req, res, next) => {
    try {
        const vinylData = validateVinylBody(req.body);

        const createdVinyl = await requestDataApi('/vinyls', {
            method: 'POST',
            body: vinylData
        });

        res.status(201).json(createdVinyl);
    } catch (error) {
        next(error);
    }
});

router.put('/vinyls/:id', async (req, res, next) => {
    try {
        const serialNumber = validateId(req.params.id);
        const vinylData = validateVinylBody(req.body);

        const updatedVinyl = await requestDataApi(`/vinyls/${serialNumber}`, {
            method: 'PUT',
            body: vinylData
        });

        res.json(updatedVinyl);
    } catch (error) {
        next(error);
    }
});

router.delete('/vinyls/:id', async (req, res, next) => {
    try {
        const serialNumber = validateId(req.params.id);

        const deletedVinyl = await requestDataApi(`/vinyls/${serialNumber}`, {
            method: 'DELETE'
        });

        res.json(deletedVinyl);
    } catch (error) {
        next(error);
    }
});

router.get('/vinyls/:id/business', async (req, res, next) => {
    try {
        const serialNumber = validateId(req.params.id);

        const vinyl = await requestDataApi(`/vinyls/${serialNumber}`);

        res.json({
            serial_number: vinyl.serial_number,
            time_record: vinyl.time_record,
            qualitydisk: vinyl.qualitydisk,
            adjusted_time_record: calculateAdjustedTime(vinyl),
            business_rule: 'time_record + (qualitydisk * 15)'
        });
    } catch (error) {
        next(error);
    }
});

router.get('/vinyls/:id', async (req, res, next) => {
    try {
        const serialNumber = validateId(req.params.id);

        const vinyl = await requestDataApi(`/vinyls/${serialNumber}`);

        const vinylWithBusinessRule = applyBusinessRule(vinyl);

        res.json(vinylWithBusinessRule);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
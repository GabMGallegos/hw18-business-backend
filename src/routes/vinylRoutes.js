const express = require('express');
const { requestDataApi } = require('../services/dataApiService');
const { calculateAdjustedTime, applyBusinessRule } = require('../services/vinylBusinessService');

const router = express.Router();

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
        const createdVinyl = await requestDataApi('/vinyls', {
            method: 'POST',
            body: req.body
        });

        res.status(201).json(createdVinyl);
    } catch (error) {
        next(error);
    }
});

router.put('/vinyls/:id', async (req, res, next) => {
    try {
        const updatedVinyl = await requestDataApi(`/vinyls/${req.params.id}`, {
            method: 'PUT',
            body: req.body
        });

        res.json(updatedVinyl);
    } catch (error) {
        next(error);
    }
});

router.delete('/vinyls/:id', async (req, res, next) => {
    try {
        const deletedVinyl = await requestDataApi(`/vinyls/${req.params.id}`, {
            method: 'DELETE'
        });

        res.json(deletedVinyl);
    } catch (error) {
        next(error);
    }
});

router.get('/vinyls/:id/business', async (req, res, next) => {
    try {
        const vinyl = await requestDataApi(`/vinyls/${req.params.id}`);

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
        const vinyl = await requestDataApi(`/vinyls/${req.params.id}`);
        const vinylWithBusinessRule = applyBusinessRule(vinyl);

        res.json(vinylWithBusinessRule);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
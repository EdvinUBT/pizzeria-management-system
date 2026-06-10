const auditLogsService = require('../services/auditLogsService');

const auditLogsController = {
    getAll: async (req, res) => {
        try {
            const { user_id, entity, action, from_date, to_date, page = 1, limit = 20 } = req.query;
            const filters = { user_id, entity, action, from_date, to_date };
            const result = await auditLogsService.getAll(filters, parseInt(page), parseInt(limit));
            res.json({ sukses: true, ...result });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const log = await auditLogsService.getById(req.params.id);
            res.json({ sukses: true, log });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    },

    getByEntity: async (req, res) => {
        try {
            const { entity, entityId } = req.params;
            const logs = await auditLogsService.getByEntity(entity, parseInt(entityId));
            res.json({ sukses: true, logs });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    },

    getByUserId: async (req, res) => {
        try {
            const logs = await auditLogsService.getByUserId(parseInt(req.params.userId));
            res.json({ sukses: true, logs });
        } catch (error) {
            res.status(error.status || 500).json({ sukses: false, mesazhi: error.message });
        }
    }
};

module.exports = auditLogsController;
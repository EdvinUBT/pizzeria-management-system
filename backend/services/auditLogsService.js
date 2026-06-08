const auditLogsRepository = require('../repositories/auditLogsRepository');

const auditLogsService = {
    createLog: async (logData) => {
        if (!logData.user_id || !logData.action || !logData.entity) {
            throw { status: 400, message: 'user_id, action dhe entity jane te detyrueshme' };
        }
        return await auditLogsRepository.create(logData);
    },

    getAll: async (filters, page, limit) => {
        return await auditLogsRepository.getAll(filters, page, limit);
    },

    getById: async (id) => {
        const log = await auditLogsRepository.getById(id);
        if (!log) throw { status: 404, message: 'Audit log nuk u gjet' };
        return log;
    },

    getByEntity: async (entity, entityId) => {
        return await auditLogsRepository.getByEntity(entity, entityId);
    },

    getByUserId: async (userId) => {
        return await auditLogsRepository.getByUserId(userId);
    }
};

module.exports = auditLogsService;
const AuditLog = require('../models/mongodb/AuditLog');

const auditLogsRepository = {
    create: async (logData) => {
        const log = new AuditLog(logData);
        return await log.save();
    },

    getAll: async (filters = {}, page = 1, limit = 20) => {
        const query = {};

        if (filters.user_id) query.user_id = filters.user_id;
        if (filters.entity) query.entity = filters.entity;
        if (filters.action) query.action = filters.action;

        if (filters.from_date || filters.to_date) {
            query.created_at = {};
            if (filters.from_date) query.created_at.$gte = new Date(filters.from_date);
            if (filters.to_date) query.created_at.$lte = new Date(filters.to_date);
        }

        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            AuditLog.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
            AuditLog.countDocuments(query)
        ]);

        return { logs, total, page, limit };
    },

    getById: async (id) => {
        return await AuditLog.findById(id);
    },

    getByEntity: async (entity, entityId) => {
        return await AuditLog.find({ entity, entity_id: entityId }).sort({ created_at: -1 });
    },

    getByUserId: async (userId) => {
        return await AuditLog.find({ user_id: userId }).sort({ created_at: -1 });
    }
};

module.exports = auditLogsRepository;
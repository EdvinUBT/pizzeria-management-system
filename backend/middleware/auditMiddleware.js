const auditLogsService = require('../services/auditLogsService');

const auditLog = (action, entity) => {
    return async (req, res, next) => {
        const originalJson = res.json.bind(res);

        res.json = async (data) => {
            try {
                if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                    await auditLogsService.createLog({
                        user_id: req.user.id,
                        action: action,
                        entity: entity,
                        entity_id: req.params.id || data?.id || null,
                        old_value: req.oldData || null,
                        new_value: req.body || null,
                        ip_address: req.ip || req.connection.remoteAddress
                    });
                }
            } catch (error) {
                console.error('Gabim ne audit log:', error.message);
            }

            return originalJson(data);
        };

        next();
    };
};

module.exports = auditLog;
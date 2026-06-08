const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entity_id: { type: Number, default: null },
    old_value: { type: mongoose.Schema.Types.Mixed, default: null },
    new_value: { type: mongoose.Schema.Types.Mixed, default: null },
    ip_address: { type: String, default: null },
    created_at: { type: Date, default: Date.now }
});

auditLogSchema.index({ user_id: 1 });
auditLogSchema.index({ entity: 1, entity_id: 1 });
auditLogSchema.index({ created_at: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
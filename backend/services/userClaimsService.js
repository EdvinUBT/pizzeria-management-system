const userClaimsRepository = require('../repositories/userClaimsRepository');

const userClaimsService = {
    getByUserId: async (userId) => {
        return await userClaimsRepository.getByUserId(userId);
    },

    create: async (data, userId) => {
        return await userClaimsRepository.create({
            user_id: data.user_id,
            claim_type: data.claim_type,
            claim_value: data.claim_value || null,
            created_by: userId
        });
    },

    update: async (id, data, userId) => {
        const claim = await userClaimsRepository.getById(id);
        if (!claim) {
            throw { status: 404, message: 'Claim nuk u gjet' };
        }

        return await userClaimsRepository.update(id, {
            claim_type: data.claim_type,
            claim_value: data.claim_value || null,
            updated_by: userId
        });
    },

    delete: async (id) => {
        const claim = await userClaimsRepository.getById(id);
        if (!claim) {
            throw { status: 404, message: 'Claim nuk u gjet' };
        }
        return await userClaimsRepository.delete(id);
    }
};

module.exports = userClaimsService;
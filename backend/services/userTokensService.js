const userTokensRepository = require('../repositories/userTokensRepository');

const userTokensService = {
    getByUserId: async (userId) => {
        return await userTokensRepository.getByUserId(userId);
    },

    create: async (data, userId) => {
        return await userTokensRepository.create({
            user_id: data.user_id,
            login_provider: data.login_provider,
            token_name: data.token_name,
            token_value: data.token_value,
            created_by: userId
        });
    },

    delete: async (id) => {
        const token = await userTokensRepository.getById(id);
        if (!token) {
            throw { status: 404, message: 'Tokeni nuk u gjet' };
        }
        return await userTokensRepository.delete(id);
    },

    deleteAllByUserId: async (userId) => {
        return await userTokensRepository.deleteAllByUserId(userId);
    }
};

module.exports = userTokensService;
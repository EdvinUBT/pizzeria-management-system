const userRolesRepository = require('../repositories/userRolesRepository');

const userRolesService = {
    getByUserId: async (userId) => {
        return await userRolesRepository.getByUserId(userId);
    },

    caktoRol: async (data, userId) => {
        const existing = await userRolesRepository.getByUserAndRole(data.user_id, data.role_id);
        if (existing) {
            throw { status: 400, message: 'Perdoruesi e ka tashme kete rol!' };
        }

        return await userRolesRepository.create({
            user_id: data.user_id,
            role_id: data.role_id,
            created_by: userId
        });
    },

    hiqRol: async (userId, roleId) => {
        const deleted = await userRolesRepository.delete(userId, roleId);
        if (!deleted) {
            throw { status: 404, message: 'Lidhja nuk u gjet' };
        }
        return deleted;
    }
};

module.exports = userRolesService;
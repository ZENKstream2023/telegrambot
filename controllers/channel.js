const Channel = require('../models/channel');

class ChannelController {
    // Método para agregar un canal
    async addChannel(CompanyId, Companyname, accessToken) {
        try {
            // Verifica si el canal ya existe en la base de datos
            const existingChannel = await Channel.findOne({ CompanyId });
            if (existingChannel) {
                throw new Error('El canal ya existe');
            }
            
            // Crea un nuevo canal en la base de datos
            const newChannel = new Channel({
                CompanyId,
                Companyname,
                accessToken
            });
            await newChannel.save();
            
            return newChannel;
        } catch (error) {
            throw error;
        }
    }

    // Método para actualizar un canal
    async updateChannel(CompanyId, accessToken) {
        try {
            // Busca el canal en la base de datos
            const channel = await Channel.findOne({ CompanyId });
            if (!channel) {
                throw new Error('El canal no existe');
            }

            // Actualiza el token de acceso
            channel.accessToken = accessToken;
            await channel.save();

            return channel;
        } catch (error) {
            throw error;
        }
    }

    // Método para eliminar un canal
    async deleteChannel(CompanyId) {
        try {
            // Busca y elimina el canal de la base de datos
            const channel = await Channel.findOneAndDelete({ CompanyId });
            if (!channel) {
                throw new Error('El canal no existe');
            }

            return channel;
        } catch (error) {
            throw error;
        }
    }

    // Método para obtener información de un canal por su ID de usuario de Twitch
    async getChannelByCompanyId(CompanyId) {
        try {
            // Busca el canal en la base de datos
            const channel = await Channel.findOne({ CompanyId });
            if (!channel) {
                throw new Error('El canal no existe');
            }

            return channel;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ChannelController;
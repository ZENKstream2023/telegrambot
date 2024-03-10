const express = require('express');
const router = express.Router();
const ChannelController = require('../controllers/channel');

// Instancia del controlador de canales
const channelController = new ChannelController();

// Ruta para agregar un canal
router.post('/channels', async (req, res) => {
    const { CompanyId, Companyname, accessToken } = req.body;
    try {
        const newChannel = await channelController.addChannel(CompanyId, Companyname, accessToken);
        res.json(newChannel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para actualizar un canal
router.put('/channels/:CompanyId', async (req, res) => {
    const { CompanyId } = req.params;
    const { accessToken } = req.body;
    try {
        const updatedChannel = await channelController.updateChannel(CompanyId, accessToken);
        res.json(updatedChannel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar un canal
router.delete('/channels/:CompanyId', async (req, res) => {
    const { CompanyId } = req.params;
    try {
        const deletedChannel = await channelController.deleteChannel(CompanyId);
        res.json(deletedChannel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener información de un canal por su ID de usuario de Twitch
router.get('/channels/:CompanyId', async (req, res) => {
    const { CompanyId } = req.params;
    try {
        const channel = await channelController.getChannelByCompanyId(CompanyId);
        res.json(channel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
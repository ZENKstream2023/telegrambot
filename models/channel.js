"use strict";
const mongoose = require('mongoose');
// Define el esquema del canal
const channelSchema = new mongoose.Schema({
    CompanyId: {
        type: String,
        required: true,
        unique: true
    },
    Companyname: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true
    },
    // Puedes agregar más campos según tus necesidades
});

// Define el modelo Channel
const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
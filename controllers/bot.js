"use strict";
// Importar la función promoteChatMember desde Telegraf
const { Telegraf,  promoteChatMember  } = require('telegraf');
const ChannelController = require('./channel');
require("dotenv").config();


// Definir constantes
const token = process.env.BOT_TOKEN
const telegramBotUsername = process.env.TELEGRAM_BOT_USERNAME;

////////////////
//   B  O  T   //
////////////////

// Reemplaza 'TOKEN' con el token de acceso proporcionado por BotFather
const bot = new Telegraf(token);

// Manejar el evento 'error' para enviar un mensaje de alerta en caso de un error inesperado
bot.catch((err, ctx) => {
    console.error('Ocurrió un error:', err);
    ctx.reply('¡Ups! Parece que hubo un problema inesperado en el servidor y debe reiniciarse!');
});

// Manejar el evento 'new_chat_members' para otorgar privilegios de administración
bot.on('new_chat_members', async (ctx) => {
    // Iterar sobre los nuevos miembros del grupo
    for (const member of ctx.message.new_chat_members) {
        try {
            // Otorgar privilegios de administración al nuevo miembro
            await promoteChatMember(ctx.chat.id, member.id, {
                can_change_info: true,
                can_delete_messages: true,
                can_invite_users: true,
                can_restrict_members: true,
                can_pin_messages: true,
                can_promote_members: false // Puedes ajustar esto según tus necesidades
            });
            // Saludar al nuevo miembro por su nombre
            ctx.reply(`¡Hola, ${member.first_name}! Bienvenido al grupo.`);
        } catch (error) {
            console.error('Error al otorgar privilegios de administración:', error);
            // Manejar el error adecuadamente
        }
    }
});

// Comando /start para iniciar una conversación con el bot de Telegram
bot.command('start', async (ctx) => {
    const telegramUrl = 'https://t.me/Twitch_Hispano/1'; 
    ctx.replyWithMarkdown(`¡Gracias por visitarme!\nSoy Hispi, deja que te guíe y adentrate en el portfolio.`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Entrar', url: telegramUrl }]
            ]
        }
    });
});
// Función para redireccionar al usuario a iniciar una conversación con el bot de Telegram
function redirectToTelegramBot() {
    const telegramUrl = `https://t.me/${telegramBotUsername}?start`;
    return telegramUrl;
}

// Instanciamos el controlador de empresas
const channelController = new ChannelController();

// Objeto para mantener el estado del proceso
const state = {};

// Comando /companyadd para agregar una empresa
bot.command('companyadd', async (ctx) => {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    // Establecer el estado inicial del proceso
    state[userId] = {
        step: 1, // Primer paso: solicitar CompanyId
        data: {} // Almacenar los datos de la empresa
    };

    // Preguntar por el CompanyId
    ctx.reply('Por favor, introduce el CompanyId:');
});

// Comando /companyupdate para actualizar una empresa
bot.command('companyupdate', async (ctx) => {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    // Establecer el estado inicial del proceso
    state[userId] = {
        command: 'update', // Comando que se está ejecutando
        data: {} // Almacenar los datos de la empresa
    };

    // Preguntar por el CompanyId
    ctx.reply('Por favor, introduce el CompanyId:');
});

// Comando /companydelete para eliminar una empresa
bot.command('companydelete', async (ctx) => {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    // Establecer el estado inicial del proceso
    state[userId] = {
        command: 'delete', // Comando que se está ejecutando
        data: {} // Almacenar los datos del canal
    };

    // Preguntar por el CompanyId
    ctx.reply('Por favor, introduce el CompanyId:');
});

// Comando /companyget para obtener información de una empresa
bot.command('companyget', async (ctx) => {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;

    // Establecer el estado inicial del proceso
    state[userId] = {
        command: 'get', // Comando que se está ejecutando
        data: {} // Almacenar los datos de la empresa
    };

    // Preguntar por el CompanyId
    ctx.reply('Por favor, introduce el CompanyId:');
});
// Objeto para mantener un registro de los moderadores activos
const moderadoresActivos = {};

// Comando /modon para activar a un moderador
bot.command('modon', async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username;
    // Obtener información del chat para obtener el ID del grupo
    const chatId = ctx.chat.id;
    const administrators = await ctx.telegram.getChatAdministrators(chatId);
    let owner;
    for (const admin of administrators) {
        if (admin.status === 'creator') {
            owner = admin.user;
            break;
        }
    }
    
    
    // Obtener la lista de miembros del grupo
    const chatMembers = await ctx.telegram.getChatAdministrators(chatId);
    // Iterar sobre los miembros del grupo para buscar el título personalizado del usuario actual
    const customTitle = chatMembers.find(member => member.user.id === userId)?.custom_title || 'Sin título personalizado';
    console.log(customTitle)
    // Verificar si el usuario es un moderador
    if (customTitle === "Mod" || customTitle === "Admin" || owner ) {
        // Agregar al moderador a la lista de moderadores activos
        moderadoresActivos[userId] = username;
        ctx.reply('¡Ahora estás en servicio como moderador!');
        console.log(ctx); // Imprimir el contexto de la actualización del mensaje recibido
    } else {
        ctx.reply('Lo siento, solo los moderadores pueden activarse como moderadores.');
    }
});

// Comando /modoff para desactivar a un moderador
bot.command('modoff', (ctx) => {
    const userId = ctx.from.id;

    // Verificar si el usuario es un moderador activo
    if (moderadoresActivos[userId]) {
        // Eliminar al moderador de la lista de moderadores activos
        delete moderadoresActivos[userId];
        ctx.reply('Has salido de servicio como moderador.');
    } else {
        ctx.reply('No estás en servicio como moderador en este momento.');
    }
});

// Comando /modstatus para verificar los moderadores activos
bot.command('modstatus', (ctx) => {
    const activeModerators = Object.values(moderadoresActivos);
    if (activeModerators.length > 0) {
        const moderatorsList = activeModerators.join(', ');
        ctx.reply(`Los moderadores activos en este momento son: ${moderatorsList}`);
    } else {
        ctx.reply('No hay moderadores activos en este momento.');
    }
});

// Lista de comandos disponibles
const commands = [
    { command: '/modon', description: 'Activar modo moderador' },
    { command: '/modoff', description: 'Desactivar modo moderador' },
    { command: '/modstatus', description: 'Ver moderadores activos' },
    { command: '/companyadd', description: 'Agregar un canal' },
    { command: '/companyupdate', description: 'Actualizar un canal' },
    { command: '/companyget', description: 'Listar Canales' },
    { command: '/companydelete', description: 'Eliminar un canal' },
    // Agrega aquí más comandos según sea necesario
];
// Comando /comandos para mostrar todos los comandos disponibles
bot.command('comandos', (ctx) => {
    const formattedCommands = commands.map(cmd => `${cmd.command}: ${cmd.description}`).join('\n');
    ctx.reply(`Comandos disponibles Moderadores:\n${formattedCommands}`);
});
bot.command('news', async (ctx) => {
    const userId = ctx.from.id;
    const isAdmin = userId === 6575753871; // ID del administrador, debes cambiarlo por el tuyo

    if (!isAdmin) {
        ctx.reply('No tienes permiso para ejecutar este comando.');
        return;
    }

    const messageText = ctx.message.text.split(' ').slice(1).join(' '); // Extrae el texto del mensaje después del comando
    if (!messageText) {
        ctx.reply('Por favor, proporciona un mensaje para enviar.');
        return;
    }

    // Envía el mensaje y elimina el comando
    ctx.reply(messageText)
        .then(() => {
            ctx.deleteMessage(ctx.message.message_id); // Elimina el comando enviado
        })
        .catch((error) => {
            console.error('Error al enviar el mensaje:', error);
            ctx.reply('Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
        });
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////// KEEP THE FOLLOWING LINES ALWAYS BELOW THE COMMANDS
// Manejador para mensajes de texto y solicitud de datos
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const userData = state[userId];

    if (!userData) {
        // Verificar si el mensaje es un comando
        const messageText = ctx.message.text.trim();
        if (!messageText.startsWith('/')) {
            // El mensaje no es un comando, eliminarlo
            const chatId = ctx.chat.id;
            ctx.telegram.deleteMessage(chatId, ctx.message.message_id);
            ctx.reply('El mensaje ha sido eliminado al no ser un comando valido. Por favor escribe /comandos');
            return;
        }
        return; // Ignorar mensajes de usuarios que no están en proceso
    }

    const messageText = ctx.message.text.trim();
    switch (userData.command) {
        case 'update': // Actualizar un canal
            if (!userData.data.CompanyId) {
                userData.data.CompanyId = messageText;
                ctx.reply('Por favor, introduce el accessToken del canal:');
            } else {
                userData.data.accessToken = messageText;
                try {
                    const updatedChannel = await channelController.updateChannel(userData.data.CompanyId, userData.data.accessToken);
                    ctx.reply(`Canal ${updatedChannel.Companyname} actualizado correctamente.`);
                } catch (error) {
                    ctx.reply('Ocurrió un error al actualizar el canal. Por favor, inténtalo de nuevo más tarde.');
                }
                delete state[userId]; // Eliminar el estado del usuario
            }
            break;
        case 'delete': // Eliminar un canal
            if (!userData.data.CompanyId) {
                userData.data.CompanyId = messageText;
                try {
                    const deletedChannel = await channelController.deleteChannel(userData.data.CompanyId);
                    ctx.reply(`Empresa:  ${deletedChannel.Companyname} eliminada correctamente.`);
                } catch (error) {
                    ctx.reply('Ocurrió un error al eliminar el canal. Por favor, inténtalo de nuevo más tarde.');
                }
                delete state[userId]; // Eliminar el estado del usuario
            }
            break;
        case 'get': // Obtener información de un canal
            if (!userData.data.CompanyId) {
                userData.data.CompanyId = messageText;
                try {
                    const channel = await channelController.getChannelByCompanyId(userData.data.CompanyId);
                    ctx.reply(`Información del canal:\nID de la empresa es: ${channel.CompanyId}\nNombre de la Empresa: ${channel.Companyname}`);
                } catch (error) {
                    ctx.reply('Ocurrió un error al obtener la información del canal. Por favor, inténtalo de nuevo más tarde.');
                }
                delete state[userId]; // Eliminar el estado del usuario
            }
            break;
    }
    switch (userData.step) {
        case 1: // Solicitar CompanyId
            userData.data.CompanyId = messageText;
            ctx.reply('Por favor, introduce el Companyname:');
            userData.step = 2; // Siguiente paso: solicitar Companyname
            break;
        case 2: // Solicitar Companyname
            userData.data.Companyname = messageText;
            ctx.reply('Por favor, introduce el accessToken:');
            userData.step = 3; // Siguiente paso: solicitar accessToken
            break;
        case 3: // Solicitar accessToken
            userData.data.accessToken = messageText;
            
            // Procesar la solicitud de agregar el canal
            try {
                const newChannel = await channelController.addChannel(userData.data.CompanyId, userData.data.Companyname, userData.data.accessToken);
                ctx.reply(`Canal ${newChannel.Companyname} agregado correctamente.`);
            } catch (error) {
                ctx.reply('Ocurrió un error al agregar el canal. Por favor, inténtalo de nuevo más tarde.');
            }

            // Eliminar el estado del usuario
            delete state[userId];
            break;
    }

});
// Iniciar el bot
bot.launch();

module.exports = {
    redirectToTelegramBot
};
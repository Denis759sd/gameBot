const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('options')
const token = "6491350795:AAGgdrKftyKl8fO8ffyd-msguryG_E_cqR8";

const bot = new TelegramApi(token, {polling: true});

const chats = [];

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты попробуй ее угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: 'start', description: 'Начальное приветсвие'},
        {command: 'info', description: 'Получить информацию о пользователе'},
        {command: 'game', description: 'Игра угадай цифру'},
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот автора Olltimist');
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(chats[chatId]);

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

start();


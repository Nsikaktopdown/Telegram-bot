const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');


//Constants
const token = '627583120:AAFaPIuF0a5D8gZ_eQPnW0p-SVfMI3mZErg';
const bot = new TelegramBot(token, {polling: true});

  // Init Firebase
const app = firebase.initializeApp({
    apiKey: "AIzaSyB_5qzOdMxOxibiejj0vKchHXUnqiuF9N8",
    authDomain: "trend-76131.firebaseapp.com",
    databaseURL: "https://trend-76131.firebaseio.com",
    projectId: "trend-76131",
    storageBucket: "trend-76131.appspot.com",
    messagingSenderId: "741060922086"
  });
  const ref = firebase.database().ref();
  const sitesRef = ref.child("sites");
  

let siteUrl;
bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Development',
          callback_data: 'development'
        },{
          text: 'Music',
          callback_data: 'music'
        },{
          text: 'Cute monkeys',
          callback_data: 'cute-monkeys'
        }
      ]]
    }
  });
});

bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;
    ogs({'url': siteUrl}, function (error, results) {
      if(results.success) {
        sitesRef.push().set({
          name: results.data.ogSiteName,
          title: results.data.ogTitle,
          description: results.data.ogDescription,
          url: siteUrl,
          thumbnail: results.data.ogImage.url,
          category: callbackQuery.data
        });
        bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!')
  } else {
        sitesRef.push().set({
          url: siteUrl
        });
        bot.sendMessage(message.chat.id,'Added new website, but there was no OG data!');
      }
    });
  });
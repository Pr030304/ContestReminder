
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');

// Initialize Discord Client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIST_API_KEY = process.env.CLIST_API_KEY;
const CLIST_USERNAME = process.env.CLIST_USERNAME;

let contests = [];

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Bot is ready to receive commands.');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.trim() === '!contests') {
        try {
            contests = await fetchContests();
            if (contests.length > 0) {
                let contestList = 'Upcoming Contests:\n';
                contests.forEach((contest, index) => {
                    contestList += `**${index + 1}**. Event: ${contest.event}\nHost: ${contest.host}\nURL: ${contest.href}\nStart: ${contest.start}\nEnd: ${contest.end}\n\n`;
                });
                contestList += 'Reply with the numbers of the contests you want to set reminders for, separated by commas (e.g., 1,3,5).';
                message.channel.send(contestList);
            } else {
                message.channel.send('No upcoming contests found.');
            }
        } catch (error) {
            console.error('Error fetching contests:', error);
            message.channel.send('Failed to fetch contests.');
        }
    } else if (message.content.trim().match(/^(\d+,)*\d+$/)) {
        const contestIndexes = message.content.trim().split(',').map(num => parseInt(num) - 1);
        let validIndexes = [];
        contestIndexes.forEach(index => {
            if (contests[index]) {
                validIndexes.push(index);
                setReminder(contests[index], message.channel);
            }
        });
        if (validIndexes.length > 0) {
            message.channel.send(`Reminders set for contests: ${validIndexes.map(index => contests[index].event).join(', ')}`);
        } else {
            message.channel.send('Invalid contest numbers.');
        }
    }
});

client.on('error', error => {
    console.error('Client Error:', error);
});

// Login to Discord
client.login(DISCORD_TOKEN).catch(error => {
    console.error('Login Error:', error);
    process.exit(1);
});

// Function to fetch contests from Clist API
async function fetchContests() {
    try {
        console.log('Fetching contests from Clist API...');
        const response = await axios.get('https://clist.by:443/api/v4/contest/', {
            headers: {
                'Authorization': `ApiKey ${CLIST_USERNAME}:${CLIST_API_KEY}`
            },
            params: {
                upcoming: true,
                order_by: 'start',
                limit: 10,
                format: 'json'
            }
        });
        const contests = response.data.objects;
        console.log('Fetched Contests:', contests);
        return contests;
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.status, error.response.statusText);
            console.error('Response Headers:', error.response.headers);
            console.error('Response Data:', error.response.data);
        } else if (error.request) {
            console.error('No Response:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        throw new Error('Failed to fetch contests');
    }
}

// Function to set a reminder
function setReminder(contest, channel) {
    const reminderTime = new Date(contest.start);
    reminderTime.setMinutes(reminderTime.getMinutes() - 30); // 30 minutes before the contest start

    // Schedule a reminder
    cron.schedule(`* * * * *`, () => {
        const now = new Date();
        if (Math.abs(now - reminderTime) < 60000) { // Check if it's close to the reminder time (within 1 minute)
            channel.send(`Reminder: The contest ${contest.event} hosted by ${contest.host} is starting in 30 minutes!\nURL: ${contest.href}`);
        }
    });
}

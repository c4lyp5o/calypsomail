const { ImapFlow } = require('imapflow');
const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: 993,
    auth: {
        user: process.env.IMAP_USER,
        pass: process.env.IMAP_PASS
    },
    logger: false
});
const redis = require('redis');
const redisClient = redis.createClient();
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const simpleParser = require('mailparser').simpleParser;

async function getMailandCache () {
    let messages = [];
    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    try {
        for await (let message of client.fetch('1:*', {uid: true, envelope: true, source: true})) {
            messages.push(message)  
        }        
    } finally {
        lock.release();
        await client.logout();
    }
    myCache.set('my-messages', messages, 6000000);
    console.log('done caching');
    return messages.reverse();
}

async function getMailandCacheRedis () {
    let messages = [];
    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    try {
        for await (let message of client.fetch('1:*', {uid: true, envelope: true, source: true})) {
            messages.push(message)  
        }        
    } finally {
        lock.release();
        await client.logout();
    }
    await redisClient.connect();
    await redisClient.json.set('my-messages', '.', messages.reverse());
    console.log('done caching');
    await redisClient.disconnect();
    return messages;
}

async function getMailCache () {
    let messages = [];
    messages = myCache.get('my-messages');
    console.log('done getting');
    return messages;
}

async function getMailRedis () {
    let messages = [];
    await redisClient.connect();
    messages = await redisClient.json.get('my-messages');
    console.log('done getting');
    await redisClient.disconnect();
    return messages;
}

async function get1MailCache (num) {
    let messages = [];
    messages = myCache.get('my-messages');
    const message = Buffer.from(messages[0].source, 'base64');
    console.log(message);
    simpleParser(message, (err, parsed) => {
        if (err) {
            console.log(err);
        } else {
            if (!parsed.html) {
                return parsed.textAsHtml;
            } else if (parsed.html) {
                return parsed.html;
            }
        }
    });
}

async function get1MailRedis (num) {
    await redisClient.connect();
    const messages = await redisClient.json.get('my-messages', { path: '.' });
    await redisClient.disconnect();
    const message = Buffer.from(messages[num].source.data, 'base64');
    let parsed = await simpleParser(message);
    return parsed;
}

module.exports = { getMailandCache, getMailandCacheRedis, getMailCache, getMailRedis, get1MailRedis, get1MailCache };
const { getMailandCacheRedis, getMailRedis, get1MailRedis } = require('./helper');

exports.thisIsHome = (req, res, next) => {
    res.render('login', { title: 'Express' });
}

exports.welcomeHome = (req, res, next) => {
    getMailandCacheRedis().then(messages => {
        res.render('index', { title: 'Express', messages: messages });
    });
}

exports.getMail = async (req, res, next) => {
    getMailRedis().then(messages => {
        res.render('index', { title: 'Express', messages: messages });
    });
}

exports.get1Mail = async (req, res, next) => {
    await get1MailRedis(req.params.id).then(parsed => {
        if (!parsed.html) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(parsed.textAsHtml);
        } else if (parsed.html) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(parsed.html);
        }
    });
    res.end();
}

exports.comeOnIn = async (req, res, next) => {
    // let messages = [];
    // let goodDates = [];
    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    // let messages = await client.fetch('1:*', { envelope: true, body: true });
    try {
        let message = await client.fetchOne(client.mailbox.exists, { source: true });
        console.log(message);
        simpleParser(message.source, (err, parsed) => {
            if (err) {
                console.log(err);
            }
            // console.log(parsed.html);
            // res.render('index', { title: 'Express', parsed: parsed.html });
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(parsed.html);
            res.end();
        });
        // uid value is always included in FETCH response, envelope strings are in unicode.
        // var i = 0;
        // await redisClient.connect();
        // for await (let message of client.fetch('1:10', {uid: true, envelope: true, source: true})) {
        //     await redisClient.json.set('my-messages', '.', message);
            // console.log(message);
            // i++;
            // messages.push(message);
            
            // goodDates.push(message.envelope.date.toLocaleDateString());
            // console.log(message);            
        // }
        // console.log(messages);
        // await redisClient.connect();
        // await redisClient.json.set('my-messages', '.', messages);
        // console.log('set in redis');
        // const redisVal = await redisClient.json.get('my-messages', { path: '.'});
        // console.log(redisVal);
        // await redisClient.disconnect();
        // let messages = await client.fetch('1:10', { envelope: true, body: true });
        // console.log(messages);
        // res.render('index', { title: 'Express', message: messages.envelope });
        // message.forEach(element => {
        //     res.write(`${message.uid}: ${message.envelope.subject}`)
        // });
        // console.log(Object.values(messages[0].from));
        // res.render('index', { title: 'Express', message: redisVal });
    } finally {
        lock.release();
        console.log('finally');
    }
    await client.logout();
    console.log('done');
}

exports.testingTheSidebars = (req, res, next) => {
    res.render('index', { title: 'Express' });
}

exports.fromRedis = async (req, res, next) => {
    let decoded = [];
    let htmlcode = [];
    await redisClient.connect();
    const redisVal = await redisClient.json.get('my-messages', { path: '.'});
    // console.log(redisVal.length);
    await redisClient.disconnect();
    const msg = redisVal.reverse();
    console.log(msg);
    console.log(msg.length);
    // msg.forEach(element => {
    //     decoded.push(Buffer.from(element.source.data, 'base64'));        
    // });
    // msg.forEach(element => {
    //     simpleParser(element, (err, parsed) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         htmlcode.push(parsed);
    //     });
    // });
    // console.log(htmlcode);
    // console.log(decoded);
    // let msg = redisVal[8].source.data;
    // console.log(msg.source);
    // simpleParser(msg.source, (err, parsed) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(parsed.html);
    //     }
    // });
    // console.log(x.html);
    // console.log(redisVal.reverse());
    res.render('index', { title: 'Express', message: msg });
}

exports.saveData = async (req, res, next) => {
    let messages = [];
    await client.connect();
    await redisClient.connect();
    let lock = await client.getMailboxLock('INBOX');
    try {
        for await (let message of client.fetch('150:160', {uid: true, envelope: true, source: true})) {
            await redisClient.set('my-messages', '.', message);    
        }        
        // await redisClient.json.set('my-messages', '.', messages);
        // await redisClient.set('my-messages', '.', messages);
        // const redisVal = await redisClient.json.get('my-messages', { path: '.'});
        const redisVal = await redisClient.get('my-messages', { path: '.'});
        console.log(redisVal);
        res.render('index', { title: 'Express', message: redisVal });
    } finally {
        lock.release();
    }
    await redisClient.disconnect();
    await client.logout();
}

exports.useRedis = async (req, res, next) => {
    try {
        await redisClient.connect();
        const redisVal = await redisClient.get('my-messages', { path: '.'});
        console.log(redisVal);
        // const message = Buffer.from(redisVal[8].source.data, 'base64').toString('utf-8');
        // console.log(message);
        // const sex = message.search("Content-Type: text/html");
        // console.log(sex);
        // console.log(message.length);
        // console.log(message.slice(3655,13442));
        // console.log(parsedMessage);        
        // res.writeHead(200, { 'Content-Type': 'text/html' });
        // res.write(message.slice(3655,13442));
    } finally {
        await redisClient.disconnect();
        await client.logout();
    }
    res.end();
}

exports.anotherGo = async (req, res, next) => {
    try {
        await redisClient.connect();
        const redisVal = await redisClient.json.get('my-messages', { path: '.'});
        console.log(redisVal.length);
        const message = Buffer.from(redisVal[1].source.data, 'base64');
        // var buf = Buffer.from(message, 'utf8');
        // let a = "<Buffer ";
        // let b = ">";
        // let c = message.replace(/,/g, " ");
        // console.log(c);
        // let d = a + c + b;
        // let e = [ { source: buf } ];
        // console.log(e);
        simpleParser(message, (err, parsed) => {
            if (err) {
                console.log(err);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(parsed.html);
                res.end();
            }
        });
    } finally {
        await redisClient.disconnect();
        // await client.logout();
    }
    console.log('done');
}

exports.nodeCx = async (req, res, next) => {
    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    let messages = [];
    let htmlcode = [];
    try {
        for await (let message of client.fetch('78:85', {uid: true, envelope: true, source: true})) {
            messages.push(message)
            // myCache.set('my-messages', message, 6000000);    
        }        
    } finally {
        lock.release();
        await client.logout();
    }
    myCache.set('my-messages', messages, 6000000);
    var value = myCache.get( "my-messages" );
    value.reverse();
    value.forEach(element => {
        var decoded = Buffer.from(element.source, 'base64');
        simpleParser(decoded, (err, parsed) => {
            if (err) {
                console.log(err);
            }
            console.log(parsed.html);
            htmlcode.push(parsed.html);
        });
    });
    console.log(htmlcode.length);
    res.end();
    // myCache.set('my-decoded-messages', htmlcode, 6000000);
    // res.end();
    // const decoded = Buffer.from(value[0].source, 'base64');
    // simpleParser(decoded, (err, parsed) => {
    //     console.log(parsed);
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         if (!parsed.html) {
    //             res.writeHead(200, { 'Content-Type': 'text/html' });
    //             res.write(parsed.textAsHtml);
    //             res.end();
    //         } else if (parsed.html) {
    //             res.writeHead(200, { 'Content-Type': 'text/html' });
    //             res.write(parsed.html);
    //             res.end();
    //         }
    //     }
    // });
}

exports.fromnodeCx = async (req, res, next) => {
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
    console.log(messages);
    // myCache.set('my-messages', messages, 6000000);
    // var value = myCache.get( "my-messages" );
    res.render('index', { title: 'Express', message: messages.reverse() });
}
// const { createClient }  = require('redis');

// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'redis-19934.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 19934
//     }
// });

// module.exports = redisClient;
 const { createClient }  = require('redis');

 const redisClient = createClient({
  username: 'default',
    password: 'W3am8JlUwTzPIAmNB0zBpB5HIxloGOVm',
    socket: {
        host: 'redis-19249.c265.us-east-1-2.ec2.cloud.redislabs.com',
        port: 19249
    }
});





 module.exports = redisClient;




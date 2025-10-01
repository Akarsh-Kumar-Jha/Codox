const {Redis} = require('@upstash/redis');
require('dotenv').config();

const connectRedis = async () => {
    console.log("Connecting To Redis...");
    try {
        const redis = new Redis({
            url: process.env.REDIS_URL,
            token: process.env.REDIS_TOKEN,
        });

        return redis;
    } catch (error) {
        console.log("Error In Connecting Redis", error);
    }
}

module.exports = connectRedis;
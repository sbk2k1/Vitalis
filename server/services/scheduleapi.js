const axios = require('axios');
const schedule = require('node-schedule');
const { ConnectionApi } = require('../models/connection');
const redisClient = require('.redis');

axios.interceptors.request.use(x => {
    // to avoid overwriting if another interceptor
    // already defined the same object (meta)
    x.meta = x.meta || {}
    x.meta.connectionStartedAt = new Date().getTime();
    return x;
})

// check uptime every 5 minutes
// therefore the string should be '5 * * * * *'
// for 10 minutes the string should be '10 * * * * *'

schedule.scheduleJob(process.env.API_INTERVAL, async () => {

    // send connection to each connection

    const connections = await ConnectionApi.find({});

    connections.forEach(async connection => {
        try {
            const response = await axios({
                method: connection.connectionType,
                url: connection.url,
            });

            const responseTime = new Date().getTime() - response.config.meta.connectionStartedAt;

            // get the data from redis
            var data = await redisClient.get(connection.uniqueId);
        
            if (responseTime > connection.threshold) {
                data.status = 'Slow';
            } else {
                data.status = 'Up';
            }

            var time;


            // check if connection.time.split(',').length is equal to 10
            if (data.times == undefined) {
                time = responseTime;
            }
            // when there is not , in the times
            else if (connection.times.split(',').length < connection.numOfTimes) {
                // add error to the end of the array
                time = data.times + ',' + responseTime;
            }
            // when there is , in the times
            else {
                // if equal to 10, remove the first element of the array and add the new response time to the end of the array
                const times = connection.times.split(',');
                times.shift();
                times.push(responseTime);
                time = times.join(',');
            }

            connection.times = time;

            connection.statusCode = response.status;
            connection.responseSize = (response.data == undefined) ? 0 : response.data.length;
            connection.lastChecked = new Date().toISOString();

            await connection.save();

        } catch (error) {
            console.log(error.message);
            connection.status = 'Down';
            var time;
            if (connection.times == undefined) {
                time = "error";
            }
            // when there is not , in the times
            else if (connection.times.split(',').length < connection.numOfTimes) {
                // add error to the end of the array
                // console.log(connection.times);
                time = connection.times + ',' + "error";
                // console.log(time);
            }
            // when there is , in the times
            else {
                // if equal to 10, remove the first element of the array and add the new response time to the end of the array
                const times = connection.times.split(',');
                times.shift();
                times.push("error");
                time = times.join(',');
            }

            // console.log(time);
            connection.times = time;

            connection.statusCode = "Error";
            connection.responseSize = "Error";
            connection.lastChecked = new Date().toISOString();

            await connection.save();
        }
    });
});


const axios = require('axios');
const schedule = require('node-schedule');
const ConnectionApi = require('../models/connection');
const redisClient = require('./redis'); // Make sure to provide the correct path to the redis.js file
const User = require('../models/user');
const Workspace = require('../models/workspace');
const Resend = require('resend');

const resend = new Resend.Resend(process.env.RESEND_API_KEY);

axios.interceptors.request.use(x => {
    x.meta = x.meta || {};
    x.meta.connectionStartedAt = new Date().getTime();
    return x;
});

// check uptime every 5 minutes
schedule.scheduleJob(process.env.API_INTERVAL, async () => {
    const connections = await ConnectionApi.find({});

    connections.forEach(async connection => {
        // Get connection threshold
        const threshold = connection.threshold;
        // Get numOfTimes
        const numOfTimes = connection.numOfTimes;
        try {
            const response = await axios({
                method: connection.connectionType,
                url: connection.url,
            });

            // Get response time
            const responseTime = new Date().getTime() - response.config.meta.connectionStartedAt;


            // Create an object to store the connection data
            const connectionData = {
                responseTimes: [], // To keep track of last numOfTimes response times
                status: '', // To store the status (slow, up, down)
                statusCode: response.status, // To store the current status code
                responseSize: response.headers['content-length'], // To store the response size
                lastCheckedTime: new Date().getTime(), // To store the last checked time
            };

            // Fetch the existing data from Redis
            const existingData = await redisClient.get(connection.uniqueId);
            if (existingData) {
                // If there is existing data, parse it from JSON and update the responseTimes array
                const parsedData = JSON.parse(existingData);
                connectionData.responseTimes = parsedData.responseTimes;
            }

            // Add the current response time to the responseTimes array
            connectionData.responseTimes.push(responseTime);

            // If the number of response times exceeds numOfTimes, remove the oldest time
            if (connectionData.responseTimes.length > numOfTimes) {
                connectionData.responseTimes.shift();
            }

            // Check if the current response time is less than the threshold
            if (responseTime < threshold) {
                connectionData.status = 'slow';
            } else {
                // Set the status as 'up' or 'down' based on your conditions
                // For example, you can check response status code and determine the status
                connectionData.status = 'up';
            }

            // Update the Redis data with the new connection data
            await redisClient.set(connection.uniqueId, JSON.stringify(connectionData));
        } catch (error) {
            // Create an object to store the connection data
            const connectionData = {
                responseTimes: [], // To keep track of last numOfTimes response times
                status: 'down', // To store the status (slow, up, down)
                statusCode: error.response ? error.response.status : '', // To store the current status code
                responseSize: error.response ? error.response.headers['content-length'] : '', // To store the response size
                lastCheckedTime: new Date().getTime(), // To store the last checked time
            };

            // Fetch the existing data from Redis
            const existingData = await redisClient.get(connection.uniqueId);
            if (existingData) {
                // If there is existing data, parse it from JSON and update the responseTimes array
                const parsedData = JSON.parse(existingData);

                // if recent (last) data of past data from redis is down, send email
                if (parsedData.responseTimes[parsedData.responseTimes.length - 1] !== 0) {

                    // get user
                    const workspace = await Workspace.findOne({ _id: connection.workspace });
                    const user = await User.findOne({ username: workspace.user });
                    const email = user.email;

                    let mailOptions = {
                        from: process.env.VITALIS_EMAIL,
                        to: email,
                        subject: `Connection Down for ${connection.url} in workspace ${workspace.name}`,
                        text: `Please find the details below:
                        Connection URL: ${connection.url}
                        Connection Type: ${connection.connectionType}
                        Connection Threshold: ${connection.threshold}
                        Connection Status: ${connectionData.status}
                        Connection Status Code: ${connectionData.statusCode}
                        Connection Response Size: ${connectionData.responseSize}
                        Connection Last Checked Time: ${connectionData.lastCheckedTime}
                        `,
                    };


                    resend.emails.send(mailOptions).then((response) => {
                        console.log(response)
                    }).catch((err) => {
                        console.log(err)
                    })
                }


                connectionData.responseTimes = parsedData.responseTimes;
            }

            // if no data in redis, send email
            if (!existingData) {

                // get user
                const workspace = await Workspace.findOne({ _id: connection.workspace });
                const user = await User.findOne({ username: workspace.user });
                const email = user.email;

                let mailOptions = {
                    from: process.env.VITALIS_EMAIL,
                    to: email,
                    subject: `Connection Down for ${connection.url} in workspace ${workspace.name}`,
                    text: `Please find the details below:
                        Connection URL: ${connection.url}
                        Connection Type: ${connection.connectionType}
                        Connection Threshold: ${connection.threshold}
                        Connection Status: ${connectionData.status}
                        Connection Status Code: ${connectionData.statusCode}
                        Connection Response Size: ${connectionData.responseSize}
                        Connection Last Checked Time: ${connectionData.lastCheckedTime}
                        `,
                };


                resend.emails.send(mailOptions).then((response) => {
                    console.log(response)
                }).catch((err) => {
                    console.log(err)
                })
            }

            // add current response time as 0
            connectionData.responseTimes.push(0);

            // If the number of response times exceeds numOfTimes, remove the oldest time
            if (connectionData.responseTimes.length > numOfTimes) {
                connectionData.responseTimes.shift();
            }


            // Update the Redis data with the new connection data
            await redisClient.set(connection.uniqueId, JSON.stringify(connectionData));
        }
    });
});

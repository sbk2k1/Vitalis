const axios = require('axios');
const schedule = require('node-schedule');
const ConnectionApi  = require('../models/connection');
const redisClient = require('./redis'); // Make sure to provide the correct path to the redis.js file
const User = require('../models/user');
const Workspace = require('../models/workspace');
const SibApiV3Sdk = require('sib-api-v3-sdk');

let defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

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
            console.error(`Error checking connection ${connection.url}: ${error.message}`);

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
                connectionData.responseTimes = parsedData.responseTimes;
            }

            // add current response time as 0
            connectionData.responseTimes.push(0);

            // If the number of response times exceeds numOfTimes, remove the oldest time
            if (connectionData.responseTimes.length > numOfTimes) {
                connectionData.responseTimes.shift();
            }

            // update status as down
            connectionData.status = 'down';

            // Update the Redis data with the new connection data
            await redisClient.set(connection.uniqueId, JSON.stringify(connectionData));

            try{
                // email
            const workspace = await Workspace.findOne({ _id: connection.workspace });
            const user = await User.findOne({ username: workspace.user });
            const email = user.email;

            // send email

            let mailOptions = {
                from: process.env.EMAIL_USERNAME,
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

            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log('Error Occurs', err);
                } else {
                    console.log('Email sent!!!');
                }
            }  
            );
        } catch (err) {
            console.log(err);
        }
        } 
    });
});

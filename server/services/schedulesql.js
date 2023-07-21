const schedule = require('node-schedule');
const sql = require('mysql');
const { ConnectionSql } = require('../models/connection');

schedule.scheduleJob(process.env.SQL_INTERVAL, async () => {
  try {
    const connections = await ConnectionSql.find({});
    
    connections.forEach(async connection => {
      try {
        const pool = await sql.createConnection({
          host: connection.host,
          user: connection.user,
          password: connection.password,
          database: connection.database
        });

        // record start time

        const connectionStartedAt = new Date().getTime();

        // run the query in sql

        const query = connection.query;

        pool.query(query, (err, result) => {
          if (err) {
            connection.status = 'Error';
            connection.statusCode = 'Error';
            connection.responseSize = 'Error';
            connection.lastChecked = new Date().toISOString();
            connection.save();
          } else {
            const responseTime = new Date().getTime() - connectionStartedAt;

            if (responseTime > connection.threshold) {
              connection.status = 'Slow';
            } else {
              connection.status = 'Up';
            }

            var time;

            // check if connection.time.split(',').length is equal to 10
            if (connection.times == undefined) {
              time = responseTime;
            }
            // when there is not , in the times
            else if (connection.times.split(',').length < connection.numOfTimes) {
              // add error to the end of the array
              time = connection.times + ',' + responseTime;
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

            connection.statusCode = '200';
            connection.responseSize = result.length;
            connection.lastChecked = new Date().toISOString();

            connection.save();
          }
        });

        pool.end();
      } catch (error) {
        console.log(error.message);

        connection.status = 'Error';
        connection.statusCode = 'Error';
        connection.responseSize = 'Error';
        connection.lastChecked = new Date().toISOString();

        await connection.save();
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});

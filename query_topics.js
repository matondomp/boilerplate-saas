const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123',
    database: 'my_db'
  });

  const [rows] = await connection.execute('SELECT * FROM acad_topics');
  console.log("Topics in database:");
  console.log(JSON.stringify(rows, null, 2));

  await connection.end();
}

run().catch(console.error);

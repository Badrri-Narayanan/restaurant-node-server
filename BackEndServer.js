//Back-End for Hotel Badrri Bhavan using node http server
const http = require('http');
const pg = require('pg');

let menu = [];

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Content-Type':'application/JSON'
    /** add other headers as per requirement */
};

http.createServer(async (req, res) =>{
    //A new connection to DB must be established every time.
    const client = new pg.Client({
        user: 'postgres',
        host: 'localhost',
        database: 'hotel',
        password: 'password123',
        port: 5432,
    })
    client.connect();
    try {
        menu = [];
        const res = await client.query("select * from menu");
        for(row of res.rows) {
            let obj =   {
                            'name': row.name,
                            'price': row.price,
            };
            menu.push(obj);
        }
    } catch(e) {
        console.error(e.stack);
    }
    //DB connection must be closed after querying
    await client.end();
    //console.log("Database disconnected");
    res.writeHead(200, headers);
    res.write(JSON.stringify(menu));
    res.end();
}).listen(process.env.PORT, ()=>{
    console.log(`Server is online and is running on PORT ${process.env.PORT}`);
});
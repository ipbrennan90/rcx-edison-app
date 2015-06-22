var pg = require('pg');

var connString = "postgres:@localhost/rcx"

var client = new pg.Client(connString)

client.connect();

var query = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, salt VARCHAR(255) not null, passhash VARCHAR(255) not null, email VARCHAR(40) not null)')

query.on('end', function(){ client.end(); });

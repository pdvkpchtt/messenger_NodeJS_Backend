CREATE TABLE users(
    id SERIAL PRIMARY KEY, 
    username VARCHAR(28) NOT NULL UNIQUE, 
    psshash VARCHAR NOT NULL,
    userid VARCHAR NOT NULL UNIQUE
);

INSERT INTO users(username, psshash) values($1,$2);
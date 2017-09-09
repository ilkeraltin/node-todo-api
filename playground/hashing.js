const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
    id: 10
};

let token = jwt.sign(data,'123abc');

console.log(token);

let decoded = jwt.verify(token, '123abc');

console.log(decoded);

/* 
let msg = 'this is third user';

let hash = SHA256(msg).toString();

console.log('Message:', msg);
console.log('Hash:', hash);

let data = {
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecretsalt').toString()
};

let hashResult = SHA256(JSON.stringify(token.data) + 'somesecretsalt').toString();

token.data.id = 5;
token.hash = SHA256(JSON.stringify(data).toString());

if (hashResult === token.hash) {
    console.log('data is secured!')
} else {
    console.log('you can not trust this data!');
} */
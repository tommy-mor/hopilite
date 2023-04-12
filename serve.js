
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(req.url);
    if(req.url == '/') {
        req.url = '/index.html';
    }
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log('not found', err);
        }
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});


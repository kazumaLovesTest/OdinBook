const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-type': 'text/plain' })
  response.end('hello world')
})

app.listen(3001)
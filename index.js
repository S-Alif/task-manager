// require app
const app = require('./app')
const authenticationVerification = require('./src/middleware/authentication-verification')
let port = 8000

// base
app.get('/', authenticationVerification, (req, res) => {
  res.readFile('./public/index.html')
})

app.listen(port, () => {
  console.log('app running in port '+port)
})
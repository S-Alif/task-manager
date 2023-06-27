// require app
const app = require('./app')

let port = 8000

app.listen(port, () => {
  console.log('app running in port '+port)
})
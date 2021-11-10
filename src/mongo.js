const mongoose = require('mongoose');
const connectionString = process.env.MONGO_DB_URI;

//conexión a mongodb

mongoose.connect(connectionString)
.then(() => {
    console.log('MongoDatabase connected')
}).catch(err => {
    console.log(err)
})

//creo que no funciona la parte de desconectar
process.on('uncaughtException', (error) => {
    console.error(error)
    console.log('disconected')
    mongoose.disconnect();
})
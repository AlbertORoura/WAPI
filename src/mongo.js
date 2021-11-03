const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://albert_oliva:Fm39DXLUxzCza59F@cluster0.k3xvc.mongodb.net/wapidb?retryWrites=true&w=majority';

//conexión a mongodb

mongoose.connect(connectionString)
.then(() => {
    console.log('MongoDatabase connected')
}).catch(err => {
    console.log(err)
})
//creo que no funciona la parte de desconectar
process.on('uncaughtException', () => {
    console.log('disconected')
    mongoose.connection.disconnect();
})
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');

const keys = require('../../keys.json');
let backUpDB;
//google connection
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Connected');
        backUpDB = getBackup(client);
    }
});

async function getBackup (client) {
    const gsapi = google.sheets({ version: 'v4', auth: client });
    const opt = {
        spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
        range: 'A1:E1000'
    };
    console.log('creando backUp');
    return await gsapi.spreadsheets.values.get(opt);
}

const convertArrayToObject = (array) => {
    let dataToImport = [];
    for (var i = 1; i < array.length; i++) {
        var myObj = new Object();
        for (var z = 0; z < array[0].length; z++) {
            var a = array[0][z];
            var b = array[i][z];
            myObj[a] = b;
        }
        dataToImport.push(myObj);
    }
    return dataToImport;
};

module.exports = {

    restore: async (req, res, next) => {
        let backUp = await backUpDB;
        
        const gsapi = google.sheets({ version: 'v4', auth: client });
        let updateOptions = {
            spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
            range: 'A1:E' + backUp.data.values.length,
            valueInputOption: 'USER_ENTERED',
            resource: { values: backUp.data.values }
        }
        await gsapi.spreadsheets.values.update(updateOptions);
        res.status(201).json('data base restored');
        next();
    },

    getAll: async (req, res, next) => {
        const gsapi = google.sheets({ version: 'v4', auth: client });
        const opt = {
            spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
            range: 'A1:E1000'
        };
        let woman = await gsapi.spreadsheets.values.get(opt);
        let response = convertArrayToObject(woman.data.values);

        res.status(200).json(response);
        next();
        return woman.data.values;
    },

    index: async (req, res, next) => {
        res.send(`
        <html>

<head>
    <Title>Woman API project</Title>
</head>

<body>
    <h1>
        The aim of that project is to provide an API for testing purposes.
    </h1>

    <h2>You can make a CRUD in database, and also you can restore it if needed.</h2>

    <h2>
        The endpoints are:
    </h2>
    <ul>
        <li>Get all database -> GET /api/women</li>
        <li>Get 1 concrete register -> GET by ID /api/woman/:id</li>
        <li>Create a new register in database -> POST /api/woman</li>
        <li>Edit a concrete register in database -> PUT /api/woman/:id</li>
        <li>Edit a concrete register in database -> PATCH /api/woman/:id</li>
        <li>Delete 1 concrete register in database -> DELETE /api/woman/:id</li>
        <li>Restore database -> PUT /api/woman/</li>
    </ul>

    <h2>If this project has been helpful to you, you can thank me by making a donation to any organization for the study
        of diseases related to women.</h2>

</body>
</html>
        `);
        next();
    },

    newUser: async (req, res, next) => { //POST
        const gsapi = google.sheets({ version: 'v4', auth: client });
        const opt = {
            spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
            range: 'A1:E1000'
        };
        let woman = await gsapi.spreadsheets.values.get(opt);


        const { firstName, lastName, birthDate, history } = req.body;
        if (firstName && lastName && birthDate && history) {
            const id = uuidv4();
            const newWoman = [id, req.body.firstName, req.body.lastName, req.body.birthDate,  req.body.history];
            woman.data.values.push(newWoman);
            

            let updateOptions = {
                spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
                range: 'A1:E' + woman.data.values.length,
                valueInputOption: 'USER_ENTERED',
                resource: { values: woman.data.values }
            }
            await gsapi.spreadsheets.values.update(updateOptions);
            
            res.status(201).json(id);
        } else {
            res.json('data missing, please, provide name, firstName and lastName');
        }
        next();
    },

    getUser: async (req, res, next) => { //GET:Id
        let { id } = req.params;

        const gsapi = google.sheets({ version: 'v4', auth: client });
        const opt = {
            spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
            range: 'A1:E1000'
        };
        let woman = await gsapi.spreadsheets.values.get(opt);
        let values = woman.data.values;
        let response = convertArrayToObject(values);
        let index = response.findIndex(w => w.id === id);

        if (index >= 0) {
            res.status(200).json(response[index]);
        } else {
            console.log('id not found');
            res.status(404).json({ success: false });
        }
        next();
    },

    replaceUser: async (req, res, next) => { //PUT
        // const {userId} = req.params;
        // const newUser = req.body;
        // const oldUser = await User.findByIdAndUpdate(userId,newUser)
        res.status(200).json({ success: true });
        next();
    },

    updateUser: async (req, res, next) => { //PATCH
        // const {userId} = req.params;
        // const newUser = req.body;
        // const oldUser = await User.findByIdAndUpdate(userId,newUser)
        res.status(200).json({ success: true });
        next();
    },

    deleteUser: async (req, res, next) => { //DELETE
        let { id } = req.params;

        const gsapi = google.sheets({ version: 'v4', auth: client });
        const opt = {
            spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
            range: 'A1:E1000'
        };
        let woman = await gsapi.spreadsheets.values.get(opt);
        let values = woman.data.values;
        let response = convertArrayToObject(values);
        let index = response.findIndex(w => w.id === id);

        if (index >= 0) {
            values.splice(index + 1, 1);
            values.push(['', '', '', '', '']);
            let updateOptions = {
                spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
                range: 'A1:E' + values.length,
                valueInputOption: 'USER_ENTERED',
                resource: { values: values }
            }
            await gsapi.spreadsheets.values.update(updateOptions);
            res.status(200).json({ success: true });
        } else {
            console.log('id not found');
            res.status(404).json({ success: false });
        }
        next();
    },
    notFound :  async (req, res, next) => {
        res.status(404).json({error:'bad path'});
    }
};
const { google } = require('googleapis');
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
    },

    index: async (req, res, next) => {
        // const gsapi = google.sheets({ version: 'v4', auth: client });
        // const opt = {
        //     spreadsheetId: '1rBs1ltQvr5gCXrOPTXX-EDNiAZ5LRdVAbrwR5qwVZ4Y',
        //     range: 'A1:E1000'
        // };
        // let woman = await gsapi.spreadsheets.values.get(opt);
        // let response = convertArrayToObject(woman.data.values);

        // res.status(200).json(response);
        // return woman.data.values;
        res.send(`
        <html>

<head>
    <Title>Woman API project</Title>
</head>

<body>
    <h1>
        The aim of that project is to provide an API for testing purposes. But developers are welcomed too ;)
    </h1>

    <h2>You can make a CRUD in database, and also you can restore it if needed.</h2>

    <h2>
        The endpoints are:
    </h2>
    <ul>
        <li>GET /</li>
        <li>GET by ID /:id</li>
    </ul>

    <h2>If this project has been helpful to you, you can thank me by making a donation to any organization for the study
        of diseases related to women.</h2>

</body>
</html>
        `)
    },

    newUser: async (req, res, next) => { //POST
        const { name, firstName, lastName } = req.body;
        if (name && firstName && lastName) {
            const id = woman.length + 1;
            const newWoman = { id, ...req.body }; //y si me mandan un id?
            woman.push(newWoman);
            res.status(201).json(woman);
        } else {
            res.json('data missing, please, provide name, firstName and lastName');
        }
    },

    getUser: async (req, res, next) => { //GET:Id
        // const {userId} = req.params;
        // const user = await User.findById(userId);
        res.status(200).json(user);
    },
    //POST
    replaceUser: async (req, res, next) => { //PUT
        // const {userId} = req.params;
        // const newUser = req.body;
        // const oldUser = await User.findByIdAndUpdate(userId,newUser)
        res.status(200).json({ success: true });
    },

    updateUser: async (req, res, next) => { //PATCH
        // const {userId} = req.params;
        // const newUser = req.body;
        // const oldUser = await User.findByIdAndUpdate(userId,newUser)
        res.status(200).json({ success: true });
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
    },
    notFound :  async (req, res, next) => { //DELETE
        res.status(404).json({error:'bad path'});
    }
};
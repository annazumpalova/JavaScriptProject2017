const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (config) => {
    mongoose.connect(config.connectionString);

    let database = mongoose.connection;
    database.once('open', (error) => {
        if (error) {
            console.log(error);
            return;
        }

        console.log('MongoDB ready!')
    });
    };

    module.exports.initialize=()=> {
    Role.findOne({name: 'User'}).then(role => {
        if(!role){
            Role.create({name: 'User'});
        }
    });
    Role.findOne({name: 'Admin'}).then(role =>{
        if(!role)
        {
            Role.create({name: 'Admin'});
        }
    });
    };
require('./../models/Role').initialize;
require('./../models/User').seedAdmin();
require('./../models/Car');






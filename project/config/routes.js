const userController = require('./../controllers/user');
const carController = require('./../controllers/car');
const homeController = require('./../controllers/home');

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/car/create', carController.createGet);
    app.post('/car/create', carController.createPost);

    app.get('/car/details/:id', carController.details);

    app.get('/car/edit/:id', carController.editGet);
    app.post('/car/edit/:id', carController.editPost);

    app.get('/car/delete/:id', carController.deleteGet);
    app.post('/car/delete/:id', carController.deletePost);
};


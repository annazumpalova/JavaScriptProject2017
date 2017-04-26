const Car = require('mongoose').model('Car');

module.exports = {
    createGet: (req, res) => {
        res.render('car/create');
    },

    createPost: (req, res) => {
        let articleArgs = req.body;

        let errorMsg = '';
        if(!req.isAuthenticated()){
            errorMsg = 'You should be logged in to make articles!'
        } else if (!articleArgs.make){
            errorMsg = 'Invalid vehicle model!';
        } else if (!articleArgs.model){
            errorMsg = 'Invalid model!';
        } else if (!articleArgs.author){
            errorMsg = 'Invalid author!';
        } else if (!articleArgs.body){
            errorMsg = 'Invalid body!';
        } else if (!articleArgs.fuel){
            errorMsg = 'Invalid fuel!';
        } else if (!articleArgs.price){
            errorMsg = 'Invalid price!';
        } else if (!articleArgs.mileage){
            errorMsg = 'Invalid mileage!';
        } else if (!articleArgs.registration){
            errorMsg = 'Invalid registration!';
        }else if (!articleArgs.information){
            errorMsg = 'Invalid information!';
        }

        if (errorMsg) {
            res.render('car/create', {error: errorMsg});

            return;
        }


        articleArgs.cars = req.user.id;
        Car.create(articleArgs).then(article => {
            req.user.cars.push(article.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/');
                }
            })
        })
    },

    details: (req, res) => {
        let id = req.params.id;

        Car.findById(id).populate('author').then(article => {
            if(!req.user){
                res.render('car/details', {article: article, isUserAuthorized: false});
                return;
            }

            req.user.isInRole('Admin').then(isAdmin =>{
                let isUserAuthorized=isAdmin || req.user.isAuthor(article);

                res.render('car/details', { article: article, isUserAuthorized: isUserAuthorized});
            });
        });
    },

    editGet: (req,res) => {
        let id=req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl=`/car/edit/${id}`;
            req.session.returnUrl=returnUrl;
            res.redirect('/user/login');
            return;
        }
        Car.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if(!isAdmin && !req.user.isAuthor(article)){
                    res.redirect('/');
                    return;
                }
                res.render('/car/edit', article)
            });
        });
    },

    editPost: (req,res) => {
        let id=req.params.id;

        let articleArgs=req.body;

        let errorMsg='';
        if(!articleArgs.make){
            errorMsg='Car brand cannot be empthy!';
        } else if(!articleArgs.model)
        {
            errorMsg='Car model cannot be empthy!';
        }
        else if(!articleArgs.author)
        {
            errorMsg='Car author cannot be empthy!';
        }
        else if(!articleArgs.body)
        {
            errorMsg='Car body cannot be empthy!';
        }
        else if(!articleArgs.fuel)
        {
            errorMsg='Car fuel cannot be empthy!';
        }
        else if(!articleArgs.price)
        {
            errorMsg='Car price cannot be empthy!';
        }
        else if(!articleArgs.mileage)
        {
            errorMsg='Car mileage cannot be empthy!';
        }
        else if(!articleArgs.registration)
        {
            errorMsg='Car registration cannot be empthy!';
        }
        else if(!articleArgs.information)
        {
            errorMsg='Car information cannot be empthy!';
        }

        if(errorMsg)
        {
            res.render('/car/edit', {error: errorMsg})
        } else {
            Car.update({_id: id}, {$set: {make: articleArgs.make, model: articleArgs.model, author: articleArgs.author, body: articleArgs.body,
            fuel: articleArgs.fuel, price: articleArgs.price, mileage: articleArgs.mileage,
                registration: articleArgs.registration, information: articleArgs.information}}).then(updatesStatus => {
                res.redirect(`car/details/${id}`);
            })
        }
    },

    deleteGet:(req,res) => {
        let id=req.params.id;

        Car.findById(id).then(article =>{
            res.render('/car/delete', article)
        });
    },

    deletePost:(req,res)=> {
        let id=req.params.id;

        Car.findOneAndRemove({_id:id}).populate('author').then(article =>
        {
            let author=article.author;

            //Index of the car's ID in the author's articles.
            let index=author.articles.indexOf(article.id);

            if(index<0)
            {
                let errorMsg='Car was not found for that author!';
                res.render('car/delete', {error: errorMsg})
            } else {
                //Remove count elements after given index (inclusive).
                let count=1;
                author.articles.splice(index, count);
                author.save().then((user)=>{
                    res.redirect('/');
                });
            }
        });
    },

    deleteGet: (req,res)=>{
        let id=req.params.id;

        if(!req.isAuthenticated()){
            let returnUrl=`/car/delete/${id}`;
            req.session.returnUrl=returnUrl;

            res.redirect('/user/login');
            return;
        }
        Car.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if(!isAdmin && !req.user.isAuthor(article)){
                    res.redirect('/');
                    return;
                }

                res.render('car/delete', article)
            });
        });
    }
};
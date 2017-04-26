const mongoose = require('mongoose');
const Car = mongoose.model('Car');

module.exports = {
  index: (req, res) => {
      Car.find({}).limit(6).populate('author').then(articles => {
          res.render('home/index',{articles: articles});
      })
  }
};
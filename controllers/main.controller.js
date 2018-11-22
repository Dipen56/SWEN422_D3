var dataLoader = require('../services/data.loader');

var data = null; // Data To Send

module.exports = {

    index: (req, res, next) => {
        res.redirect('/q1');
    },

    get_data: (req, res, next) => {
        if(data != null){
            res.send(data); // send cache
        }
        // process data if not cached
        dataLoader.load().then(json => {
            data = json; // cache it so no need to do more loading
            res.send(json);
        }).catch(err => {console.log(err)});
    },

    q1: (req, res, next) => {
        res.render('pages/q1', {title: 'SWEN 422 Assignment 1'})
    },
    q2: (req, res, next) => {
        res.render('pages/q2', {title: 'SWEN 422 Assignment 1'})
    },
    q3: (req, res, next) => {
        res.render('pages/q3', {title: 'SWEN 422 Assignment 1'})
    }
};


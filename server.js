'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { stock, customers } = require(__dirname + '/data/promo.js');

const PORT = process.env.PORT || 8000;

const items = [];

const handleData = (req, res) =>{
    const { todo } = req.body;
    items.push(todo);
    res.redirect('/todos')
}

const handleFormData = (req, res)=>{
    const data = req.body;
    console.log(data);
    
    if (customers.find(customer => customer.givenName === data.givenName) && customers.find(customer => customer.address === data.address)){
        res.send({status:'error', error: '550'});
        return;
    }
    else {
        if (data.country !== 'Canada'){
            res.send({status:'error', error: '650'});
            return;
        }
        else if (data.order === 'shirt' && data.size === 'medium'){
            res.send({status:'error', error: '450'})
            return;
        }
    }
    res.send({status:'success', error: 'none'});
}
express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('tiny'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')

    // endpoints
    .get('/todos', (req, res) =>{
        res.render('pages/todo', {
            items: items
        })
    })
    .post('/form-data', handleData)

    .get('/order-form', (req, res)=>{
        res.render(__dirname + '/index.html');
    })

    .post('/order', handleFormData)

    .get('/order-confirmed', (req, res)=>{
        res.send('Order Confirmed');
    })


    .get('*', (req, res) => res.send('Dang. 404.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
const express = require('express');
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/test', ['inventory'])
const app = express();
const port = 3000;

// enable json body parsing
app.use(express.json());

// enable post body parsing
app.use(express.urlencoded({extended: true}));


// use templates
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => res.send('Hello World!'));


app.get('/inventory', (req, res) => {
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    })
})

app.get('/borrar/:id', (req, res) =>{
    let id= req.params.id;
    db.inventory.remove({_id: mongojs.ObjectId(id)}, function (err){
        if(err){
            console.log('Error al borrar')
        }else{
            res.redirect('/inventory')
        }
    })
})


app.get('/crear', (req,res) =>{
    res.render('create');
})

app.post('/crear', (req,res) =>{
    let myObject= {
        item: req.body.item,
        qty: req.body.qty,
        status: req.body.status,
        size: JSON.parse(req.body.size)
    }
    db.inventory.insertOne(myObject, function (err){
        if(err){
            console.log('Error al insertar')
        }
        else{
            res.redirect('/inventory')
        }
    });
})

app.get('/edit/:id', (req, res) => {
    db.inventory.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            console.log(doc)
            res.render('edit', {element: doc})
        }
    })
})


app.get('/edit/:id', (req, res) => {
    db.inventory.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
        if (err) {
            res.send(err);
        } else {
            console.log(doc)
            res.render('edit', {element: doc})
        }
    })
})

app.post('/edit/:id', (req, res) => {

    req.body.size = JSON.parse(req.body.size)
    console.log(req.body)
    console.log(req.params.id)

    db.inventory.findAndModify({
            query: {_id: mongojs.ObjectId(req.params.id)},
            update: {$set: req.body}
        },
        (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/inventory')
            }
        })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

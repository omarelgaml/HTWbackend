const express =  require('express');
const app = express();
const bodyParser= require('body-parser');
const cors =require('cors');
const PORT = 4000;
const mongoose =require('mongoose');
const RecordRoutes =express.Router();
let Record = require('./hallOfFame.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/hallOfFame',{useNewUrlParser:true});
const connection =mongoose.connection;

connection.once('open',function(){
    console.log("connection to database established is successfully ");
});


//this to distnguish routes
app.use('/records',RecordRoutes);
//to handle requists comming to same route
RecordRoutes.route('/').get(function(req,res){
    Record.find(function(err,records){
        if(err)
            console.log(err);
        else{
            res.json(records);
        }
    });
});

    //maybe not used now but i will keep it for later
    RecordRoutes.route('/:id').get(function(req,res){
        let id=req.params.id;
        Record.findById(id,function(err,record){
            res.json(record);
        });
    });

    // adding record
    RecordRoutes.route('/add').post(function(req,res){
        let record =new Record(req.body);
        record.save()
        .then(record =>{
            res.status(200).json({'record':'record added successfuly'});
        })
        .catch(err =>{
            res.status(400).send('adding new recored failed');
        });
    });



app.listen(PORT,function(){
    console.log("SERVER is running on port "+PORT);
});


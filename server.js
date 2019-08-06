const express =  require('express');
const app = express();
const bodyParser= require('body-parser');
const cors =require('cors');
const PORT = 4000;
const mongoose =require('mongoose');
const RecordRoutes =express.Router();
const TopThreesRoutes =express.Router();
const Records = require('./hallOfFame.model');
const topThreesRecords = require('./topThrees.model');
const cron = require('node-cron');
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/hallOfFame',{useNewUrlParser:true});
const connection =mongoose.connection;
connection.once('open',function(){
    console.log("connection to database established is successfully ");
});

/*
     This is crone job library from node, the code inside it will be excuted on the first day of each month to insert
     the first three of the current month in the topThrees table and clear the table of the current month ranking
*/     
var monthlyTask = cron.schedule('0 0 1 * *', () => {
    Records.find()
    .then(res=>{
        res.sort(function(a, b){
            if(a["grade"]===b["grade"]){
                return a["seconds"]-b["seconds"]
            }
            return b["grade"]-a["grade"]
        })
        var docs = [res[0],res[1],res[2]];
       topThreesRecords.insertMany(docs, function(error, inserted) {
            if(error) {
                console.error(error);
            }
            else {
                console.log("Successfully inserted: " , inserted );
            }
        });
        console.log(res);
    })
    .catch(err=>{
        console.log(err);
    })
});
monthlyTask.start();
//this to distnguish routes
app.use('/records',RecordRoutes);
app.use('/topThrees',TopThreesRoutes);


//getting all the records in the hallOfFame table
RecordRoutes.route('/').get(function(req,res){
    Records.find(function(err,records){
        if(err)
            console.log(err);
        else{
            res.json(records);
        }
    });
});

//getting all the record in the topThrees table
TopThreesRoutes.route('/').get(function(req,res){
    topThreesRecords.find(function(err,records){
        if(err)
            console.log(err);
        else{
            res.json(records);
        }
    });
});

//deleting a record
RecordRoutes.route('/delete').post(function(req,res){
    let id= req.body.id;
    Records.deleteOne({_id:id}).then(res=>{
    })
    .catch(err=>{
        console.log(err);
    })
})
// adding record
RecordRoutes.route('/add').post(function(req,res){
    let record =new Records(req.body);
   
    record.save()
    .then(record =>{
        res.status(200).json({'record':'record added successfuly'});
    })
    .catch(err =>{
        console.log(err);
        res.status(400).send('adding new recored failed');
    });
});



app.listen(PORT,function(){
    console.log("SERVER is running on port "+PORT);
});


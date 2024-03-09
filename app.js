// Task1: initiate app and run server at 3000
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
app.use(express.json());
app.listen(3000,()=>{
    console.log('server is up and running');
})

// Task2: create mongoDB connection 

const mongoDB_URL='mongodb+srv://elizabethkjacob:elizabeth@cluster0.3b9ji5d.mongodb.net/employeeDB?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoDB_URL).then(()=>{
    console.log('DB is connected'); 
})
.catch((error)=>{
    console.error('Connection Error!!!',error);
}) 

//creating schema
const employeeSchema = mongoose.Schema({
    location:String,
    name:String,
    position:String,
    salary:Number
});

//create model
const employeeModel=mongoose.model('employees',employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db using api '/api/employeelist'
app.get('/api/employeelist',async(req,res)=> {
    try {
        const data=await employeeModel.find();
       res.json(data); 
    }  
    catch (error) {
        res.status(404).send('data not found');
    }
   
})

//TODO: get single data from db using api '/api/employeelist/:id'

app.get('/api/employeelist/:id',async(req,res)=> {
    const employeeId=req.params.id;
    try {
        const employee=await employeeModel.findById(employeeId);
        res.json(employee);
        
    } catch (error) {
        console.log("error for employee data",error.message);
    }
});

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist',async(req,res)=>{
    
    try{
        var item=req.body;
        const data=new employeeModel(item);
        const saveddata=await data.save();
        console.log('Employee added');
        res.status(200).send('POST success');
        
    }
    catch(error){
        res.status(404).send('POST unsuccess');
    }
    })



// TODO: Update a employee data from db by using api '/api/employeelist'
// Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async (req, res) => {
    const employeeId = req.body._id;
    try {
        const employee = await employeeModel.findById(employeeId);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        employee.name = req.body.name || employee.name ;
        employee.location = req.body.location || employee.location;
        employee.salary = req.body.salary || employee.salary;
        employee.position = req.body.position || employee.position;
        await employee.save();
        res.status(200).send('Data updated');
    } catch (error) {
        console.error('Error updating employee data:', error.message);
        res.status(500).send('Internal server error');
    }
});

//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id',async(req,res)=>{
    const employeeId=req.params.id;
    try {
        const result=await employeeModel.deleteOne({_id:employeeId});
       if(result.deletedCount === 0){
        return res.status(404).json({error:"employee not found"});
       }
       res.json({success:true});
        }
     catch (error) {
console.error("error captured",error.message);
        }
});

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

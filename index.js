const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const Todo = require('./models/todo');

const app = express();


// setting express js and views and static files 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));



var todoList = [
    {
        description : "Annual report submission deadline",
        category : "WORK",
        date : "26-06-2021"
    }
]


app.get('/', function(req, res){
   
    Todo.find({}, function(err, todos){
        if (err){
            console.log('Error in fetching contacts from db');
            return;
        }

        return res.render('home', {
            title: "To do list",
            todo_list: todos
        });

    });
    
    
});


// adding a task in a todo
app.post('/add-task', function(req, res){
    Todo.create({
        description: req.body.description,
        category: req.body.category,
        date: req.body.date
    }, function(err, newTodo){
        if (err){console.log('error in creating a todo!'); 
        return;}

        console.log('*********', newTodo);
        return res.redirect('back');
    });

});

// for deleting todos/tasks from the list
app.post('/delete-task', function(req, res){
    let ids = req.body.task;
    if(typeof(ids) == "string") {
        Todo.findByIdAndDelete(ids, function(err){
            if(err){
                console.log("error in deleting object from database");
                return;
            }
        });
    } else {
        for(let i = 0; i < ids.length; i++) {
            Todo.findByIdAndDelete(ids[i], function(err){
                if(err) {
                    console.log('Error in deleting object form database');
                    return;
                }
            });
        }
    }
    
    return res.redirect('back');
})



app.listen(port, function(err){
    if (err){
        console.log('Error in running the server', err);
    }
    console.log('Yup! My Express Server is running on Port: ', port);
});
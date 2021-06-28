const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();   // creating object of express
/*VERSION 1 REQUIREMENT FOR ARRAYS
var newItems  = [];
let workItems = [];*/
app.set('view engine', 'ejs');   //using embedded js for templating.

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sejal:sejal2001@cluster0.2mspn.mongodb.net/ToDoListDB" , {useNewUrlParser : true}); // connect to mongoDB

const itemsSchema = {      // defining the schema
    name : String
};

const Item = mongoose.model("Item" , itemsSchema);   // creation of a model of name Item. mongoose model always start with capital

const item1 = new Item({
    name : "Welcome to your To Do list!"
});

const item2 = new Item({
    name : "Hit the + button to add a new item."
});
const item3 = new Item({
    name : "<-- Hit this to delete a item"
});

const defaultItems = [item1 , item2 , item3];

const listSchema = {     // creating schema for our dynamic lists
    name : String,
    items : [itemsSchema]
}

const List = mongoose.model("List" , listSchema); //creating model for dynamic list




app.get("/" , function(req , res){
    //res.send("hello!");
    var today = new Date();
    
    var options = {  // obj for desc of date format
        weekday : "long",
        day : "numeric",
        month : "long",
        //year : "numeric",
    }
    var day = today.toLocaleDateString("en-US" , options); //JS method for format :- "Day, Month Date"
    //mongoose method for finding docs from DB
    Item.find({} , function(err , foundItems){
        //console.log(foundItems);
        if(foundItems.length === 0){
            Item.insertMany(defaultItems , function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Success!");
                }
            });
            res.redirect("/");

        }else{
            res.render("list",{listTitle : "Today" , nextItems : foundItems});
        }
        
    })
   
});

app.get("/:customListName" , function(req , res){
    const customListName = req.params.customListName ;

    List.findOne({name : customListName} , function(err , foundList){
        if(!err){
            if(!foundList){
                //create a new list
                const list = new List({
                    name : customListName,
                    items : defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }else{
                //show existing list
                res.render("list",{listTitle : foundList.name , nextItems : foundList.items});

            }
        }
    })
    
})

app.post("/" , function(req , res){
    /*INCASE OF VERSION 1 OF THIS APP WHERE WE MAINTAINED TWO LISTS-->WORK AND NORMAL
    console.log(req.body);
    newItem = req.body.newitem;
    if(req.body.list === "Work"){
        
        workItems.push(newItem);
        res.redirect("/work");
    }else{
        newItems.push(newItem);
        res.redirect("/");
        //console.log(newItem);

    }*/
    const itemName = req.body.newitem;
    const listName = req.body.list;
    const item = new Item({
        name : itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");

    }else{
        List.findOne({name : listName} , function(err , foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
    
    
    

});

app.post("/delete" , function(req , res){
    //console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId , function(err){
            if(!err){
                console.log("Successfully Deleted the checked Item");
                res.redirect("/");
            }
        })

    }else{
        List.findOneAndUpdate({name : listName} , {$pull:{items : {_id : checkedItemId }}} , function(err , foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }
    

})

/*INCASE OF VERSION 1
app.get("/work" , function(req , res){
    res.render("list" , {listTitle : "Work List" , nextItems : workItems });

});*/

/*app.post("/work" , function(req , res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})*/

app.listen("3000" , function(){
    console.log("server started on port 3000");
})
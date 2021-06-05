const express = require("express");
const bodyParser = require("body-parser");


const app = express();   // creating object of express
var newItems  = [];
let workItems = [];
app.set('view engine', 'ejs');   //using embedded js for templating.

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/" , function(req , res){
    //res.send("hello!");
    var today = new Date();
    /*var currentDay = today.getDay(); // gets todays day 
    var day = "";
    switch(currentDay){
        case 0 :
            day = "Sunday";
            break;
        case 1 :
            day = "Monday";
            break;
        case 2 :
            day = "Tuesday";
            break;
        case 3 :
            day = "Wednesday";
            break;
        case 4 :
            day = "Thursday";
            break;
        case 5 :
            day = "Friday";
            break;
        case 6 :
            day = "Saturday";
            break;
        default :
            break;
    };*/
    var options = {  // obj for desc of date format
        weekday : "long",
        day : "numeric",
        month : "long",
        //year : "numeric",
    }
    var day = today.toLocaleDateString("en-US" , options); //JS method for format :- "Day, Month Date"
    res.render("list",{listTitle : day , nextItems : newItems});
});

app.post("/" , function(req , res){
    console.log(req.body);
    newItem = req.body.newitem;
    if(req.body.list === "Work"){
        
        workItems.push(newItem);
        res.redirect("/work");
    }else{
        newItems.push(newItem);
        res.redirect("/");
        //console.log(newItem);

    }
    
    

});

app.get("/work" , function(req , res){
    res.render("list" , {listTitle : "Work List" , nextItems : workItems });

});

/*app.post("/work" , function(req , res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})*/

app.listen("3000" , function(){
    console.log("server started on port 3000");
})
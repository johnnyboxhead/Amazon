var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "bamazon"
})

connection.connect(function(err){
    if (err) throw err;
    connection.end()
})

// function pullItems(){
//     connection.query("SELECT * FROM products", function(err, res){
//         if (err) throw err;
//         console.log(res);
//         connection.end();
//         questions();
//     })
    
// }

// pullItems()
questions()

function questions(){
    inquirer.prompt([
    {
        type: "input",
        message: "What item_id do you want to purchase?",
        name: "item_id"
    },
    {
        type: "input",
        message: "How many do you want to purchase?",
        name: "stock_quantity"
    }], function(answers){
        console.log("test1");
        console.log(answers.stock_quantity);
    })
}

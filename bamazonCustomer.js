var mysql = require("mysql");
var inquirer = require("inquirer");
var item_id
var stock_quantity
var currentItems
var available
var newQuantity
var total

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "bamazon"
})

connection.connect(function(err){
    if (err) throw err;
})

function pullItems(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        currentItems = res
        console.log(" ")
        for (i=0; i < currentItems.length; i++){
            console.log("Item ID: " + currentItems[i].item_id);
            console.log("Product Name: " + currentItems[i].product_name);
            console.log("Department Name: " + currentItems[i].department_name);
            console.log("Price: " + currentItems[i].price);
            console.log("Stock Quantity " + currentItems[i].stock_quantity);
            console.log("_______________")
            console.log(" ")
        }
        // console.log(currentItems);
        questions()
        // connection.end();
    })
}

pullItems()
// questions()

function questions(){
    inquirer.prompt([
    {
        type: "input",
        message: "Which item_id do you want to purchase?",
        name: "item_id"
    },
    {
        type: "input",
        message: "How many do you want to purchase?",
        name: "stock_quantity"
    }]
    ).then(function(inquirerResponse){
        stock_quantity = inquirerResponse.stock_quantity
        item_id = inquirerResponse.item_id
        console.log("You want to purchase " + inquirerResponse.stock_quantity + " of item #" + inquirerResponse.item_id)
        checkItem();
    })
}

function checkItem(){
    for (i=0; i<currentItems.length; i++){
        // console.log(currentItems[i].item_id)
        // console.log(item_id)
        if(currentItems[i].item_id == item_id){
            if(currentItems[i].stock_quantity >= stock_quantity){
                newQuantity = currentItems[i].stock_quantity - stock_quantity;
                available = true;
                updateStock();
                totalOrder();
            }else{
                console.log("Insufficient quantity to allow sale.");
                available = false;
                connection.end();
            }
        }
    }
}

function updateStock(){
    connection.query("UPDATE products SET ? WHERE ?", [
        {
        stock_quantity: newQuantity
        },
        {
        item_id: item_id
        }
    ])
    connection.end()   
}

function totalOrder(){
    for (i=0; i<currentItems.length; i++){
        if (currentItems[i].item_id == item_id){
            var arrayIndex = i
        }
    }
    total = stock_quantity * currentItems[arrayIndex].price
    console.log("Your total is: $" + total)
}
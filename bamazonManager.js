var mysql = require("mysql")
var inquirer = require("inquirer")
var action;
var product_name;
var department_name;
var price;
var stock_quantity;


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

//need to make sure I add a connection.end()

inquirer.prompt([
    {
        type: "list",
        message: "What do you want to do today?",
        name: "managerAction",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
]).then(function(inquirerResponse){
    action = inquirerResponse.managerAction;
    console.log(action);
    if (action === "View Products for Sale"){
        pullItems();
        connection.end();
    }
    if (action === "View Low Inventory"){
        lowInventory();
        connection.end();
    }
    if (action === "Add to Inventory"){
        addInventory()
    }
    
})


function pullItems(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        currentItems = res
        console.log(currentItems);
        // questions()
        // connection.end();
    })
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err,res){
        console.log(res)
    })
}

function addInventory(){
    inquirer.prompt([
        {
            type: "input",
            message: "What's the item's product_name?",
            name: "product_name"
        },
        {
            type: "input",
            message: "What department_name is the product in?",
            name: "department_name"
        },
        {
            type: "input",
            message: "What is the product's price?",
            name: "price"
        },
        {
            type: "input",
            message: "What's the stock_quantity of the product?",
            name: "stock_quantity"
        }
    ]).then(function(inquirerResponse){
        product_name = inquirerResponse.product_name;
        console.log(product_name)
        department_name = inquirerResponse.department_name;
        console.log(department_name)
        price = inquirerResponse.price;
        console.log(price)
        stock_quantity = inquirerResponse.stock_quantity;
        console.log(stock_quantity)
        connection.query("INSERT INTO products SET ?", {product_name: product_name, department_name: department_name, price: price, stock_quantity: stock_quantity}, function(err, res){
                if (err) {
                    console.log(err)
                }
            }
        )
        connection.end();
    })
}

// VALUES(?, ?, ?, ?)", [
//     {
//         product_name: inquirerResponse.product_name
//     },
//     {
//         department_name: inquirerResponse.department_name
//     },
//     {
//         price: inquirerResponse.price
//     },
//     {
//         stock_quantity: inquirerResponse.stock_quantity
//     }
// ])
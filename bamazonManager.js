var mysql = require("mysql")
var inquirer = require("inquirer")
var action;
var product_name;
var department_name;
var price;
var stock_quantity;
var items;
var currentItems;
var addInventoryItems = [];
var addInventoryStock = [];
var updatedStock_Quantity;


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
    if (action === "Add New Product"){
        addNewProduct()
    }
})


function pullItems(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        currentItems = res;
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
        // questions()
        // connection.end();
    })
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err,res){
        currentItems = res;
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
    })
}

function addInventory(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        currentItems = res;
        updateInventory()
    })
}

function updateInventory(){
    for (i=0; i<currentItems.length; i++){
        addInventoryItems.push(currentItems[i].product_name)
        addInventoryStock.push(currentItems[i].stock_quantity)
        console.log("test" + i)
    }
    console.log(addInventoryItems);
    console.log(addInventoryStock);

    inquirer.prompt([
        {
            type: "list",
            message: "What product do you want to add stock_quantity to?",
            name: "product_name",
            choices: addInventoryItems
        },
        {
            type: "input",
            message: "How many items do you want to add?",
            name: "stock_quantity"
        }
    ]).then(function(inquirerResponse){
        var arrayIndex = addInventoryItems.indexOf(inquirerResponse.product_name);
        updatedStock_Quantity = addInventoryStock[arrayIndex] + parseInt(inquirerResponse.stock_quantity);
        connection.query("UPDATE products SET ? WHERE ?", [
            {
            stock_quantity: updatedStock_Quantity
            },
            {
            product_name: inquirerResponse.product_name
            }
        ])
        console.log("You've added " + inquirerResponse.stock_quantity + " items to the previous " + addInventoryStock[arrayIndex] + " " + inquirerResponse.product_name + " in stock, giving a new total of " + updatedStock_Quantity + " " + inquirerResponse.product_name + " in stock")
        // console.log(inquirerResponse.stock_quantity)
        // console.log(inquirerResponse.product_name)
        connection.end();
    })
}

function addNewProduct(){
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
        console.log("You've added a new product: ")
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
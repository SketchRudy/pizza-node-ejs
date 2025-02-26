//Import Libraries
import express from 'express';
import mariadb from 'mariadb';
import { validateForm } from './services/validation.js';

//Define our database credentials
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'pizza',
    port: '3306'
});

//Define function to connect to the DB
async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database!')
        return conn;
    } catch (err) {
        console.log(`Error connecting to the database ${err}`)
    }
}

//Instantiate an Express application
const app = express();

//Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//Set the view engine for our application
app.set('view engine', 'ejs');

//Serve static files from the 'public' directory
app.use(express.static('public'));

//Define a port number for our server to listen on
const PORT = 3000;

//Define a "default" route for our home page
app.get('/', (req, res) => {

    // Send our home page as a response to the client
    res.render('home');
});

//Define an admin route
app.get('/admin', async (req, res) => {

    //Connect to the database
    const conn = await connect();

    //Query the database
    const orders = await conn.query('SELECT * FROM orders')

    console.log(orders);

    res.render('order-summary', { orders });
});

//Define a "thank you" route
app.post('/thankyou', async (req, res) => {

    const order = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size
    };

    const result = validateForm(order);
    if (!result.isValid) {
        console.log(result.errors);
        res.send(result.errors);
        return;
    }

    // Connect to the database
    const conn = await connect();


    // Convert toppings to a string
    if (order.toppings){
        if (Array.isArray(order.toppings)) {
            order.toppings = order.toppings.join(",");
        }
    } else {
        order.toppings = "";
    }
         
    // Add the order to our database
    const insertQuery = await conn.query(`INSERT INTO orders (
	firstName,
    lastName,
    email,
    method,
    toppings,
    size
) VALUES (?, ?, ?, ?, ?, ?)`,
	[ order.firstName,
    order.lastname,
    order.email,
    order.method,
    order.toppings,
    order.size ]);

    // INSERT INTO tb1 (field1, field2) VALUES (?, ?)

    // Send our thank you page
    res.render('thankyou', { order });
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
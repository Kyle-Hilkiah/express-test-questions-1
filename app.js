const express = require('express');
const bodyParser = require('body-parser')
const {body, validationResult} = require('express-validator');
const session = require('express-session')

let arr = [];
const app = express();
const port = 5008;
let gr_ade;
let credential = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', "ejs")
app.use(session({
    secret: 'secret-key',
    resave:false,
    saveUninitialized: true
}));

// GET '/' route for both question. Do well to comment one 'index' form depending on the question. 
app.get('/', (req, res) =>{
    res.render('index', {error: null});
});


/**
 * Question 1 - 
    o   Add server-side validation in the POST /submit route to ensure the following:
            ▪The name field should not be empty.
            ▪The grade should be a number between 0 and 100.
            ▪If validation fails, the user should remain on the form page and see an appropriate error message.
    
    o   Store the submitted name and grade in an array after passing validation.
 */

/*
    app.post("/submit",
        //express validator
        body('name').notEmpty(),
        body('grade').isNumeric().isLength({max: 100}),
        //call back function to handle the post request only if there are no validation error
        (req, res) =>{ 
            const {name, grade} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                //return res.status(400).json({errors: errors.array() });
                return res.render('index', {error: 'Invalid input. Either Name field Is Empty Or Grade is above 100.'})
            }else{
                //storing name and grades in an array after validation 
                arr.push({name, grade});
                return res.render('index', {error: null});
            }
    });
*/

/**
 * Create a new route (/results) that retrieves and displays the list of all submitted names and grades in an HTML table using EJS.
    Bonus:
        •Modify the /results route to show grades in letter format (A, B, C, D, E, F) based on the provided grading scale:
            o   80-100: A
            o   70-79: B
            o   60-69: C
            o   50-59: D
            o   40-49: E
            o   Below 40: F
 */

/*      
    app.get('/results', (req,res) => {
        let html = `<h1>Student Information</h1><ul>`;
        arr.forEach(list => {
            console.log("Student entry:", list);
            if(list.grade <40){
                gr_ade = 'F';
            }else if(list.grade >= 40 && list.grade <= 49){
                gr_ade = 'E';
            }else if(list.grade >= 50 && list.grade <= 59){
                gr_ade = 'D';
            }else if(list.grade >= 60 && list.grade <= 69){
                gr_ade = 'C';
        }else if(list.grade >= 70 && list.grade <= 79){
                gr_ade = 'B';
        }else{
                gr_ade = 'A';
        }
            html += `<li>${list.name} :  ${gr_ade}</li>`;
        });
        html += '</ul>';
        res.send(html);
    });
*/

//____________________________________________________________________________________________________________________

/**
 * Question 2
 * Registration Route (/register):
        ▪Create a GET route to display the registration form (fields: username, password, confirm password).
        ▪Create a POST route that validates the form input:
        ▪Check that the username is unique.
        ▪Check that the password and confirm password match.
        ▪Hash the password using bcrypt and store it in the database (or array).
        ▪If validation fails, show an appropriate error message on the same page.
 */

app.post('/register', (req, res) => {
    const {username, password, confirmed } = req.body;
    //comparing the about to be stored username to previous username to avoid repetition
            if(credential.find(element => element.username === username)){
                return res.render('index', {error: 'Username exist already.'});
            }else{
                if(password !== confirmed){
                    return res.render('index', {error: 'Password does not match confirm password'});
                }else{
                    credential.push({username, password});
                    credential.forEach(element=>{
                        console.log(element.username + 'and ' + element.password + "\n");
                    });
                    return res.render('login', {error: null});
                }
            }
        });


/**
 *  Login Route (/login):
        ▪Create a GET route to display the login form (fields: username, password).
        ▪Create a POST route to authenticate users:
        ▪Check if the username exists.
        ▪Use bcrypt to compare the hashed password with the entered password.
        ▪If authentication is successful, redirect the user to a welcome page.
        ▪If authentication fails, show an error message on the same page.
 */
app.get('/login', (req, res) =>{
    return res.render('login', {error: null});
});

app.post('/authenticate', (req, res) => {
    const {username, password} = req.body;
    const user = credential.find(element => element.username === username);
    if (user){
        if(user.password === password){
            req.session.user = user;
            res.redirect('/welcome');
        }else{
            res.render('login', {error: 'Incorrect password!'})
        }
    }else{
        res.render('login', {error: 'User don\'t exist.'});
    }
});

/**
 *  Welcome Route (/welcome):
        ▪   After a successful login, display a welcome page with a message like "Welcome, [username]!".
    c.Bonus:
        o   Implement a logout feature that clears the session data and redirects to the login page.
 */

app.get('/welcome', (req, res) => {
    if(!req.session.user){
        return res.redirect('/login');
    }else{
        return res.render('welcome', {username : req.session.user.username});
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect('/login');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
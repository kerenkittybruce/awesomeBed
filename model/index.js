// Importing Database Connection From Config Folder

db = require("../config");

// Importing Bcrypt module

let { hash, compare, hashSync } = require("bcrypt");

//

let { createToken } = require("../middleware/AuthenticatedUser");

// User class

class User {

    // Login

    login(req, res) {
        const {EmailAdd, UserPassword} = req.body;
        const strQry = 
        `
        SELECT FirstName, LastName, Gender, EmailAdd, UserPassword, UserRole, UserProfile
        FROM Users
        WHERE EmailAdd = '${EmailAdd}';
        `;
        db.query(strQry, async (err, data)=>{
            if(err) throw err;
            if((!data.length) || (data == null)) {
                res.status(401).json({err: 
                    "You provide a wrong email address"});
            }else {
                await compare(UserPassword, 
                    data[0].UserPassword, 
                    (cErr, cResult)=> {
                        if(cErr) throw cErr;
                        // Create a token
                        const jwToken = 
                        createToken(
                            {
                                EmailAdd, UserPassword 
                            }
                        );
                        // Saving
                        res.cookie('LegitUser',
                        jwToken, {
                            maxAge: 3600000,
                            httpOnly: true
                        })
                        if(cResult) {
                            res.status(200).json({
                                msg: 'Logged in',
                                jwToken,
                                result: data[0]
                            })
                        }else {
                            res.status(401).json({
                                err: 'You entered an invalid password or did not register. '
                            })
                        }
                    })
            }
        })     
    }

    // Fetch all users

    fetchUsers (req, res) {
        const strQry =
        `
        SELECT userID, FirstName, LastName, Gender, EmailAdd, UserRole, UserProfile
        FROM users;
        `

        db.query(strQry, (err, data)) => {
            if(err) throw err;
            else res.status(200).json({results: data})
        };
    }

    // Fetch single user

    fetchUser (req, res) {
        const strQry =
        `
        SELECT userID, FirstName, LastName, Gender, EmailAdd, UserRole, UserProfile
        FROM users
        WHERE userID = ?;
        `

        db.query(strQry, [req.params.id], (err, data)) => {
            if(err) throw err;
            else res.status(200).json({result: data})
        };
    }

    // Create User

    async createUser(req, res) {
        // Payload
        let detail = req.body;
        // Hashing user password
        detail.userPass = await 
        hash(detail.userPass, 15);
        // This information will be used for authentication.
        let user = {
            emailAdd: detail.emailAdd,
            userPass: detail.userPass
        }
        // sql query
        const strQry =
        `INSERT INTO Users
        SET ?;`;
        db.query(strQry, [detail], (err)=> {
            if(err) {
                res.status(401).json({err});
            }else {
                // Create a token
                const jwToken = createToken(user);
                // This token will be saved in the cookie. 
                // The duration is in milliseconds.
                res.cookie("LegitUser", jwToken, {
                    maxAge: 3600000,
                    httpOnly: true
                });
                res.status(200).json({msg: "A user record was saved."})
            }
        })    
    }

    // Update User

    updateUser(req, res) {
        let data = req.body;
        if(data.userPass !== null || 
            data.userPass !== undefined)
            data.userPass = hashSync(data.userPass, 15);
        const strQry = 
        `
        UPDATE Users
        SET ?
        WHERE userID = ?;
        `;
        //db
        db.query(strQry,[data, req.params.id], 
            (err)=>{
            if(err) throw err;
            res.status(200).json( {msg: 
                "A row was affected"} );
        })    
    }

    // Delete User

    deleteUser(req, res) {
        const strQry = 
        `
        DELETE FROM Users
        WHERE userID = ?;
        `;
        //db
        db.query(strQry,[req.params.id], 
            (err)=>{
            if(err) throw err;
            res.status(200).json( {msg: 
                "A record was removed from a database"} );
        })    
    }
}

// Product
class Product {
    fetchProducts(req, res) {
        const strQry = `SELECT id, ProdName, ProdDescription, 
        levels, Price, ProdQuantity, ImgURL
        FROM products;`;
        db.query(strQry, (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });
    }
    fetchProduct(req, res) {
        const strQry = 
        `
        SELECT id, ProdName, ProdDescription, 
        Category, Price, ProdQuantity, ImgURL
        FROM products
        WHERE id = ?;
        
        `;
        db.query(strQry, [req.params.id], (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });

    }
    addProduct(req, res) {
        const strQry = 
        `
        INSERT INTO Products
        SET ?;
        `;
        db.query(strQry,[req.body],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to insert a new record."});
                }else {
                    res.status(200).json({msg: "Product saved"});
                }
            }
        );    

    }
    updateProduct(req, res) {
        const strQry = 
        `
        UPDATE Products
        SET ?
        WHERE id = ?
        `;
        db.query(strQry,[req.body, req.params.id],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to update a record."});
                }else {
                    res.status(200).json({msg: "Product updated"});
                }
            }
        );    

    }

    deleteProduct(req, res) {
        const strQry = 
        `
        DELETE FROM Products
        WHERE id = ?;
        `;
        db.query(strQry,[req.params.id], (err)=> {
            if(err) res.status(400).json({err: "The record was not found."});
            res.status(200).json({msg: "A product was deleted."});
        })
    }
}

// Export User class

module.exports = {
    User, 
    Product
}

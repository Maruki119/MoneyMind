const express = require('express')  // Import express
const router = express.Router()     // Create express app
require('dotenv').config();      

router.use(express.json());
router.use(express.urlencoded({ extended: false }))

const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./auth')
const db = require('./db');

router.post('/create', jwtValidate, (req, res) => {
    const { user_id, account_name, balance, color_code, icon_id } = req.body;

    console.log("DATA:", req.body)

    if (req.user.UserID !== user_id) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !account_name || !balance || !color_code) {
        console.log("Please fill all fields")
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'INSERT INTO bankaccounts (user_id, account_name, balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?)',
        [user_id, account_name, balance, color_code, icon_id || null],
        (err, result) => {
            if (err) {
                console.log("Error from /create from INSERT INTO bankaccounts (user_id, account_name, balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?)");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            console.log("Bank account created")
            return res.status(201).json({ message: 'Bank account created', success: true });
        }
    )
})

router.get('/:id', jwtValidate, (req, res) => {
    console.log(req.params.id)
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM bankaccounts WHERE user_id = ? ORDER BY id', [req.params.id], (err, result) => {
            if (err) {
                console.log("Error from .get/:id from SELECT * FROM bankaccounts WHERE user_id = ? ORDER BY id");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({result, message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("From .get/:id from result.length === 0")
                console.log("Bank Account or User not found")
                return res.status(404).json({result, message: 'Bank Account or User not found', success: false });
            }

            console.log("Get Bank Account")
            return res.status(200).json({result, success: true, message: "Get Bank Account"});
        }
    )
})

router.put('/:id', jwtValidate, (req, res) => {
    const bankID = req.params.id;

    console.log("Bank ID:", bankID)

    db.query(
        'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', [bankID, req.user.UserID], (err, result) => {
            if (err) {
                console.log("Error from .put/:id from SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("From .put/:id from result.length === 0")
                console.log("Bank Account not found or Unauthorized user")
                return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
            }

            db.query(
                'UPDATE bankaccounts SET ? WHERE id = ?', [req.body, req.params.id], (err, updateResult) => {
                    if (err) {
                        console.log("Error from .put/:id from UPDATE bankaccounts SET ? WHERE id = ?");
                        console.log("Database query failed");
                        console.log("Error:", err)
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }
        
                    if (updateResult.length === 0) {
                        console.log("From .put/:id from updateResult.length === 0")
                        console.log("Bank Account not found")
                        return res.status(404).json({ message: 'Bank Account not found', success: false });
                    }
        
                    console.log("Bank Account updated")
                    return res.status(200).json({ message: 'Bank Account updated', success: true });
                }
            )
        }
    )
})

router.delete('/:id', jwtValidate, (req, res) => {
    const bankID = req.params.id;

    console.log("Bank ID:", bankID)

    db.query(
        'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', 
        [bankID, req.user.UserID], 
        (err, result) => {
            if (err) {
                console.log("Error from .delete/:id from SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("From .delete/:id from result.length === 0")
                console.log("Bank Account not found or Unauthorized user")
                return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
            }

            db.query('DELETE FROM transactions WHERE user_id = ?', [req.user.UserID], (err, result) => {
                if (err) {
                    console.log("Error from .delete/:id from DELETE FROM transactions WHERE user_id = ?");
                    console.log("Database query failed");
                    console.log("Error:", err)
                    console.error("Error deleting transactions:", err);
                    return res.status(500).json({ error: "Failed to delete transactions" });
                }
            
                db.query('DELETE FROM splitpayments WHERE account_id = ?', [bankID], (err, result) => {
                    if (err) {
                        console.log("Error from .delete/:id from DELETE FROM splitpayments WHERE account_id = ?");
                        console.log("Database query failed");
                        console.log("Error:", err)
                        console.error("Error deleting splitpayments:", err);
                        return res.status(500).json({ error: "Failed to delete splitpayments" });
                    }

                    db.query('DELETE FROM bankaccounts WHERE id = ?', [bankID], (err, deleteResult) => {
                        if (err) {
                            console.log("Error from .delete/:id from DELETE FROM bankaccounts WHERE id = ?");
                            console.log("Database query failed");
                            console.log("Error:", err)
                            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                        }
            
                        if (deleteResult.length === 0) {
                            console.log("From .delete/:id from deleteResult.length === 0")
                            console.log("Bank Account not found")
                            return res.status(404).json({ message: 'Bank Account deleted', success: false });
                        }
            
                        console.log("Bank Account deleted")
                        return res.status(200).json({deleteResult, message: 'Bank Account deleted', success: true });
                    })
                })
            })
        }
    )
})

module.exports = {
    router
}
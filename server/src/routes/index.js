const express=require('express');
const sql = require('../db/connection.js')

const router=express.Router();
router.get('/a', async (req,res) => {
    sql.query("Select * from a", function (err, data) {             
        if(err) {
            console.log("error: ", err);
            res.json({"err":err})
        }
        else{
            res.json({"corr":data})
      
        }
    });   
})


module.exports=router;

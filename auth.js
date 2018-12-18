const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');


exports.authenticate = (email, password) =>{
    return new Promise(async (resolve, reject)=>{
        try {
            //GER USER BY EMAIL
            const user = await User.findOne({email});
            // MATCH PASSWORD
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    resolve(user);
                }else{
                    //PASSWORD DIDN'T MATCH
                    reject('authentication failed');
                }
            })

        } catch (error) {
            //EMAIL NOT FOUND
            reject ('Authentication failed');
        }
    });


}

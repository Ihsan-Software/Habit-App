const User = require('../models/userModel');

exports.getUsers = async(req, res) => {
    
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            results:users.length,
            data:{
                users
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            failureTime: req.requestTime,
            message: err.message
        });
    };
}

exports.getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            results:user.length,
            data:{
                user
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            failureTime: req.requestTime,
            message: err.message
        })
    }
};

exports.createUser = async(req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            createTime:req.requestTime,
            data:{
                user: newUser
            }
        });

    }catch(err){
        res.status(400).json({
            status: 'fail',
            failureTime: req.requestTime,
            message: err.message
        })
    }
};


exports.createHabits = async(req, res) => {
    try {
        var find = false;
        result=[]
        const user = await User.findById(req.params.id);

        if (req.body.active){
            if (user.activeHabits.length > 0) {
                user.activeHabits.forEach(ele => {
                    if (ele.information.name === req.body.name) {
                        ele.information.date.push(req.requestTime);
                        ele.counter++;
                        find = true;
                    }
                    result.push(ele)
                });
            }
            
            if(!find) {
                habit={
                    information: {
                        name: req.body.name,
                        color: req.body.color,
                        logo: req.body.logo,
                        date: [req.requestTime]
                    },
                    counter: 1
                }
                user.activeHabits.push(habit);
                result.push(habit)
            }
        }

        else {
            habit={
                name: req.body.name,
                color: req.body.color,
                logo: req.body.logo
            }
            user.notAcreateHabits.push(habit)
        }

        user.activeHabits = [];
        result.forEach(ele => {
            // console.log(ele)
            user.activeHabits.push(ele);
        });

        user.save().catch((err) => {
            console.error('Error 🔥: ', err);
        });

        // console.log(user.activeHabits)
        res.status(201).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                user:user.activeHabits
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            failureTime: req.requestTime,
            message: err.message
        })
    }
};


exports.getHabits = async(req, res) => {
    try {

        const habits=[];
        const date = req.body.date.split('T')[0];
        const user = await User.findById(req.params.id);
        user.activeHabits.forEach(ele => {
            ele.information.date.forEach(dateEld => {
                if (dateEld.split('T')[0]===date)
                    habits.push(ele)
            })
        });
        res.status(201).json({
            status: 'success',
            requestTime: req.requestTime,
            result:habits.length,
            data:{
                habits
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            failureTime: req.requestTime,
            message: err.message
        })
    }
};


exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                user:null
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            failureTime: req.requestTime,
            message: err.message
        })
    }
};



const Habit = require('../models/habitModel');

exports.getHabits = async(req, res) => {
    
    try {
        const habits = await Habit.find();
        console.log(habits.active)
        console.log(habits.counter)
        res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            results:habits.length,
            data:{
                habits
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

exports.getHabit = async(req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                habit
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

exports.createHabit = async(req, res) => {
    try {
        const newHabit = await Habit.create(req.body);
        res.status(201).json({
            status: 'success',
            createTime:req.requestTime,
            data:{
                user: newHabit
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

exports.updateHabit = async(req, res) => {
    try {
        const habit = await Habit.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators:true
            });
        res.status(201).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                habit
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

exports.deleteHabit = async(req, res) => {
    try {
        const habit = await Habit.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                habit:null
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

exports.getActiveHabits = async(req, res) => {
    try {
        result = []
        const habit = await Habit.find();
        habit.forEach(ele => {
            ele.date.forEach(e => {
                if (e.split('T')[0] == req.body.date.split('T')[0]) {
                    
                    result.push(ele)
                    console.log(ele)
                }
                
            })
        });
        res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                result
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

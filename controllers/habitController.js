const Habit = require('../models/habitModel');
const catchAsync = require('../utils/CatchAsync');

exports.getHabits = catchAsync(async(req, res, next) => {
    
    const habits = await Habit.find();
    res.status(200).json({
        status: 'success',
        requestTime:req.requestTime,
        results:habits.length,
        data:{
            habits
        }
    });
});

exports.getHabit = catchAsync(async(req, res, next) => {
    const habit = await Habit.findById(req.params.id);
    if(!habit){
        return next(new AppError('No habit found with that ID', 404));
    }
        res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                habit
            }
        });
});

exports.createHabit = catchAsync(async(req, res, next) => {
    const newHabit = await Habit.create(req.body);
        res.status(201).json({
            status: 'success',
            createTime:req.requestTime,
            data:{
                habit: newHabit
            }
        });
});

exports.updateHabit =catchAsync(async(req, res, next) => {
    const habit = await Habit.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators:true
        });
        if(!habit){
            return next(new AppError('No habit found with that ID', 404));
        }
    res.status(201).json({
        status: 'success',
        requestTime:req.requestTime,
        results:habits.length,
        data:{
            habit
        }
    });
});


exports.deleteHabit = catchAsync(async(req, res, next) => {

    const habit = await Habit.findByIdAndDelete(req.params.id);
    if(!habit){
        return next(new AppError('No habit found with that ID', 404));
    }
        res.status(204).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                habit:null
            }
        });
});


exports.getActiveHabits = catchAsync(async(req, res) => {
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

});


exports.check = catchAsync(async(req, res) => {

        const habit = await Habit.find({ name: req.body.name });
        const result = await habit[0].checkProcess(habit)
        if ( result[0]) {
                const data = await result[0].getTodayHabitsProcess()
                
                res.status(200).json({
                    status: 'success',
                    requestTime:req.requestTime,
                    activeCounter: data[1].length,
                    notActiveCounter:data[0].length,
                    data: {
                        activeHabits: data[1],
                        notActiveHabits:data[0]
                        
                    }
                });
        }

});

exports.unCheck = catchAsync(async (req, res) => {

        const habit = await Habit.find({ name: req.body.name, active: true });
        const result = await habit[0].unCheckProcess(habit)

        if ( result[0]) {
            const data = await result[0].getTodayHabitsProcess()
            
            res.status(200).json({
                status: 'success',
                requestTime:req.requestTime,
                activeCounter: data[1].length,
                notActiveCounter:data[0].length,
                data: {
                    activeHabits: data[1],
                    notActiveHabits:data[0]
                    
                }
            });
    }
        
});

exports.getTodayHabits = catchAsync(async(req, res) => {


        var activeHabits = await Habit.find({ active: true });
        var notActiveHabits = await Habit.find({ active: false });
        if (activeHabits[0]) {
            const data = await activeHabits[0].getTodayHabitsProcess()
            
            res.status(200).json({
                status: 'success',
                requestTime:req.requestTime,
                activeCounter: data[1].length,
                notActiveCounter:data[0].length,
                data: {
                    activeHabits: data[1],
                    notActiveHabits:data[0]
                    
                }
            });
        }
        else {
            res.status(200).json({
                status: 'success',
                requestTime:req.requestTime,
                activeCounter: activeHabits.length,
                notActiveCounter:notActiveHabits.length,
                data: {
                    notActiveHabits
                    
                }
            });
        }

})
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
    console.log('start checkProcess')
    req.requestTime = new Date().toISOString();
    if (habit.length > 1) {

        habit.forEach(ele => {
            if (ele.active) {
                ele.counter += 1;
                ele.date.push(req.requestTime)
                ele.save().catch((err) => {
                    console.error('Error 🔥: ', err);
                });
            }
        });
        
    }
    else {

        const newHabit = await Habit.create({
            name: habit[0].name,
            icon: habit[0].icon,
            color: habit[0].color,
            counter: 1,
            active: true,
            date: req.requestTime
        });
    }


    var activeHabits = await Habit.find({ active: true });
    var notActiveHabits = await Habit.find({ active: false });
    const data = await activeHabits[0].getTodayHabitsProcess()
    if (data[1][0] && data[0][0] ) {
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
    else if (data[1].length==0 && data[0][0] ){
        console.log('11111111111111')
        data[1].push('Active Habits Is Empty')
        console.log(data[1])
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
    else if ((!data[0][0]) && data[1][0] ){
        console.log('single habittttttttttt')
        data[0].push('Not Active Habits Is Empty')
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
    console.log('start unCheckProcess')
    var tempHabit = []
    currentTime = new Date().toISOString();

    habit[0].date.forEach(ele => {
        if (ele.split('T')[0] !== currentTime.split('T')[0]) {
            tempHabit.push(ele)
        }
    })

    habit[0].date = habit[0].date.filter(item => item.split('T')[0] === currentTime.split('T')[0])

    if (habit[0].date[0] && habit[0].date[0].split('T')[0] === currentTime.split('T')[0]) {


        if (habit[0].counter > 1) {
            habit[0].date = habit[0].date.filter(item => item.split('T')[0] !== currentTime.split('T')[0])

            habit[0].counter -= 1;
            tempHabit.forEach(ele => {
                habit[0].date.push(ele)
            })
            habit[0].save().catch((err) => {
                console.error('Error 🔥: ', err);
            });

        }
        else 
            await Habit.findByIdAndDelete(habit[0]._id);
    }


    var activeHabits = await Habit.find({ active: true });
    var notActiveHabits = await Habit.find({ active: false });
    const data = await activeHabits[0].getTodayHabitsProcess()
    if (data[1][0] && data[0][0] ) {
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
    else if (data[1].length==0 && data[0][0] ){
        console.log('11111111111111')
        data[1].push('Active Habits Is Empty')
        console.log(data[1])
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
    else if ((!data[0][0]) && data[1][0] ){
        console.log('single habittttttttttt')
        data[0].push('Not Active Habits Is Empty')
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
        const data = await activeHabits[0].getTodayHabitsProcess()
        if (data[1][0] && data[0][0] ) {
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
        
        else if (data[1].length==0 && data[0][0] ){
            console.log('11111111111111')
            data[1].push('Active Habits Is Empty')
            console.log(data[1])
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
            
        else if ((!data[0][0]) && data[1][0] ){
            console.log('single habittttttttttt')
            data[0].push('Not Active Habits Is Empty')
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
})

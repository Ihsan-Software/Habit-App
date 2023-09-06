const Habit = require('../models/habitModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerController');

//CURD FUNCTIONS
exports.getHabits = factory.getAll(Habit)

exports.getHabit = factory.getOne(Habit)

exports.createHabit = factory.createOne(Habit)

exports.updateHabit = factory.updateOne(Habit)

exports.deleteHabit = factory.deleteOne(Habit)



// Other

const sendResponse = catchAsync(async(req, res, userID)=>{

    var activeHabits = await Habit.find({ active: true});
    var notActiveHabits = await Habit.find({ active: false });
    var data;
    if (activeHabits[0]) {
        data = await activeHabits[0].getTodayHabitsProcess(req, userID)
    }
    else if(notActiveHabits[0]){
        data = await notActiveHabits[0].getTodayHabitsProcess(req, userID)
    }
    else {
        return res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            data:[]
        });
    }


    return res.status(200).json({
        status: 'success',
        requestTime:req.requestTime,
        activeCounter: data[1].length,
        notActiveCounter:data[0].length,
        data: {
            activeHabits: data[1],
            notActiveHabits:data[0]        
            }
    });
})

exports.deleteMyHabit = catchAsync(async (req, res, next) => {
    
    const habit = await Habit.find({ _id: req.params.habitID, user: req.user.id });
    
    if (!habit[0]) {
        return next(new AppError('Cant find habit From This ID To Delete It...!',404));
    }

    await Habit.findByIdAndDelete(req.params.habitID);
    sendResponse(req, res, req.user.id)
})

exports.check = catchAsync(async(req, res, next) => {

    const habit = await Habit.find({ name: req.body.name, user:req.user.id});
    console.log('start checkProcess')
    console.log(habit)
    if (habit[0]) {
        if (habit.length > 1) {
            habit.forEach(ele => {
                if (ele.active) {
                    var findDate = false;
                    ele.date.forEach(eDate => {
                        if (eDate.split('T')[0] === req.requestTime.split('T')[0])
                            findDate = true
                    })
                    if (!findDate) {
                        
                        ele.counter += 1;
                        ele.date.push(req.requestTime)
                        ele.save().catch((err) => {
                            console.error('Error 🔥: ', err);
                        });
                        console.log('update date, counter:\n')
                        console.log(ele)
                    }
                    else {
                        console.log('good app dear.......')
                    }
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
                date: req.requestTime,
                user: habit[0].user
            });
        }
    }
    else {
        return next(new AppError('You Dont Have This Habit, Please Create It Then Click On Completeing', 404));
    }
    sendResponse(req, res, req.user.id)
});

exports.unCheck = catchAsync(async (req, res, next) => {

    const habit = await Habit.find({ name: req.body.name, active: true, user:req.user.id});
    if (habit[0]) {
        console.log('start unCheckProcess')
        console.log(habit)
        var tempHabit = []
        currentTime = new Date().toISOString();

        habit[0].date.forEach(ele => {
            if (ele.split('T')[0] !== currentTime.split('T')[0]) {
                tempHabit.push(ele)
            }
        })

        habit[0].date = habit[0].date.filter(item => item.split('T')[0] === currentTime.split('T')[0])

        if (habit[0].date[0]) {

            if (habit[0].counter > 1 && habit[0].date.length==1) {
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
        else {
            return next(new AppError('You Dont Have This Habit Completed, Please Complete It Then Click On Uncompleteing', 404));
        }

        sendResponse(req, res, req.user.id)
    
    }
    else {
        return next(new AppError('You Dont Have This Habit, Please Create It and Complete It and Then Click On Uncompleteing', 404));
    }
});

exports.getTodayHabits = catchAsync(async(req, res, next) => {
    sendResponse(req, res, req.user.id)
})
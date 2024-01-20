const Habit = require('../models/habitModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerController');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; 

//CURD FUNCTIONS
exports.getHabits = factory.getAll(Habit)

exports.getHabit = factory.getOne(Habit)

exports.createHabit = factory.createOne(Habit)

exports.updateHabit = factory.updateOne(Habit)

exports.deleteHabit = factory.deleteOne(Habit)



// Other

const sendResponse = catchAsync(async(req, res, userID)=>{

    var activeHabits = await Habit.find({ active: true, user: userID });
    var notActiveHabits = await Habit.find({ active: false, user: userID });
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


exports.check = catchAsync(async (req, res, next) => {
    var currentTime;

    if (req.params.checkSpecialTime && req.params.checkSpecialTime !== "empty") {
        currentTime = req.params.checkSpecialTime;
        req.params.specialTime = currentTime;
    } else {
        currentTime = req.requestTime.split("T")[0];
    }

    const habit = await Habit.find({ name: req.body.name, user: req.user.id });
    console.log("start checkProcess");
    console.log(habit);
    if (habit[0]) {
        if (habit.length > 1) {
        var findDate = false;
        habit[1].date.forEach((eDate) => {
            if (eDate.split("T")[0] === currentTime) findDate = true;
        });
        if (!findDate) {
            habit[1].counter += 1;
            habit[1].date.push(currentTime);
            habit[1].save().catch((err) => {
            console.error("Error 🔥: ", err);
            });
            console.log("update date, counter:\n");
            console.log(habit[1]);
        } else {
            console.log("cant make check again in this habit.......");
        }
        } else {
        const newHabit = await Habit.create({
            name: habit[0].name,
            icon: habit[0].icon,
            color: habit[0].color,
            counter: 1,
            active: true,
            date: currentTime,
            user: habit[0].user,
        });
        }
    } else {
        return next(
        new AppError(
            "You Dont Have This Habit, Please Create It Then Click On Completeing",
            404
        )
        );
    }

    sendResponse(req, res, req.user.id);

  // const result = await habit[0].checkProcess(habit)
  // console.log(result);
  //     if ( result[0]) {
  //             const data = await result[0].getTodayHabitsProcess()

  //             res.status(200).json({
  //                 status: 'success',
  //                 requestTime:req.requestTime,
  //                 activeCounter: data[1].length,
  //                 notActiveCounter:data[0].length,
  //                 data: {
  //                     activeHabits: data[1],
  //                     notActiveHabits:data[0]

  //                 }
  //             });
  // }
});

exports.unCheck = catchAsync(async (req, res, next) => {


    var currentTime
    
    if (req.params.unCheckHabitSpecialTime && req.params.unCheckHabitSpecialTime!=='empty') {
        currentTime = req.params.unCheckHabitSpecialTime
        req.params.specialTime = currentTime
    }
    else {
        currentTime = req.requestTime.split('T')[0];    
    }


    const habit = await Habit.find({ name: req.body.name, active: true, user:req.user.id});
    if (habit[0]) {
        console.log('start unCheckProcess')
        console.log(habit)
        var tempHabit = []


        habit[0].date.forEach(ele => {
            if (ele.split('T')[0] !== currentTime) {
                tempHabit.push(ele)
            }
        })

        habit[0].date = habit[0].date.filter(item => item.split('T')[0] === currentTime)

        if (habit[0].date[0]) {

            if (habit[0].counter > 1 && habit[0].date.length==1) {
                habit[0].date = habit[0].date.filter(item => item.split('T')[0] !== currentTime)

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

// Aggregation

exports.getDetail = catchAsync(async (req, res, next) => {
    userID = req.user.id    
    const completedDetail = await Habit.aggregate([
        {   
            $match: {
                user: new ObjectId(`${req.user.id}`)
            }
        },
        {   
            $match: { active: true}
        },
        {
            $group:{
                _id:userID,
                // Make Array With Name Value From DB
                Name: { $push: '$name' },
                // Number Of Completed
                completed_1: { $push: { $gte: ['$counter', 1] } },
                completed_10: { $push: { $gte: ['$counter', 10] } },
                completed_30: { $push: { $gte: ['$counter', 30] } },
                completed_50: { $push: { $gte: ['$counter', 50] } },
                completed_75: { $push: { $gte: ['$counter', 75] } },
                completed_100: { $push: { $gte: ['$counter', 100] } },
                completed_200: { $push: { $gte: ['$counter', 200] } },
                completed_201: { $push: { $gt: ['$counter', 200] } },
                },
                
        },
    ])
        res.status(200).json({
            status: 'success',
            requestTime: req.requestTime,
            dataLength : completedDetail.length,
            data:{
                completedDetail
            }
        });
})
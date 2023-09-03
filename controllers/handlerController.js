const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getAll = Model => catchAsync(async(req, res, next) => {
    
        const doc = await Model.find();
        res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            results:doc.length,
            data:{
                doc
            }
        });
});

exports.getOne =  (Model, populateOptions) => catchAsync(async (req, res,next)=>{
    const id = req.params.id ;
    let query = Model.findById(id)
    // if function called by Tour Model
    if (populateOptions)query = query.populate(populateOptions);
    let doc = await query
        
    if(!doc) {
        return next(new AppError('Cant find doc From This ID...!',404));
    }   
    res.status(200).json({
        status: "success",
        data:{
            doc
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const id = req.params.id ;
    const doc = await Model.create(req.body);
    if (id) {
        doc.user = id
        doc.save().catch((err) => {
            console.error('Error 🔥: ', err);
        });
    }
    res.status(200).json({
        status: "success",
        data:{
            doc
        }
    });
});


exports.deleteOne = Model => catchAsync(async (req, res,next) => {

    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if(!doc) {
        return next(new AppError('Cant find document From This ID To Delete It...!',404));
    }   
    res.status(204).json({
        status: "success",
        data:null
        
    });
});

exports.updateOne = Model => catchAsync(async (req, res,next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators: true
    });
    if(!doc) {
        return next(new AppError('Cant find document From This ID To Update It...!',404));
    }   
    res.status(200).json({
        status: "success",
        data:{
            doc
        }
    });
});
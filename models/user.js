const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String, 
        required: [true, 'Name is required'],
    },
    mail:{
        type: String, 
        required: [true, 'Mail is required'],
        unique: true
    },
    password:{
        type: String, 
        required: [true, 'Password is required'],
    },
    img:{
        type: String,
        required: false,
        default: null
    },
    role:{
        type: String, 
        required: true,
        default: 'USER_ROLE'
    },
    status:{
        type: Boolean,
        required: false, 
        default: true
    },
    google:{
        type: Boolean, 
        required: false,
        default: false
    }
});

UserSchema.methods.toJSON = function (){
    const {__v, password, _id, ... user} = this.toObject();
    user.uid = _id;
    return user;
};

module.exports=  model('User', UserSchema);
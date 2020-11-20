import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';

import { User } from '../../models/api/UserModel';

type UserDocument = mongoose.Document & User;

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    nickName: String,
    password: String,
})


userSchema.pre('save', function save(this: any, next) {
    const user = this as UserDocument;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        // tslint:disable-next-line:no-shadowed-variable
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        })
    })
})

userSchema.methods.hashPassword = function() {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
};

const userRepository = mongoose.model<UserDocument>('User', userSchema);
export default userRepository;

// const initDatas: User[] = [
//     {
//         userId: 'aaaaqqqqq',
//         nickName: 'jxh',
//         password: 'asd',
//     },
// ];

// // tslint:disable-next-line:no-unused-expression
// (async () => {
//     for (const ele of initDatas) {
//         const exist = await userRepository.findOne({ userId: ele.userId });
//         if (!exist) await new userRepository(ele).save()
//     }
// }
// )

import { Document } from 'mongoose';
export interface UserDocument extends Document {
    name: string;
    age: number;
    email: string;
    password: string;
    createdAt: Date;
}
export declare const User: import("mongoose").Model<UserDocument, {}, {}, {}, Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & UserDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any, UserDocument>;
//# sourceMappingURL=User.d.ts.map
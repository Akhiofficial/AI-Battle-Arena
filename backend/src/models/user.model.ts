import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    googleId?: string;
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: false,
        select: false 
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre<IUser>("save", async function () {
    if (!this.password || !this.isModified("password")) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = (await bcrypt.hash(this.password, salt)) as string;
    } catch (err: any) {
        throw err;
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);

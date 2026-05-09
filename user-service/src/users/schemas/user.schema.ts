import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  authId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false, default: '' })
  password: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  photo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

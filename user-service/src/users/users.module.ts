import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User, UserSchema } from './schemas/user.schema';
import { AuthGuard } from '../common/auth.guard';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
})
export class UsersModule {}

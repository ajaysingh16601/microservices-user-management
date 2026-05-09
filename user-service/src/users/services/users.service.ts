import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import axios from 'axios';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  // Find or create user in user-service DB using auth-service's _id as stable key
  private async findOrCreateUser(authUser: any): Promise<UserDocument> {
    const authId = authUser._id.toString();
    const email = authUser.email;
    
    // 1. Try finding by authId
    let user = await this.userModel.findOne({ authId });

    if (!user) {
      // 2. Fallback: Try finding by email (for users created before authId sync)
      user = await this.userModel.findOne({ email });
      
      if (user) {
        // Link the existing user record to the authId
        user.authId = authId;
        // Also sync data from auth-service if mismatch
        user.name = authUser.name;
        user.phone = authUser.phone || user.phone;
        await user.save();
      } else {
        // 3. Create new user record if not found by either
        user = await this.userModel.create({
          authId,
          name: authUser.name,
          email,
          phone: authUser.phone || '',
          password: 'synced'
        });
      }
    }
    return user;
  }

  async getProfile(authUser: any) {
    const user = await this.findOrCreateUser(authUser);
    const result = user.toObject();
    delete result.password;
    return result;
  }

  async updateProfile(authUser: any, updateProfileDto: UpdateProfileDto, token: string) {
    const authId = authUser._id.toString();
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    
    // 1. First, update the Auth Service (Source of Truth for name, email, phone)
    try {
      await axios.put(
        `${authServiceUrl}/auth/account`,
        updateProfileDto,
        { headers: { Authorization: token } }
      );
    } catch (error) {
      if (error.response && error.response.data) {
        throw new BadRequestException(error.response.data.message || 'Failed to update authentication data');
      }
      throw new BadRequestException('Auth service unavailable');
    }

    // 2. If Auth Service update succeeds, update the local User Service DB
    const user = await this.userModel.findOneAndUpdate(
      { authId },
      { $set: updateProfileDto },
      { new: true },
    ).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async changePassword(authUser: any, changePasswordDto: ChangePasswordDto, token: string) {
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    
    try {
      // Proxy the change password request to Auth Service (source of truth for credentials)
      const response = await axios.put(
        `${authServiceUrl}/auth/change-password`,
        changePasswordDto,
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new BadRequestException(error.response.data.message || 'Failed to change password');
      }
      throw new BadRequestException('Auth service unavailable');
    }
  }

  async uploadPhoto(authUser: any, filename: string) {
    const authId = authUser._id.toString();
    await this.findOrCreateUser(authUser);

    const user = await this.userModel.findOneAndUpdate(
      { authId },
      { $set: { photo: filename } },
      { new: true },
    ).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getDashboard(authUser: any) {
    const user = await this.findOrCreateUser(authUser);
    return {
      message: `Welcome ${user.name}`,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }
}

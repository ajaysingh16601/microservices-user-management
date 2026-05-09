import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, phone } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await user.save();

    // Mock welcome email (Message Queue Simulation)
    console.log(`Welcome email sent to ${email}`);

    // Generate JWT
    const token = this.generateToken(user);

    return { token, message: 'Registration successful' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT
    const token = this.generateToken(user);

    return { token };
  }

  async validateToken(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async changePassword(userId: string, changePasswordDto: any) {
    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException('New password cannot be the same as the old password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password changed successfully' };
  }

  private generateToken(user: UserDocument): string {
    const payload = { sub: user._id, email: user.email, name: user.name };
    return this.jwtService.sign(payload);
  }
}

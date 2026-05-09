import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, Put } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(200)
  async logout() {
    // JWT is stateless, so logout is handled on the client side
    return { message: 'Logged out successfully' };
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }

  @Get('validate-token')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Req() req) {
    const user = await this.authService.validateToken(req.user.userId);
    return user;
  }
}

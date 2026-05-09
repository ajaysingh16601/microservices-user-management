import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AuthGuard } from '../../common/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.getProfile(req.user);
  }

  @Put('profile')
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user, updateProfileDto);
  }

  @Put('change-password')
  async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user, changePasswordDto, req.headers.authorization);
  }

  @Post('upload-photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueName}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadPhoto(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadPhoto(req.user, file.filename);
  }

  @Get('dashboard')
  async getDashboard(@Req() req) {
    return this.usersService.getDashboard(req.user);
  }
}

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
      const response = await axios.get(`${authServiceUrl}/auth/validate-token`, {
        headers: { Authorization: authHeader },
      });

      // Attach user data to request
      request.user = response.data;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

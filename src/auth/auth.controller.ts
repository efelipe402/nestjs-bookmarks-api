import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ROUTES_API } from 'src/shared/apiRoutes';
import { ENDPOINTS } from 'src/shared/endpoints';
import { AuthDto } from './dto';

@Controller(ROUTES_API.auth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(ENDPOINTS.signin)
  async signIn(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post(ENDPOINTS.signup)
  async singUp(@Body() dto: AuthDto) {
    return this.authService.sigunUp(dto);
  }
}

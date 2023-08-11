import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ROUTES_API } from '../shared/apiRoutes';
import { ENDPOINTS } from '../shared/endpoints';
import { AuthDto } from './dto';

@Controller(ROUTES_API.auth)
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post(ENDPOINTS.signin)
  async signIn(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post(ENDPOINTS.signup)
  async singUp(@Body() dto: AuthDto) {
    return this.authService.sigunUp(dto);
  }
}

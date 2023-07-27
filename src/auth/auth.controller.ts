import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ROUTES_API } from 'src/shared/apiRoutes';
import { ENDPOINTS } from 'src/shared/endpoints';

@Controller(ROUTES_API.auth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(ENDPOINTS.signin)
  signIn() {

    return 'Signing'
  }
  @Post(ENDPOINTS.signup)
  singUp() {
    return 'Signing up'
  }
}

import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ROUTES_API } from '../shared/apiRoutes';
import { ENDPOINTS } from '../shared/endpoints';

@UseGuards(JwtGuard)
@Controller(ROUTES_API.users)
export class UserController {
  @Get(ENDPOINTS.me)
  getMe(@GetUser() user: User) {
    return user;
  }
}

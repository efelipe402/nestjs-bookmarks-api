import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ROUTES_API } from 'src/shared/apiRoutes';
import { ENDPOINTS } from 'src/shared/endpoints';

@UseGuards(JwtGuard)
@Controller(ROUTES_API.users)
export class UserController {
  @Get(ENDPOINTS.me)
  getMe(@GetUser() user: User) {
    return user;
  }
}

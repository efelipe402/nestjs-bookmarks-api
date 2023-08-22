import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ROUTES_API } from '../shared/apiRoutes';
import { ENDPOINTS } from '../shared/endpoints';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller(ROUTES_API.users)
export class UserController {
  constructor(private userSvc: UserService) {}
  @Get(ENDPOINTS.me)
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    console.log(userId);
    return this.userSvc.editUser(userId, dto);
  }
}

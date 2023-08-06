import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  AUTH_CODES,
  AUTH_MESSAGES,
} from 'src/shared/constants';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prismaSvc: PrismaService) {}
  async login(dto: AuthDto) {
    const { email, password } = dto;

    const user =
      await this.prismaSvc.user.findUnique({
        where: {
          email: email,
        },
      });

    if (!user)
      throw new ForbiddenException(
        AUTH_MESSAGES.INCORRECT_CREDENTIALS,
      );

    const pwMatches = await argon.verify(
      user.hash,
      password,
    );

    if (!pwMatches)
      throw new ForbiddenException(
        AUTH_MESSAGES.INCORRECT_CREDENTIALS,
      );

    delete user.hash;
    return user;
  }
  async sigunUp(dto: AuthDto) {
    try {
      const { email, password } = dto;
      const hash = await argon.hash(password);
      const user =
        await this.prismaSvc.user.create({
          data: {
            email,
            hash,
          },
        });
      delete user.hash;
      return user;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (
          error.code === AUTH_CODES.EMAIL_TAKEN
        ) {
          throw new ForbiddenException(
            AUTH_MESSAGES.EMAIL_TAKEN,
          );
        }
        throw error;
      }
    }
  }
}

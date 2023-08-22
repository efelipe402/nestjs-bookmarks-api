import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  AUTH_CODES,
  AUTH_MESSAGES,
} from '../shared/constants';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prismaSvc: PrismaService,
    private jtw: JwtService,
    private config: ConfigService,
  ) {}
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

    return this.signToken(user.id, email);
  }
  async signup(dto: AuthDto) {
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

  private async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jtw.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      },
    );
    return {
      access_token: token,
    };
  }
}

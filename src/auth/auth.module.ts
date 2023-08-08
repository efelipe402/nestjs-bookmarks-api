import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})], // here you can set expiration token and custom
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

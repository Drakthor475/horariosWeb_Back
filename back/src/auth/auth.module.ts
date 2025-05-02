// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  providers: [JwtStrategy],
  exports: [AuthModule],
})
export class AuthModule {}

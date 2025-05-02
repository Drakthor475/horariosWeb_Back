import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default_secret_key', // Valor predeterminado
    });
  }

  async validate(payload: any) {
    return {
      noCuenta: payload.noCuenta,
      nivelUsuario: payload.nivelUsuario,
      sub: payload.sub,
    };
  }
}

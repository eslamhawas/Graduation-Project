import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // automatically reject expired tokens
      secretOrKey: process.env.JWT_SECRET || 'm7z4tD8wK3y6B9vX2c5fR7hE1gH4jL8pO0qW9eA6uI5nT3xV', // use your secret key
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
    // this object will be available in req.user
  }
}

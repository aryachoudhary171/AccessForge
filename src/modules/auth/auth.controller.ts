// auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // STEP 1
  @Post('register/init')
  registerInit(@Body() body: any) {
    return this.authService.registerInit(body.name, body.email);
  }

  // STEP 2
  @Post('register/verify')
  verify(@Body() body: any) {
    return this.authService.verifyOtp(body.email, body.otp);
  }

  // STEP 3
  @Post('register/complete')
  complete(@Body() body: any) {
    return this.authService.completeRegister(
      body.email,
      body.password,
      body.confirmPassword,
    );
  }

  // LOGIN
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
}
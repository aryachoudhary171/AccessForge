// auth.service.ts


import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from './mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // ============================
  // 1. REGISTER INIT (SEND OTP)
  // ============================
async registerInit(name: string, email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const defaultRole = await this.usersService.getRoleByName('Viewer');

  if (!defaultRole) {
    throw new BadRequestException('Default role (Viewer) not found');
  }

  await this.usersService.upsertByEmail(email, {
    name,
    email,
    role: defaultRole._id, 
    otp,
    otpExpires: new Date(Date.now() + 5 * 60 * 1000),
    isEmailVerified: false,
  });

  await this.mailService.sendOtp(email, otp);

  return { message: 'OTP sent successfully to email' };
}  // ============================
  // 2. VERIFY OTP
  // ============================
  async verifyOtp(email: string, otp: string) {
  const user = await this.usersService.findByEmail(email);

  if (!user) throw new BadRequestException('User not found');

  if (user.otp !== otp) {
    throw new BadRequestException('Invalid OTP');
  }

  if (user.otpExpires && user.otpExpires < new Date()) {
    throw new BadRequestException('OTP expired');
  }

  await this.usersService.updateByEmail(email, {
    isEmailVerified: true,
    otp: null,
    otpExpires: null,
  });

  return { message: 'Email verified successfully' };
}

  // ============================
  // 3. COMPLETE REGISTER (PASSWORD)
  // ============================
  async completeRegister(email: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new BadRequestException('Weak password');
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) throw new BadRequestException('User not found');

    if (!user.isEmailVerified) {
      throw new BadRequestException('Email not verified');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return { message: 'User registered successfully' };
  }

  // ============================
  // LOGIN
  // ============================
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

async login(email: string, password: string) {
  const user = await this.validateUser(email, password);

  const userWithRole = await this.usersService.findByEmail(email);
  

  if (!userWithRole) {
    throw new UnauthorizedException('User not found');
  }

  const role = userWithRole.role as any;

  console.log('ROLE:', role);
  console.log('PERMISSIONS:', role?.permissions);

  const payload = {
    sub: user._id,
    role: role?.name,
    roleName: role?.name,
    permissions: role?.permissions?.map((p: any) => p.name) || [],
  };

  return {
    access_token: this.jwtService.sign(payload),
  };
}}
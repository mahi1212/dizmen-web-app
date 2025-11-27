import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ResponseUtil, ApiResponse } from '../common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<ApiResponse> {
    const user = await this.userService.getUserByEmail(registerDto.email);
    if (user) {
      return ResponseUtil.error('User already exists', 'Email is already registered');
    }

    const password = registerDto.password;
    const hash = await bcrypt.hash(
      password,
      this.configService.bcrypt.saltRounds,
    );

    const newUser = await this.userService.createUser({
      ...registerDto,
      password: hash,
    });

    if (!newUser) {
      return ResponseUtil.error('Failed to create user', 'Database error occurred');
    }

    // Generate JWT token
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return ResponseUtil.created('User created successfully', {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        is_completed_profile: newUser.is_completed_profile,
        completed_profile_step: newUser.completed_profile_step,
      },
      access_token,
    });
  }

  async login(loginDto: LoginDto): Promise<ApiResponse> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      return ResponseUtil.unauthorized('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      return ResponseUtil.unauthorized('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return ResponseUtil.success('Login successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token,
    });
  }
}

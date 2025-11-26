import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Role } from 'generated/prisma/client';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: RegisterDto) {

    return await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        role: createUserDto.role as Role,
        is_completed_profile: createUserDto.is_completed_profile,
        completed_profile_step: createUserDto.completed_profile_step
      }
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: email
        }
      })

      return user || null

    } catch (error) {
      throw error;
    }
  }
}

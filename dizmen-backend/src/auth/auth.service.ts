import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService){}
    

    async register(registerDto: RegisterDto){
        /* 
        1. Check email exists 
        2. Hash the password
        3. Create the user
        4. Generate JWT token 
        5. Return the user and the token
         */
        console.log(process.env.DATABASE_URL, 'Nai ');

        const user = await this.userService.getUserByEmail(registerDto.email);
        return user;
    }
}

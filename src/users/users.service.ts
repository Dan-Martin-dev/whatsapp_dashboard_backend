import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/users-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/users-signin.dto';
import { sign } from 'jsonwebtoken';
import { Roles } from 'src/utility/common/users-role.enum';
import * as dotenv from 'dotenv';
dotenv.config();
import { TokenBlacklistService } from 'src/token-blacklist/token-blacklist.service';

// app business logic
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private tokenBlacklistService: TokenBlacklistService, // Inject the blacklist service
  ) {}

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if (userExists) throw new BadRequestException('Email is not available');

    userSignUpDto.password = await hash(userSignUpDto.password, 12);
    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);

    delete user.password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto) {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();

    if (!userExists) throw new BadRequestException('User dont exist.');

    const matchPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );

    if (!matchPassword) throw new BadRequestException('Passwords dont match.');

    delete userExists.password;
    return userExists;
  }

  async logout(token: string): Promise<{ message: string }> {
    this.tokenBlacklistService.addToken(token); // Add token to blacklist
    return { message: 'Logout successful.' };
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  /* function that generates a JWTtoken for the user */
  async accessToken(user: UserEntity) {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found.');
    return user;
  }

  async makeAdmin(userId: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    if (!user.roles.includes(Roles.ADMIN)) {
      user.roles.push(Roles.ADMIN); // Agregar el rol ADMIN si no lo tiene
    }

    return this.usersRepository.save(user); // Guardar el usuario con el nuevo rol
  }
}

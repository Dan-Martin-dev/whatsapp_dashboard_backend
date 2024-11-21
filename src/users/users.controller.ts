import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/users-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/users-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guards';
import { Roles } from 'src/utility/common/users-role.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint de prueba
  @Get('test')
  async testEndpoint(): Promise<{ message: string }> {
    return { message: 'Test endpoint working!' };
  }

  //@AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Post('signup')
  async signup(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signup(userSignUpDto) };
  }

  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto) {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
  }

  @Post('logout')
  async logout(@Req() request): Promise<{ message: string }> {
    const token = request.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
      throw new BadRequestException('No token provided.');
    }
    return this.usersService.logout(token); // Call the logout method
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Patch(':id/make-admin')
  async makeAdmin(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.makeAdmin(id);
  }
}

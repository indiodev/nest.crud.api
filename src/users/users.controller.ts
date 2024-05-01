import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		const user = await this.usersService.findBy({
			email: createUserDto.email,
		});

		if (user) throw new BadRequestException('User already exists');

		return this.usersService.create(createUserDto);
	}

	@Get()
	findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
		const user = await this.usersService.findBy({ id });

		if (!user) throw new NotFoundException('User not found');

		return user;
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User> {
		return this.usersService.update({ id, ...updateUserDto });
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		return this.usersService.remove(id);
	}
}

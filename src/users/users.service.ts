import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma.service';

import type { CreateUserDto } from './dto/create-user.dto';
import type { FindUserDto } from './dto/find-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = await this.prisma.user.create({
			data: createUserDto,
		});

		return user;
	}

	async findAll(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async findBy(payload: FindUserDto): Promise<User | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				OR: [
					{
						email: payload.email,
					},
					{
						id: payload.id,
					},
				],
			},
		});

		if (!user) return null;

		return user;
	}

	async update({ id, ...payload }: UpdateUserDto): Promise<User> {
		const user = await this.prisma.user.update({
			data: payload,
			where: {
				id,
			},
		});

		return user;
	}

	async remove(id: number): Promise<void> {
		await this.prisma.user.delete({
			where: {
				id,
			},
		});
	}
}

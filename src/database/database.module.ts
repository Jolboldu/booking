import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dirname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'username',
      password: 'password',
      database: 'database',
      entities: [dirname(__dirname) + '/**/*.entity.{ts,js}'],
      synchronize: true,
      logging: true,
      migrationsRun: false,
      migrations: [__dirname + '/migrations/*.{ts,js}'],
    }),
  ],
})
export class DatabaseModule {}

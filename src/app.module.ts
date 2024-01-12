import { Module } from '@nestjs/common';
import { EventModule } from './event/events.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [EventModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

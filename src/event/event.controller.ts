import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { EventEntity } from './entities/event.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  createOne(@Body() data: CreateEventDto): Promise<EventEntity> {
    return this.eventService.book(data);
  }

  @Delete(':id')
  deleteOne(@Param() conditions: { id: number }): Promise<boolean> {
    return this.eventService.deleteOne(conditions.id);
  }

  @Get()
  getAll(): Promise<EventEntity[]> {
    return this.eventService.getAll();
  }
}

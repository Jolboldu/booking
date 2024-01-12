import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/createEvent.dto';
import { ErrorTypeEnum } from './errors';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  public async book(data: CreateEventDto): Promise<EventEntity> {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const currentDate = new Date();

    if (startDate > endDate)
      throw new ConflictException(ErrorTypeEnum.CANNOT_BOOK_IN_PAST);

    if (startDate <= currentDate || endDate <= currentDate)
      throw new ConflictException(ErrorTypeEnum.CANNOT_BOOK_IN_PAST);

    return this.createOne(data);
  }

  public async createOne(data: CreateEventDto): Promise<EventEntity> {
    // Phantom inconsistency, need to use SERIALIZABLE isolation
    return await this.eventRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const possibleEvent = await transactionalEntityManager.exists(
          EventEntity,
          {
            where: { name: data.name },
          },
        );
        if (possibleEvent)
          throw new ConflictException(ErrorTypeEnum.NAME_ALREADY_TAKEN);

        const count = await transactionalEntityManager
          .createQueryBuilder(EventEntity, 'e')
          .where('(e.startDate <= :endDate AND e.endDate >= :startDate)', {
            startDate: data.startDate,
            endDate: data.endDate,
          })
          .getCount();
        if (count !== 0)
          throw new ConflictException(
            ErrorTypeEnum.DATE_INTERVAL_ALREADY_BOOKED,
          );

        const event = transactionalEntityManager.create(EventEntity, {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
        });
        const savedEvent = transactionalEntityManager.save(event);
        return savedEvent;
      },
    );
  }

  public async getAll(): Promise<EventEntity[]> {
    return this.eventRepository.find({});
  }

  public async deleteOne(id: number): Promise<boolean> {
    try {
      await this.eventRepository.delete({ id });
      return true;
    } catch (e) {
      return false;
    }
  }
}

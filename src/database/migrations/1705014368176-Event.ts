import { MigrationInterface, QueryRunner } from 'typeorm';
import { EventEntity } from '../../event/entities/event.entity';
import { events } from './events.data';

export class Event1705014368176 implements MigrationInterface {
  public async up({ connection }: QueryRunner): Promise<void> {
    const eventEntityRepository = connection.getRepository(EventEntity);
    await eventEntityRepository.save(events);
  }

  public async down({ connection }: QueryRunner): Promise<void> {
    await connection
      .getRepository(EventEntity)
      .delete(events.map(({ id }) => id));
  }
}

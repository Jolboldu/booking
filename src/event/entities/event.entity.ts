import { Entity, Column, PrimaryGeneratedColumn, Check } from 'typeorm';

@Entity('events')
@Check(`
  "startDate" <= "endDate" AND "startDate" >= CURRENT_DATE AND "endDate" >= CURRENT_DATE
`)
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  name: string;

  @Column({ type: 'date', unique: true })
  startDate: string;

  @Column({ type: 'date', unique: true })
  endDate: string;
}

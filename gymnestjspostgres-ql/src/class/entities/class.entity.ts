// src/class/entities/class.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  classname: string;

  @Column({ unique: true })
  code: string;

  @Column({})
  classday: string;

  @Column({})
  classtime: string;

  @Column({})
  classlevel: string;

  @Column({})
  dateBegin: Date;

  @Column({})
  session_time: number;

  @Column({})
  price: number;

  @Column({})
  trainer: string;

  @Column({})
  key_benefits: string;

  @Column({})
  expert_trainer: string;

  @Column({})
  class_overview: string;

  @Column({})
  why_matters: string;

  @Column({})
  image: string;

  @Column({})
  dateEndClass: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

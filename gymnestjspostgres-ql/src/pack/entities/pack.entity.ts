// src/pack/entities/pack.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  nameplan: string;

  @Column({})
  trialdays: number;

  @Column({})
  description: string;

  @Column({})
  features: string;

  @Column({})
  timedays: number;

  @Column({})
  cost: number;

  @Column({ unique: true })
  code: string;

  @Column({})
  status: string;

  @Column({})
  imageUser: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

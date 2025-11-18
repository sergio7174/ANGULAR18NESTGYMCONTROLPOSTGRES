// src/staff/entities/staff.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  age: number;

  @Column({})
  id_card: string;

  @Column({})
  phone: string;

  @Column({})
  address: string;

  @Column({})
  gender: string;

  @Column({})
  field: string;

  @Column({})
  image: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

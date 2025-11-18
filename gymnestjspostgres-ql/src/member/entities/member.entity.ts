// src/member/entities/member.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  namemember: string;

  @Column({})
  client_CI: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  phone: string;

  @Column({})
  nameplan: string;

  @Column({})
  timedays: number;

  @Column({})
  cost: number;

  @Column({})
  code: string;

  @Column({})
  status: string;

  @Column({})
  leftdays: Date;

  @Column({})
  createdAt: Date;

  @Column({})
  image: string;

  @Column({})
  finishAt: Date;
}

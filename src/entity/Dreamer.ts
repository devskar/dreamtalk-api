import { Dream } from './Dream';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('dreamer')
export class Dreamer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  nickname: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn()
  dateJoined: Date;

  @OneToMany(() => Dream, (dream) => dream.author, {
    onDelete: 'CASCADE',
  })
  dreams: Dream[];

  @BeforeInsert()
  addNickname() {
    if (!this.nickname) this.nickname = this.username;
  }
}

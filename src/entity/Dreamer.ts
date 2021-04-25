import { Dream } from './Dream';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('dreamer')
export class Dreamer extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  nickname: string;

  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column()
  dateJoined: Date;

  @OneToMany((type) => Dream, (dream) => dream.author)
  dreams: Dream[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }

  @BeforeInsert()
  addDate() {
    this.dateJoined = new Date();
  }

  @BeforeInsert()
  addNickname() {
    if (!this.nickname) this.nickname = this.username;
  }
}

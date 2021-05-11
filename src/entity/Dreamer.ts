import Dream from './Dream';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

export enum DreamerPermissionLevel {
  User,
  Staff,
  Admin,
}

@Entity('dreamer')
class Dreamer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  nickname: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, select: false })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'text', select: false })
  permissionLevel: DreamerPermissionLevel;

  @CreateDateColumn()
  dateJoined: Date;

  @OneToMany(() => Dream, (dream) => dream.author)
  dreams: Dream[];

  @BeforeInsert()
  addNickname() {
    if (!this.nickname) this.nickname = this.username;
  }

  @BeforeInsert()
  setPermissionLevel() {
    if (!this.permissionLevel)
      this.permissionLevel = DreamerPermissionLevel.User;
  }
}

export default Dreamer;

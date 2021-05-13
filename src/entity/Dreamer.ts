import {
  DREAMER_NICKNAME_MAX_LENGTH,
  DREAMER_PASSWORD_MAX_LENGTH,
  DREAMER_USERNAME_MAX_LENGTH,
} from './../static/const';
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
import Comment from './Comment';
import ChildComment from './ChildComment';

export enum DreamerPermissionLevel {
  User,
  Staff,
  Admin,
}

@Entity('dreamer')
class Dreamer extends BaseEntity {
  // AUTO GENERATED COLUMNS
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dateJoined: Date;

  // VALUES
  @Column({
    type: 'varchar',
    length: DREAMER_USERNAME_MAX_LENGTH,
    unique: true,
  })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, select: false })
  email: string;

  @Column({
    type: 'text',
    select: false,
  })
  password: string;

  @Column({ type: 'text', select: false })
  permissionLevel: DreamerPermissionLevel;

  @Column({ type: 'varchar', length: DREAMER_NICKNAME_MAX_LENGTH })
  nickname: string;

  // RELATIONS
  @OneToMany(() => Dream, (dream) => dream.author)
  dreams: Dream[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => ChildComment, (childComment) => childComment.author)
  childComments: Comment[];

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

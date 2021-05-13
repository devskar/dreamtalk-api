import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { COMMENT_CONTENT_MAX_LENGTH } from '../static/const';
import ChildComment from './ChildComment';
import Dream from './Dream';
import Dreamer from './Dreamer';

@Entity('comments')
class Comment extends BaseEntity {
  // AUTO GENERATED COLUMNS
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dateCreated: Date;

  @CreateDateColumn()
  dateEdited: Date;

  // VALUES
  @Column({ type: 'varchar', length: COMMENT_CONTENT_MAX_LENGTH })
  content: string;

  // RELATIONS
  @ManyToOne(() => Dreamer, (author) => author.comments, {
    onDelete: 'CASCADE',
  })
  author: Dreamer;

  @ManyToOne(() => Dream, (dream) => dream.comments, {
    onDelete: 'CASCADE',
  })
  dream: Dream;

  @OneToMany(() => ChildComment, (childComment) => childComment.parent)
  children: ChildComment[];
}

export default Comment;

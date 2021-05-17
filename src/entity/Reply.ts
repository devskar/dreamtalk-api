import { COMMENT_CONTENT_MAX_LENGTH } from '../static/const';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Comment from './Comment';
import Dreamer from './Dreamer';

@Entity('replies')
class ChildComment extends BaseEntity {
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
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  parent: Comment;

  @ManyToOne(() => Dreamer, (author) => author.replies, {
    onDelete: 'CASCADE',
  })
  author: Dreamer;
}

export default ChildComment;

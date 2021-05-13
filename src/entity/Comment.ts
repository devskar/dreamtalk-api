import {
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Dream from './Dream';
import Dreamer from './Dreamer';

class Comment extends BaseEntity {
  // AUTO GENERATED COLUMNS
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dateCreated: Date;

  @CreateDateColumn()
  dateEdited: Date;

  // VALUES

  // RELATIONS
  @ManyToOne(() => Dreamer, (author) => author.comments, {
    onDelete: 'CASCADE',
  })
  author: Dreamer;

  @ManyToOne(() => Dream, (dream) => dream.comments, { onDelete: 'CASCADE' })
  dream: Dream;
}

export default Comment;

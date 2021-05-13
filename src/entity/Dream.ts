import {
  DREAM_CONTENT_MAX_LENGTH,
  DREAM_TITLE_MAX_LENGTH,
} from './../static/const';
import Dreamer from './Dreamer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Comment from './Comment';

@Entity('dreams')
class Dream extends BaseEntity {
  // AUTO GENERATED COLUMNS
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateEdited: Date;

  // VALUES
  @Column({ type: 'varchar', length: DREAM_TITLE_MAX_LENGTH })
  title: string;

  @Column({ type: 'varchar', length: DREAM_CONTENT_MAX_LENGTH })
  content: string;

  // RELATIONS
  @ManyToOne(() => Dreamer, (author) => author.dreams, { onDelete: 'CASCADE' })
  author: Dreamer;

  @OneToMany(() => Comment, (comment) => comment.dream)
  comments: Comment[];
}

export default Dream;

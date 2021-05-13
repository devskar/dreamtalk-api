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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateEdited: Date;

  @Column({ type: 'varchar', length: '75' })
  title: string;

  @Column({ type: 'varchar', length: '750' })
  content: string;

  @ManyToOne(() => Dreamer, (author) => author.dreams, { onDelete: 'CASCADE' })
  author: Dreamer;

  @OneToMany(() => Comment, (comment) => comment.dream)
  comments: Comment[];
}

export default Dream;

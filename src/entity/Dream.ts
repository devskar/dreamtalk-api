import { Dreamer } from './Dreamer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('dreams')
export class Dream extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Dreamer, (author) => author.dreams)
  author: Dreamer;

  @Column({ type: 'varchar', length: '75' })
  title: string;

  @Column({ type: 'varchar', length: '750' })
  content: string;

  @CreateDateColumn()
  dateCreated: Date;

  @UpdateDateColumn()
  dateEdited: Date;
}

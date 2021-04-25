import { Dreamer } from './Dreamer';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('dreams')
export class Dream extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne((type) => Dreamer, (author) => author.dreams)
  author: Dreamer;

  @Column({ type: 'varchar', length: '75' })
  title: string;

  @Column({ type: 'varchar', length: '750' })
  content: string;

  @Column()
  dateCreated: Date;

  @Column({ type: 'date', nullable: true, default: null })
  dateEdited: Date;

  @BeforeInsert()
  addValues() {
    this.id = uuidv4();
  }

  @BeforeInsert()
  addDate() {
    this.dateCreated = new Date();
  }
}

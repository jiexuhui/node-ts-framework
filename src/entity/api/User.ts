import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('account', ['account'], { unique: true })
@Entity('user', { schema: 'hjdw2' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'account', unique: true, length: 50 })
  account: string;

  @Column('varchar', { name: 'password', length: 50 })
  password: string;

  @Column('varchar', { name: 'token', length: 50 })
  token: string;

  @Column('int', { name: 'isvalid', default: () => '\'1\'' })
  isvalid: number;

  @Column('datetime', { name: 'lastLoginAt', nullable: true })
  lastLoginAt: Date | null;

  @Column('varchar', { name: 'lastIP', nullable: true, length: 50 })
  lastIp: string | null;

  @Column('timestamp', {
    name: 'ctime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  ctime: Date | null;
}

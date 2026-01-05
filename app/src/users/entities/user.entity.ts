import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Application } from '../../applications/entities/application.entity'; 
export enum UserRole {
  ADMIN = 'admin',  
  GESTOR = 'gestor', 
  CODER = 'coder',   
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string; 

  @Column({ type: 'varchar', length: 100 })
  name: string; 

  @Column({ type: 'varchar', unique: true })
  email: string; 

  @Column({ type: 'varchar', select: false }) 
  password: string; 

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CODER, 
  })
  role: UserRole; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relation: One User can have multiple Applications
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
}
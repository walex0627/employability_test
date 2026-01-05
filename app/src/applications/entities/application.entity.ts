import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancy/entities/vacancy.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  appliedAt: Date;

  // Relación: Muchas postulaciones pertenecen a un Usuario
  @ManyToOne(() => User, (user) => user.applications, { eager: true }) 
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' }) // Guardamos el ID explícitamente para validaciones fáciles
  userId: string;

  // Relación: Muchas postulaciones pertenecen a una Vacante
  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;

  @Column({ type: 'uuid' })
  vacancyId: string;
}
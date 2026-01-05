import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

export enum Modality {
  REMOTE = 'remoto',
  HYBRID = 'híbrido',
  PRESENTIAL = 'presencial',
}

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  technologies: string; // Se puede guardar como texto "Node, React" o relacionar a otra tabla si se desea

  @Column()
  seniority: string;

  @Column()
  softSkills: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: Modality,
  })
  modality: Modality;

  @Column()
  salaryRange: string;

  @Column()
  company: string;

  @Column('int')
  maxApplicants: number; // Cupo máximo [cite: 90]

  // Columna extra para control lógico (activar/inactivar vacante) [cite: 63]
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relación: Una vacante tiene muchas postulaciones
  @OneToMany(() => Application, (application) => application.vacancy)
  applications: Application[];
}
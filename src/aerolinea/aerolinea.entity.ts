/* eslint-disable prettier/prettier */
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AerolineaEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 name: string;
 
 @Column()
 fundationDate: Date;
 
 @Column()
 webside: string;
 
 @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
 @JoinTable()
 aeropuertos: AeropuertoEntity[];

}
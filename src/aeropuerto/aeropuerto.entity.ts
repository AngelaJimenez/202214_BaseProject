/* eslint-disable prettier/prettier */
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AeropuertoEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 name: string;
 
 @Column()
 code: string;
 
 @Column()
 country: string;
 
 @Column()
 city: string;

 @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
 aerolineas: AerolineaEntity[];
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from './../aerolinea/aerolinea.entity';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Module({
 imports: [TypeOrmModule.forFeature([AerolineaEntity,AeropuertoEntity])],
 providers: [AerolineaAeropuertoService],
 controllers: [AerolineaAeropuertoController],
})
export class AerolineaAeropuertoModule {}
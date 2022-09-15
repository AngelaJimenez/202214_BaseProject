import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from './../aerolinea/aerolinea.entity';
import { AerolineaService } from './../aerolinea/aerolinea.service';

@Module({
 imports: [TypeOrmModule.forFeature([AerolineaEntity])],
 providers: [AerolineaService],
})
export class AerolineaModule {}
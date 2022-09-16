import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Controller('AerolineaAeropuerto')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
   constructor(private readonly AerolineaAeropuertoService: AerolineaAeropuertoService){}

   @Post(':aerolineaId/artworks/:aeropuertoId')
   async addArtworkMuseum(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.AerolineaAeropuertoService.addAirportToAirline(aerolineaId, aeropuertoId);
   }
   @Get(':aerolineaId/artworks/:aeropuertoId')
   async findArtworkByaerolineaIdaeropuertoId(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.AerolineaAeropuertoService.findAirportsFromAirline(aerolineaId, aeropuertoId);
   }

   @Get(':aerolineaId/artworks')
   async findArtworksByaerolineaId(@Param('aerolineaId') aerolineaId: string){
       return await this.AerolineaAeropuertoService.findAirportFromAirline(aerolineaId);
   }

   @Put(':aerolineaId/artworks')
   async associateArtworksMuseum(@Body() artworksDto: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string){
       const aeropuertos = plainToInstance(AeropuertoEntity, artworksDto)
       return await this.AerolineaAeropuertoService.updateAirportsFromAirline(aerolineaId, aeropuertos);
   }

   @Delete(':aerolineaId/artworks/:aeropuertoId')
@HttpCode(204)
   async deleteArtworkMuseum(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
       return await this.AerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
   }

   
}
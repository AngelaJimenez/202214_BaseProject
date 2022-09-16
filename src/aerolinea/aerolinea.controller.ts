import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';

@Controller('aerolineas')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly AerolineaService: AerolineaService) {}

  @Get()
  async findAll() {
    return await this.AerolineaService.findAll();
  }

  @Get(':aerolineaId')
  async findOne(@Param('aerolineaId') aerolineaId: string) {
    return await this.AerolineaService.findOne(aerolineaId);
  }

  @Post()
  async create(@Body() AerolineaDto: AerolineaDto) {
    const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, AerolineaDto);
    return await this.AerolineaService.create(aerolinea);
  }

  @Put(':aerolineaId')
  async update(@Param('aerolineaId') aerolineaId: string, @Body() AerolineaDto: AerolineaDto) {
    const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, AerolineaDto);
    return await this.AerolineaService.update(aerolineaId, aerolinea);
  }

  @Delete(':aerolineaId')
  @HttpCode(204)
  async delete(@Param('aerolineaId') aerolineaId: string) {
    return await this.AerolineaService.delete(aerolineaId);
  }
}
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AeropuertoDto } from './aeropuerto.dto';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';

@Controller('aeropuertos')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly AeropuertoService: AeropuertoService) {}

  @Get()
  async findAll() {
    return await this.AeropuertoService.findAll();
  }

  @Get(':aeropuertoId')
  async findOne(@Param('aeropuertoId') aeropuertoId: string) {
    return await this.AeropuertoService.findOne(aeropuertoId);
  }

  @Post()
  async create(@Body() AeropuertoDto: AeropuertoDto) {
    const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, AeropuertoDto);
    return await this.AeropuertoService.create(aeropuerto);
  }

  @Put(':aeropuertoId')
  async update(@Param('aeropuertoId') aeropuertoId: string, @Body() AeropuertoDto: AeropuertoDto) {
    const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, AeropuertoDto);
    return await this.AeropuertoService.update(aeropuertoId, aeropuerto);
  }

  @Delete(':aeropuertoId')
  @HttpCode(204)
  async delete(@Param('aeropuertoId') aeropuertoId: string) {
    return await this.AeropuertoService.delete(aeropuertoId);
  }
}
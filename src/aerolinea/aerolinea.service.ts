import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(AerolineaEntity)
    private readonly aerolineaRository: Repository<AerolineaEntity>,
  ) {}

  async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    const currentdate = new Date();
    if(new Date(aerolinea.fundationDate)>currentdate){
  throw new BusinessLogicException(
    'The aerolinea with the given id has a date higher that the todays date',
    BusinessError.PRECONDITION_FAILED,
  );}

    return await this.aerolineaRository.save(aerolinea);
  }

  async findAll(): Promise<AerolineaEntity[]> {
    return await this.aerolineaRository.find({
      relations: ['aeropuertos'],
    });
  }

  async findOne(id: string): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = await this.aerolineaRository.findOne({
      where: { id },
      relations:  ['aeropuertos'],
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return aerolinea;
  }

  async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
    const persistedAerolinea: AerolineaEntity = await this.aerolineaRository.findOne({
      where: { id },
    });
    if (!persistedAerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );
      const currentdate = new Date();
      if(new Date(aerolinea.fundationDate)>currentdate){
    throw new BusinessLogicException(
      'The aerolinea with the given id has a date higher that the todays date',
      BusinessError.PRECONDITION_FAILED,
    );}

    return await this.aerolineaRository.save({
      ...persistedAerolinea,
      ...aerolinea,
    });
  }

  async delete(id: string) {
    const aerolinea: AerolineaEntity = await this.aerolineaRository.findOne({
      where: { id },
    });
    if (!aerolinea)
      throw new BusinessLogicException(
        'The aerolinea with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.aerolineaRository.remove(aerolinea);
  }
}

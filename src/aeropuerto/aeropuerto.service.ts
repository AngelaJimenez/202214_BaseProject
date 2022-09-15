import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRository: Repository<AeropuertoEntity>,
  ) {}

  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
   
    if(aeropuerto.code.length>3){
    throw new BusinessLogicException(
      'The aeropuerto code with the given id has more that 3 characters',
      BusinessError.PRECONDITION_FAILED,
    );}

    return await this.aeropuertoRository.save(aeropuerto);
  }

  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoRository.find({
      relations: ['aerolineas'],
    });
  }

  async findOne(id: string): Promise<AeropuertoEntity> {
    const aeropuerto: AeropuertoEntity = await this.aeropuertoRository.findOne({
      where: { id },
      relations:  ['aerolineas'],
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return aeropuerto;
  }

  async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    const persistedAeropuerto: AeropuertoEntity = await this.aeropuertoRository.findOne({
      where: { id },
    });
    if (!persistedAeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );
      if(aeropuerto.code.length>3){
        throw new BusinessLogicException(
          'The aeropuerto code with the given id has more that 3 characters',
          BusinessError.PRECONDITION_FAILED,
        );}
    
    return await this.aeropuertoRository.save({
      ...persistedAeropuerto,
      ...aeropuerto,
    });
  }

  async delete(id: string) {
    const aeropuerto: AeropuertoEntity = await this.aeropuertoRository.findOne({
      where: { id },
    });
    if (!aeropuerto)
      throw new BusinessLogicException(
        'The aeropuerto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.aeropuertoRository.remove(aeropuerto);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { Repository } from 'typeorm';

import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity} from './aeropuerto.entity';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    aeropuertoList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await repository.save({
      name: faker.lorem.words(2),
      code: faker.random.alphaNumeric(3),
      city: faker.address.city(),
      country: faker.address.country(),
      aerolineas: [],
      });
      aeropuertoList.push(aeropuerto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertoList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.name).toEqual(storedAeropuerto.name);
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: '',
      name: faker.lorem.words(2),
      code: faker.random.alphaNumeric(3),
      city: faker.address.city(),
      country: faker.address.country(),
      aerolineas: [],
    };
  
    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: newAeropuerto.id },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.name).toEqual(newAeropuerto.name);
  });

  it('create should not return a new aeropuerto with wrong code', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: '',
      name: faker.lorem.words(2),
      code: faker.random.alphaNumeric(5),
      city: faker.address.city(),
      country: faker.address.country(),
      aerolineas: [],
    };
    await expect(() => service.create(aeropuerto)).rejects.toHaveProperty(
      'message',
      'The aeropuerto code with the given id has more that 3 characters',
    );

  });



  it('update should throw an exception for an invalid precondition', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
      ...aeropuerto,
      code: faker.random.alphaNumeric(4),
    };
    await expect(() => service.update(aeropuerto.id, aeropuerto)).rejects.toHaveProperty(
      'message',
      'The aeropuerto code with the given id has more that 3 characters',
    );
  });

  it('update should modify a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto.name = 'New name';
    const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: aeropuerto.id },
    });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.name).toEqual(aeropuerto.name);
  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
      ...aeropuerto,
      name: 'New name',
    };
    await expect(() => service.update('0', aeropuerto)).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });

  it('delete should remove a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    const deletedAeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: aeropuerto.id },
    });
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid aeerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });
});

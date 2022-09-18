import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

import { Repository } from 'typeorm';

import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineaList: AerolineaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    aerolineaList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await repository.save({
        name: faker.lorem.words(2),
        description: faker.lorem.paragraph(),
        fundationDate: faker.date.past(),
        webside: faker.internet.domainName(),
        aeropuertos: [],
        });
      aerolineaList.push(aerolinea);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineaList.length);
  });

  it('findOne should return a aerolinea by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineaList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.name).toEqual(storedAerolinea.name);
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: '',
      name: faker.lorem.words(2),
      description: faker.lorem.paragraph(),
      fundationDate: faker.date.past(),
      webside: faker.internet.domainName(),
      aeropuertos: [],
    };
  
    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: newAerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.name).toEqual(newAerolinea.name);
  });

  it('create should not return a new aerolinea with wrong date', async () => {
    const aerolinea: AerolineaEntity = {
      id: '',
      name: faker.lorem.words(2),
      description: faker.lorem.paragraph(),
      fundationDate: faker.date.future(),
      webside: faker.internet.domainName(),
      aeropuertos: [],
    };
    await expect(() => service.create(aerolinea)).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id has a date higher that the todays date',
    );

  });



  it('update should throw an exception for an invalid precondition', async () => {
    let aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea = {
      ...aerolinea,
      fundationDate: faker.date.future(),
    };
    await expect(() => service.update(aerolinea.id, aerolinea)).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id has a date higher that the todays date',
    );
  });

  it('update should modify a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea.name = 'New name';
    const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updatedAerolinea).not.toBeNull();
    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: aerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.name).toEqual(aerolinea.name);
  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea = {
      ...aerolinea,
      name: 'New name',
    };
    await expect(() => service.update('0', aerolinea)).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });

  it('delete should remove a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);
    const deletedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: aerolinea.id },
    });
    expect(deletedAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aeerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertoList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AerolineaAeropuertoService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertoList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        name: faker.lorem.words(2),
        code: faker.random.alphaNumeric(5),
        city: faker.address.city(),
        country: faker.address.country(),
        });
      aeropuertoList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      name: faker.lorem.words(2),
      fundationDate: faker.date.past(),
      webside: faker.internet.domainName(),
      aeropuertos: aeropuertoList,
  });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addaeropuertoaerolinea should add an aeropuerto to a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      name: faker.lorem.words(2),
      code: faker.random.alphaNumeric(5),
      city: faker.address.city(),
      country: faker.address.country(),
    });

    const newaerolinea: AerolineaEntity = await aerolineaRepository.save({
      name: faker.lorem.words(2),
      fundationDate: faker.date.past(),
      webside: faker.internet.domainName(),
  });

    const result: AerolineaEntity = await service.addAirportToAirline(
      newaerolinea.id,
      aeropuerto.id,
    );

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].name).toBe(aeropuerto.name);
    expect(result.aeropuertos[0].code).toBe(aeropuerto.code);
    expect(result.aeropuertos[0].city).toBe(aeropuerto.city);
    expect(result.aeropuertos[0].country).toBe(aeropuerto.country);
  });

  it('addAirportToAirline should thrown exception for an invalid aeropuerto', async () => {
    const aerolinea: AerolineaEntity = await aerolineaRepository.save({
      name: faker.lorem.words(2),
      fundationDate: faker.date.past(),
      webside: faker.internet.domainName(),
  });

    await expect(() =>
      service.addAirportToAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });
  it('addAirportToAirline should throw an exception for an invalid aerolinea', async () => {
    const newaeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      name: faker.lorem.words(2),
      code: faker.random.alphaNumeric(5),
      city: faker.address.city(),
      country: faker.address.country(),
    });

    await expect(() =>
      service.addAirportToAirline('0', newaeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });
  it('findaeropuertoByaerolineaIdaeropuertoId should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    const storedaeropuerto: AeropuertoEntity =
      await service.findAirportsFromAirline(aerolinea.id, aeropuerto.id);
    expect(storedaeropuerto).not.toBeNull();
    expect(storedaeropuerto.name).toBe(aeropuerto.name);
    expect(storedaeropuerto.code).toBe(aeropuerto.code);
    expect(storedaeropuerto.city).toBe(aeropuerto.city);
    expect(storedaeropuerto.country).toBe(aeropuerto.country);
  });
  it('findAirportsFromAirline should throw an exception for an invalid aeropuerto', async () => {
    await expect(() =>
      service.findAirportsFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });
  it('findAirportsFromAirline should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await expect(() =>
      service.findAirportsFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });

  it('findAirportsFromAirline should throw an exception for an aeropuerto not associated to the aerolinea', async () => {
    const newaeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      name: faker.lorem.words(2),
      code: faker.random.alphaNumeric(5),
      city: faker.address.city(),
      country: faker.address.country(),

    });

    await expect(() =>
      service.findAirportsFromAirline(aerolinea.id, newaeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id is not associated to the aerolinea',
    );
  });

  it('findAirportFromAirline should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity[] = await service.findAirportFromAirline(
      aerolinea.id,
    );
    expect(aeropuerto.length).toBe(5);
  });
  it('findAirportFromAirline should throw an exception for an invalid aerolinea', async () => {
    await expect(() =>
      service.findAirportFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });
  it('updateAirportsFromAirline should update aeropuerto list for a aerolinea', async () => {
    const newaeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      name: faker.lorem.words(2),
      code: faker.random.alphaNumeric(5),
      city: faker.address.city(),
      country: faker.address.country(),

    });

    const updatedaerolinea: AerolineaEntity = await service.updateAirportsFromAirline(aerolinea.id, [
      newaeropuerto,
    ]);
    expect(updatedaerolinea.aeropuertos.length).toBe(1);
    expect(updatedaerolinea.aeropuertos[0].name).toBe(newaeropuerto.name);
    expect(updatedaerolinea.aeropuertos[0].code).toBe(newaeropuerto.code);
    expect(updatedaerolinea.aeropuertos[0].city).toBe(newaeropuerto.city);
    expect(updatedaerolinea.aeropuertos[0].country).toBe(newaeropuerto.country);

  });

  it('updateAirportsFromAirline should throw an exception for an invalid aerolinea', async () => {
    const newaeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      name: faker.lorem.words(2),
      code: faker.random.alphaNumeric(5),
      city: faker.address.city(),
      country: faker.address.country(),
    });

    await expect(() =>
      service.updateAirportsFromAirline('0', [newaeropuerto]),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });
  it('associateaeropuertoaerolinea should throw an exception for an invalid aeropuerto', async () => {
    const newaeropuerto: AeropuertoEntity = aeropuertoList[0];
    newaeropuerto.id = '0';

    await expect(() =>
      service.updateAirportsFromAirline(aerolinea.id, [newaeropuerto]),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });
  it('deleteAirportFromAirline should remove an aeropuerto from a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];

    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);

    const storedaerolinea: AerolineaEntity = await aerolineaRepository.findOne({
      where: { id: aerolinea.id },
      relations: ['aeropuertos'],
    });
    const deletedaeropuerto: AeropuertoEntity = storedaerolinea.aeropuertos.find(
      (a) => a.id === aeropuerto.id,
    );

    expect(deletedaeropuerto).toBeUndefined();
  });

  it('deleteAirportFromAirline should thrown an exception for an invalid aeropuerto', async () => {
    await expect(() =>
      service.deleteAirportFromAirline(aerolinea.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id was not found',
    );
  });
  it('deleteaeropuertoToaerolinea should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await expect(() =>
      service.deleteAirportFromAirline('0', aeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aerolinea with the given id was not found',
    );
  });
  it('deleteaeropuertoToaerolinea should thrown an exception for an non asocciated aeropuerto', async () => {
    const newaeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(5),
      city: faker.address.city(),
      country: faker.address.country(),

    });

    await expect(() =>
      service.deleteAirportFromAirline(aerolinea.id, newaeropuerto.id),
    ).rejects.toHaveProperty(
      'message',
      'The aeropuerto with the given id is not associated to the aerolinea',
    );
  });
});

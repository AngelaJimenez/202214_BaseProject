import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';

import { AerolineaEntity } from './aerolinea/aerolinea.entity';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaAeropuertoModule } from './aerolinea-aeropuerto/aerolinea-aeropuerto.module';
import { AerolineaModule } from './aerolinea/aerolinea.module';

@Module({
  imports: [AerolineaModule, AeropuertoModule,AerolineaAeropuertoModule,
      // TypeORM Configuration
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: `postgres`,
       
        database: 'examen1',
        entities: [
          AeropuertoEntity,
          AerolineaEntity,
        ],
        dropSchema: true,
        synchronize: true,
        keepConnectionAlive: true,
      }),
      
      
      ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

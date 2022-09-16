
import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AeropuertoDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly code: Date;
    
    @IsString()
    @IsNotEmpty()
    readonly country: Date;
    
    @IsString()
    @IsNotEmpty()
    readonly city: Date;

   }
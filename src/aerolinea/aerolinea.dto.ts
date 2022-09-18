
import {IsDate, IsDateString, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly description: string;
    
    @IsDateString()
    @IsNotEmpty()
    readonly fundationDate: Date;
    
    @IsUrl()
    @IsNotEmpty()
    readonly webside: string;
    
   }

import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsDate()
    @IsNotEmpty()
    readonly fundationDate: Date;
    
    @IsUrl()
    @IsNotEmpty()
    readonly webside: string;
    
   }
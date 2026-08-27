import { IsISO8601, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTrafficRecordDto {
    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    vehicleType: string;

    @IsInt()
    @Min(0)
    count: number;

    @IsISO8601()
    recordedAt: string;
}
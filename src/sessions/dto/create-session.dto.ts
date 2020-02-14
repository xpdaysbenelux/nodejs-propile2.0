import {
    IsString,
    IsOptional,
    Length,
    IsNotEmpty,
    IsEmail,
    Min,
    Max,
    IsInt,
} from 'class-validator';

export class CreateSessionRequest {
    @IsString()
    @IsNotEmpty()
    @Length(0, 255)
    readonly title: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(0, 255)
    readonly subTitle?: string;

    @IsEmail()
    readonly emailFirstPresenter: string;

    @IsOptional()
    @IsEmail()
    readonly emailSecondPresenter?: string;

    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(10)
    readonly xpFactor?: number;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}

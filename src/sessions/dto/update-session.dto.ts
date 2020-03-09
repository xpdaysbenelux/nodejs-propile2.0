import {
    IsString,
    Length,
    IsNotEmpty,
    IsOptional,
    IsEmail,
    IsInt,
    Min,
    Max,
    IsEnum,
    IsBoolean,
    IsUUID,
} from 'class-validator';
import {
    SessionState,
    SessionType,
    SessionTopic,
    SessionDuration,
    SessionExpierenceLevel,
} from '../constants';

export class UpdateSessionRequest {
    @IsNotEmpty()
    @IsString()
    @Length(0, 255)
    readonly title: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(0, 255)
    readonly subTitle?: string;

    @IsNotEmpty()
    @IsEmail()
    readonly emailFirstPresenter: string;

    @IsOptional()
    @IsEmail()
    readonly emailSecondPresenter?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(10)
    readonly xpFactor?: number;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsOptional()
    @IsEnum(SessionState)
    readonly sessionState?: SessionState;

    @IsOptional()
    @IsString()
    readonly shortDescription?: string;

    @IsOptional()
    @IsString()
    readonly goal?: string;

    @IsOptional()
    @IsEnum(SessionType)
    readonly type?: SessionType;

    @IsOptional()
    @IsEnum(SessionTopic)
    readonly topic?: SessionTopic;

    @IsOptional()
    @IsInt()
    readonly maxParticipants?: number;

    @IsOptional()
    @IsEnum(SessionDuration)
    readonly duration?: SessionDuration;

    @IsOptional()
    @IsBoolean()
    readonly laptopsRequired?: boolean;

    @IsOptional()
    @IsString()
    readonly otherLimitations?: string;

    @IsOptional()
    @IsUUID('4', { each: true })
    readonly personaIds?: string[];

    @IsOptional()
    @IsString()
    readonly roomSetup?: string;

    @IsOptional()
    @IsString()
    readonly neededMaterials?: string;

    @IsOptional()
    @IsEnum(SessionExpierenceLevel)
    readonly expierenceLevel?: SessionExpierenceLevel;

    @IsOptional()
    @IsString()
    readonly outline?: string;

    @IsOptional()
    @IsString()
    readonly materialDescription?: string;

    @IsOptional()
    @IsString()
    readonly materialUrl?: string;
}

export class SessionIdParam {
    @IsUUID('4')
    readonly sessionId: string;
}

import { BaseEntityResponse } from '../../_shared/dto';
import {
    SessionDuration,
    SessionExpierenceLevel,
    SessionState,
    SessionType,
    SessionTopic,
} from '../constants';

export class SessionResponse extends BaseEntityResponse {
    readonly title: string;
    readonly subTitle?: string;
    readonly firstPresenter: SessionPresenterResponse;
    readonly secondPresenter?: SessionPresenterResponse;
    readonly xpFactor?: number;
    readonly description: string;
    readonly sessionState?: SessionState;
    readonly shortDescription?: string;
    readonly goal?: string;
    readonly type?: SessionType;
    readonly topic?: SessionTopic;
    readonly maxParticipants?: number;
    readonly duration?: SessionDuration;
    readonly laptopsRequired?: boolean;
    readonly otherLimitations?: string;
    readonly intendedAudience?: SessionPersonaResponse[];
    readonly roomSetup?: string;
    readonly neededMaterials?: string;
    readonly expierenceLevel?: SessionExpierenceLevel;
    readonly outline?: string;
    readonly materialDescription?: string;
    readonly materialUrl?: string;
}

class SessionPersonaResponse {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly imageUrl: string;
}

class SessionPresenterResponse {
    readonly id: string;
    readonly email: string;
}

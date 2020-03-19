import { BaseEntityResponse } from 'src/_shared/dto';

export class ConferenceResponse extends BaseEntityResponse {
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
}

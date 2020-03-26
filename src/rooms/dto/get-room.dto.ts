import { BaseEntityResponse } from '../../_shared/dto';

export class RoomResponse extends BaseEntityResponse {
    readonly id: string;
    readonly name: string;
    readonly maxParticipants: number;
}

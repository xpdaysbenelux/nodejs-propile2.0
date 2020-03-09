import { Permissions } from '../database';

export enum UserState {
    Registering = 'REGISTERING',
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
}

export enum SortDirection {
    Ascending = 'ASC',
    Descending = 'DESC',
}

export interface IUserSession {
    userId: string;
    email: string;
    state: UserState;
    firstName?: string;
    lastName?: string;
    permissions: Permissions;
}

export enum SessionState {
    Draft = 'DRAFT',
    Canceled = 'CANCELED',
    Confirmed = 'CONFIRMED',
}

export enum SessionType {
    HandsOn = 'HANDS_ON',
    Discovery = 'DISCOVERY',
    ExperientialLearning = 'EXPERIENTIAL_LEARNING',
    ShortExperienceReport = 'SHORT_EXPERIENCE_REPORT',
    Other = 'OTHER',
}

export enum SessionTopic {
    TechnologyAndTechnique = 'TECHNOLOGY_AND_TECHNIQUE',
    TeamAndIndividual = 'TEAM_AND_INDIVIDUAL',
    ProcessAndImprovement = 'PROCESS_AND_IMPROVEMENT',
    CustomerAndPlanning = 'CUSTOMER_AND_PLANNING',
    CasesAndIntros = 'CASES_AND_INTROS',
}

export enum SessionDuration {
    HalfHour = '30',
    OneHour = '60',
    OneAndHalfHour = '90',
    TwoAndHalfHour = '150',
}

export enum SessionExpierenceLevel {
    Novice = 'NOVICE',
    Medium = 'MEDIUM',
    Expert = 'EXPERT',
}

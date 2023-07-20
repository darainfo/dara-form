import { RULES } from '../constants';

export interface ValidResult {
    name: string
    constraint: any[]
    validator?: string
}
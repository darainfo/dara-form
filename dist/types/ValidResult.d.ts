import { RULES } from '../constants';

export interface ValidResult {
    name: string
    constraint: any[]
    regexp?: string
    validator?: any
    message?: string
}
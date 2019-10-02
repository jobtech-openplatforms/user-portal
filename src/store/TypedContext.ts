import { TypedState } from '@/datatypes/TypedState';
import { MutationBase } from './MutationBase';
import { ActionBase } from './ActionBase';

export interface TypedContext {
    commit: (a: MutationBase) => void;
    dispatch: (a: ActionBase) => Promise<void>;
    getters: TypedGetters;
    state: TypedState;
}

export class TypedGetters {
    public platforms = (state: TypedState, getters: TypedGetters) => {
        () => {
            return state.connectedPlatforms;
        }
    }
}
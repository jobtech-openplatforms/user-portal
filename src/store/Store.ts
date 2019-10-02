import Vue from 'vue';
import Vuex from 'vuex';
import { TypedState } from '../datatypes/TypedState';
import { Actions } from './Actions';
import { Mutations } from './Mutations';
import { TypedGetters } from './TypedContext';

Vue.use(Vuex);

export default new Vuex.Store({
    state: new TypedState(),
    mutations: Object.getOwnPropertyNames(Mutations).reduce( // add mutations based on Mutations class def
        (acc: any, prop_name) => {
            acc[prop_name] = (state: any, mutation: any) => {
                return mutation.execute(state);
            }
            return acc;
        },
        {}
    ),
    actions: Object.getOwnPropertyNames(Actions).reduce( // add mutations based on Actions class def
        (acc: any, prop_name: string) => {
            acc[prop_name] = (state: any, action: any) => {
                return action.execute(state);
            }
            return acc;
        },
        {}
    ),
    getters: new TypedGetters() as any
});


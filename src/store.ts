import Vue from 'vue';
import Vuex from 'vuex';
import { ConnectionData } from './datatypes/ConnectionData';
import { ApplicationData } from './datatypes/ApplicationData';
import { TypedState } from './TypedState';
import { ApplicationConnectionData } from './datatypes/ApplicationConnectionData';
import { Actions } from './Actions';
import { Mutations } from './Mutations';

Vue.use(Vuex);

console.log("1", Actions);
console.log("2", Object.getOwnPropertyNames(Actions));

export default new Vuex.Store({
    state: {
        isLoggedIn: false,
        connectedPlatforms: [],
        connectedApplications: [],
    } as TypedState,
    mutations: Object.getOwnPropertyNames(Mutations).reduce( // add mutations based on Mutations class def
        (acc: any, prop_name) => {
            acc[prop_name] = (state: any, mutation: any) => {
                mutation.execute(state);
            }
            return acc;
        },
        {}
    ),
    actions: Object.getOwnPropertyNames(Actions).reduce( // add mutations based on Actions class def
        (acc: any, prop_name: string) => {
            acc[prop_name] = (state: any, action: any) => {
                action.execute(state);
            }

            return acc;
        },
        {}
    )
});


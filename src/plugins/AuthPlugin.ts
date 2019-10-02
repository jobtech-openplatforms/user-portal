import AuthService from './AuthService';

export default {
    install(vue: any) {
        const authService = new AuthService();
        vue.prototype.$auth = authService;

        vue.mixin({
            created() {
                if (this.handleLoginEvent) {
                    authService.addListener('loginEvent', this.handleLoginEvent);
                }
            },

            destroyed() {
                if (this.handleLoginEvent) {
                    authService.removeListener('loginEvent', this.handleLoginEvent);
                }
            }
        });
    }
};

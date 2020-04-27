<template>
  <div id="app">
    <div id="nav">
      <div>
        <img class="app-logo-icon" src="./assets/images/open-platforms-logo-icon.png" />
        <img
          class="app-logo-text"
          v-bind:class="{ 'mobile-invisible': isLoggedIn }"
          src="./assets/images/open-platforms-logo-text.png"
        />
      </div>
      <div>
        <button v-if="state.isChanged" v-on:click="onSave()" class="button is-primary">Save changes</button>
        <button v-if="state.isLoggedIn" class="button" v-on:click="onLogout()">Log out</button>
      </div>
    </div>

    <div id="page-container">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
@import "assets/css/styles.scss";

#nav {
  padding: 10px 20px;
  background: white;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
}

.app-logo-icon,
.app-logo-text {
  max-height: 45px;
  margin-right: 4px;
}

li {
  list-style: disc;
  margin-left: 17px;
}

.error-message {
  color: red;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store/Store";
import { ActionBase } from "./store/ActionBase";
import { TypedState } from "./datatypes/TypedState";
import ConfirmSaveModal from "./components/ConfirmSaveModal.vue";
import { Actions } from "./store/Actions";

@Component({
  components: {}
})
export default class App extends Vue {
  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;
  private state: TypedState = <TypedState>(<any>this.$store.state);

  constructor() {
    super();
  }

  get isLoggedIn() {
    return this.state.isLoggedIn;
  }

  public onSave() {
    console.log("onSave");
    this.$buefy.modal.open({
      parent: this,
      component: ConfirmSaveModal,
      hasModalCard: true
    });
  }

  public onLogout() {
    if (this.state.isChanged) {
      this.$buefy.dialog.confirm({
        message:
          "Logging out without saving, will discard any changes you've made, are you sure you want to log out?",
        confirmText: "Continue",
        cancelText: "Cancel",
        onConfirm: () => {
          this.logout();
        }
      });
    } else {
      this.logout();
    }
  }

  private logout() {
    this.dispatch(new Actions.Logout(this.$auth));
    // this.$router.push("/");
  }
}
</script>

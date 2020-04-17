<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Not logged in</p>
    </header>
    <section class="modal-card-body">
      <p>You have have been logged out, please login again.</p>
    </section>
    <footer class="modal-card-foot">
      <div class="left"></div>
      <div class="right">
        <button class="button is-primary" v-on:click="onLogin()">Login</button>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TypedState } from "../datatypes/TypedState";
import { ActionBase } from "../store/ActionBase";
import { Actions } from "../store/Actions";

@Component({})
export default class LoginNeededModal extends Vue {
  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  onLogin() {
    this.dispatch(new Actions.Login(this.$auth));
  }
}
</script>

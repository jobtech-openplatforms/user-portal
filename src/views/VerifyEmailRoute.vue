<template>
  <div class="start page-content">
    <p v-if="!isDataFetched">Loading...</p>
    <div class="login-container" v-if="isDataFetched">
      <div v-if="!isDataError">
        <h2>Your email has been verified!</h2>
        <p class="is-large">You can now return to the Open Platforms app.</p>
      </div>
      <div v-if="isDataError">
        <h2>Something went wrong</h2>
        <p class>Error message: {{errorMessage}}</p>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Actions } from "../store/Actions";
import { ActionBase } from "../store/ActionBase";
import { OpenPlatformsService } from '../plugins/OpenPlatformsService';

@Component({
  components: {}
})
export default class VerifyEmailRoute extends Vue {
  public isDataFetched = false;
  public isDataError = false;
  public errorMessage = '';

  private openPlatforms: OpenPlatformsService = (<any>this).$openPlatforms;

  public mounted() {
    const promtId = this.$route.query.prompt_id as string;
    this.openPlatforms.verifyEmail(promtId).then(
      () => {
        this.isDataFetched = true;
      },
      (e) => {
        this.isDataFetched = true;
        this.isDataError = true;
        this.errorMessage = JSON.stringify(e);
      }
    )
  }
}
</script>

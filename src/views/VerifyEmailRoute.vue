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
        if (e.message.indexOf('400') > -1) {
          this.errorMessage = 'The verification link may have expired. This happens if you asked for a new verification, check if you have a more recent verification mail in your inbox and use that link instead.';
        } else {
          this.errorMessage = 'The verification was incorrect, please try again or contact Open Platforms support. Error message:' + JSON.stringify(e);;
        }
      }
    )
  }
}
</script>

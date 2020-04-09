<template>
  <div class="connection-diagram">
    <div class="platform-box">
      <img class="logo-icon" :src="state.platform.logoUrl" />
      <p>{{state.platform.name}}</p>
    </div>
    <div class="arrow">
      <i class="far fa-arrow-right"></i>
    </div>
    <div class="openplatforms-box">
      <img class="logo-icon" src="../assets/images/open-platforms-logo-icon.png" />
      <p>Open Platforms</p>
    </div>
    <div class="arrow">
      <i class="far fa-arrow-right"></i>
    </div>
    <div class="app-box">
      <img class="logo-icon" :src="state.app.logoUrl" />
      <p>{{state.app.name}}</p>
    </div>
  </div>
</template>

<style scoped>
.connection-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
}
.platform-box,
.openplatforms-box,
.app-box {
  background: white;
  padding: 15px;
  border-radius: 15px;
  min-width: 120px;
  text-align: center;
  margin-right: 15px;
}
.arrow {
  margin-right: 15px;
}
.logo-icon {
  width: 72px;
  height: 72px;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ConnectAppState } from "../datatypes/ConnectAppState";

@Component({
  components: {}
})
export default class PlatformDisplay extends Vue {
  @Prop()
  public state!: ConnectAppState;
}
</script>


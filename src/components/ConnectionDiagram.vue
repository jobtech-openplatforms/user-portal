<template>
  <div class="connection-diagram">
    <div class="connection-box platform-box">
      <img class="logo-icon" :src="state.platform.logoUrl" />
      <p class="color-brand">{{state.platform.name}}</p>
    </div>
    <div class="connection-box openplatforms-box">
      <img class="logo-icon" src="../assets/images/open-platforms-logo-icon.png" />
      <p>Open Platforms</p>
    </div>
    <div class="connection-box app-box">
      <img class="logo-icon" :src="state.app.logoUrl" />
      <p class="color-brand">{{state.app.name}}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/css/_variables";

.connection-diagram {
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin:50px auto;
    .connection-box {
    background: white;
    padding: 15px;
    border-radius: 15px;
    max-width: 180px;
    text-align: center;
    flex:1;
    border:1px solid #ccc;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;
    position:relative;
    
    @media (max-width:680px){
      padding:10px;
      flex:0 0 auto;
      p{
        display:none;
      }
      .logo-icon{
        width:36px;
        height:35px;
      }
    }

    &:not(:last-child){
      margin-right: 40px;
      &:after{
        content:"\f061";
        font-family:"Font Awesome 5 Pro";
        color:$color-brand;
        position:absolute;
        right:-1.5em;
        top:50%;
        transform:translateY(-50%);
        font-weight:400;
      }
    }

  
    p{
      font-size:0.7em;
      font-weight:bold;
      letter-spacing:initial;
    }

  }
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


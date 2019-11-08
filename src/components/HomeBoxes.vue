<template>
  <div class="flexbox-container hide-sm-and-down">
    <div class="box box-1" @click="gotoAnimation()">
      <div class="text-center mb-5">
        <v-icon style="color: #fff;" size="80px">insert_chart</v-icon>
      </div>
      <h2 class="heavy text-center">Prison Population Animation</h2>
      <p class="pt-4">
        SPAC created a short animation to help understand how admissions and
        length of stay determine the size of the prison population.
      </p>
    </div>
    <div
      class="box box-2"
      @click="
        $router.push('/tags/prison-pies').catch(err => {
          $vuetify.goTo(0);
        })
      "
    >
      <div class="text-center mb-5">
        <v-icon style="color: #fff;" size="80px">pie_chart</v-icon>
      </div>
      <h2 class="heavy text-center">Pies and Average Profiles</h2>

      <p class="pt-4">
        Prison population pie charts and descriptive profiles of people
        convicted in Illinois.
      </p>
    </div>
    <div
      class="box box-3"
      @click="
        $router.push('/tags/fiscal-impact').catch(err => {
          $vuetify.goTo(0);
        })
      "
    >
      <div class="text-center mb-5">
        <v-icon style="color: #fff;" size="80px">monetization_on</v-icon>
      </div>
      <h2 class="heavy text-center">Fiscal Impact Analyses</h2>
      <p class="pt-4">
        Estimates of the benefits and costs of proposed sentencing legislation
        and policy changes.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$emit("home-boxes");
  },
  methods: {
    gotoAnimation() {
      window.open("https://www.youtube.com/embed/2tqlbIAhXUQ");
    }
  }
};
</script>

<style scoped>
h2 {
  margin: 0;
  padding: 0;
}
.flexbox-container {
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
  min-height: 250px;
  font-family: "Lato", sans-serif !important;
}

/* .flexbox-container h2 {
  padding-top: 10px;
} */

.flexbox-container > div {
  width: 50%;
  padding: 60px 30px;
  color: #fff;
  font-size: 18px;
}

.flexbox-container > div:last-child {
  border-right: 0px;
}

.box-1 {
  background: #7b20a2;
}

.box-2 {
  background: #8819b7;
}

.box-3 {
  background: #9110c9;
}

.box:hover {
  box-shadow: 0px 0px 15px #000000;
  z-index: 2;
  -webkit-transition: all 100ms ease-in;
  -webkit-transform: scale(1.01);
  -ms-transition: all 100ms ease-in;
  -ms-transform: scale(1.01);
  -moz-transition: all 100ms ease-in;
  -moz-transform: scale(1.01);
  transition: all 100ms ease-in;
  transform: scale(1.01);
  cursor: pointer;
}

@media only screen and (max-width: 800px) {
  .flexbox-container {
    flex-direction: column;
  }

  .flexbox-container > div {
    width: 100%;
  }
}
</style>

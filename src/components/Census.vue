<template>
  <div v-if="showCensusModal && censusActive">
    <v-dialog v-model="census" persistent max-width="390">
      <v-card>
        <v-card-title class="headline">Census Reminder</v-card-title>
        <v-card-text>
          <hr />
          <div style="font-weight: bold; font-size: 24px;" class="mt-5">
            <v-icon color="red" large>check_box</v-icon> &nbsp;There's still
            time to be counted!
          </div>
          <br />
          Due to COVID-19 the deadline for Census submission has been
          extended.<br /><br />
          Visit <a href="https://my2020census.gov/">My2020Census.gov!</a>
        </v-card-text>
        <v-card-actions>
          <v-checkbox
            class="mx-2"
            label="Do Not Show Again"
            @click="hideForGood"
          ></v-checkbox>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="census = false"
            >CLOSE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      census: true
    };
  },
  methods: {
    hideForGood() {
      localStorage.setItem("showCensusModal", false);
      this.census = false;
    }
  },
  computed: {
    censusActive() {
      const now = new Date();
      const censusActiveUntil = new Date("2020-11-01");

      if (now < censusActiveUntil) {
        return true;
      } else {
        return false;
      }
    },
    showCensusModal() {
      //console.log("local storage: ", localStorage.getItem("showCensusModal"));
      if (localStorage.getItem("showCensusModal")) {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss" scoped></style>

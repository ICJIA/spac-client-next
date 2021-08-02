<template>
  <div>
    <v-card
      elevation="2"
      color="grey lighten-3"
      class="px-2 py-2 my-2 mx-2 hover"
      @click="$router.push('/tags/resentencing-task-force')"
    >
      <v-card-title>
        <v-chip color="purple" dark>New!</v-chip>&nbsp;&nbsp;Resentencing Task
        Force
      </v-card-title>

      <v-card-text>
        HB3587/Public Act 102-0099 created the Resentencing Task Force to study
        innovative ways to reduce Illinois’s prison population and ensure
        sentences of imprisonment promote justice and public safety. The Task
        Force will consider ways for incarcerated people, state’s attorneys, the
        Illinois Department of Corrections, and judges to file resentencing
        motions to allow second looks for people who previously received long
        sentences
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text to="/tags/resentencing-task-force"
          >Read more&nbsp;&raquo;</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>

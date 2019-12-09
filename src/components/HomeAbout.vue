<template>
  <v-container
    fluid
    class="mt-8 px-5 pt-8 pb-8"
    style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; background: #f7f7f7"
  >
    <v-row>
      <v-col cols="12" sm="12" md="7">
        <div v-if="about">
          <p
            v-html="renderToHtml(about[0].content)"
            @click="handleClicks"
            class="dynamic-content"
          ></p>
        </div>
      </v-col>
      <v-col style="margin-top: -10px" cols="12" sm="12" md="5">
        <h2
          class="heavy rule uppercase"
          style="font-size: 36px; color: purple;"
        >
          Upcoming Meetings
        </h2>
        <div v-if="upcoming && upcoming.length">
          <div v-for="(meeting, index) in upcoming" :key="index">
            <v-card class="mx-auto" outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <div
                    class="overline mb-4"
                    style="font-size: 12px !important; font-weight: bold !important"
                  >
                    {{ meeting.scheduledDate | format }}
                  </div>
                  <v-list-item-title class="headline mb-1">{{
                    meeting.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    meeting.summary
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <div class="text-right">
                <v-card-actions>
                  <v-btn text :to="getRoute(meeting)">Read more</v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </div>
        </div>
        <div v-else class="text-center mt-12 mb-12">
          <h3>No meetings scheduled.</h3>
        </div>
        <div class="text-center mt-6">
          <v-btn
            class="ma-2"
            to="/meetings"
            aria-label="Meeting Archive"
            outlined
            small
            color="primary"
            >Meeting Archive<v-icon right>chevron_right</v-icon></v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { handleClicks } from "@/mixins/handleClicks";
import { renderToHtml } from "@/services/Markdown";
import { strapiEnumToObject } from "@/services/Utilities";
export default {
  mixins: [handleClicks],
  props: {
    about: {
      type: Array,
      default: () => []
    },
    upcoming: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      renderToHtml,
      strapiEnumToObject
    };
  },
  methods: {
    getRoute(meeting) {
      console.log(`/meetings/${meeting.category}/${meeting.slug}`);
      let category = strapiEnumToObject("meetings", meeting.category);
      //console.log(category[0].slug);
      return `/meetings/${category[0].slug}/${meeting.slug}`;
    }
  }
};
</script>

<style lang="scss" scoped></style>

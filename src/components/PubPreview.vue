<template>
  <div>
    <v-card
      style="background: #fff; border-bottom: 1px solid #eee;min-height: 350px"
      class="pt-3 pb-4 elevation-4"
    >
      <div class="px-4 lato">
        <div class="text-xs-right spac-purple mt-2">
          <div class="heavy category" @click="routeToCategory(item)">
            {{ item.category.name }}
          </div>
        </div>
        <h1
          style="margin: 0; padding: 0; width: 100%;"
          class="hover mt-5 mb-3 title-link"
          @click="downloadFile(item)"
        >
          {{ item.title }}
        </h1>

        <v-card-text class="pb-5"
          ><div style="float: left; margin-right: 20px; margin-bottom: 10px;">
            <v-img
              :contain="true"
              :src="getThumbnailLink(item.mediaMaterial)"
              class="cover elevation-0 px-1"
              width="120"
              style="border: 1px solid #bbb"
            />
            <div class="text-xs-center mt-2">
              <v-btn
                small
                outlined
                color="purple darken-2"
                class="white--text"
                style="margin-left: 10px; margin-top: 10px;"
              >
                READ
                <v-icon right dark>cloud_download</v-icon>
              </v-btn>
            </div>
          </div>
          <p class="default-font table-font">
            {{ item.summary }}
          </p>
          <div>
            <!-- <TagList v-if="mode !== 'minimal'" :tags="item.tags" class="mt-2" /> -->
          </div>
        </v-card-text>

        <v-card-text />
      </div>
    </v-card>
  </div>
</template>

<script>
import { getThumbnailLink } from "@/services/Image";
import { EventBus } from "@/event-bus";
export default {
  data() {
    return {
      getThumbnailLink
    };
  },
  methods: {},
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: "full"
    }
  }
};
</script>

<style lang="scss" scoped></style>

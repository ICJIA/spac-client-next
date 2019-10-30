<template>
  <div>
    <v-card color="white">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          class="mb-10"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="publications"
        :items-per-page="15"
        :search="search"
        class="elevation-1 meetingTable"
        show-expand
        item-key="slug"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
      >
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | format }}
        </template>

        <template v-slot:item.category="{ item }" v-if="!hideCategory">
          {{ getCategoryTitle(item.category) }}
        </template>

        <template v-slot:item.slug="{ item }">
          <v-btn small outlined @click="download(item)"
            >Read &nbsp;&nbsp;<v-icon class="ml-1"
              >cloud_download</v-icon
            ></v-btn
          >
        </template>

        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn
            color="grey lighten-2"
            small
            depressed
            @click="expand(true)"
            v-if="!isExpanded"
            >More <v-icon right>arrow_drop_down</v-icon></v-btn
          >
          <v-btn small depressed @click="expand(false)" v-if="isExpanded"
            >Less<v-icon right>arrow_drop_up</v-icon></v-btn
          >
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length + 2">
            <div class="py-5">
              <!-- <MeetingCard :content="item"></MeetingCard> -->
              <pub-preview
                :item="item"
                mode="max"
                class="post default-font mb-3"
                :key="forceRender()"
              />
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import PubPreview from "@/components/PubPreview";

export default {
  components: {
    PubPreview
  },
  mounted() {
    if (!this.hideCategory) {
      Array.prototype.insert = function(index, item) {
        this.splice(index, 0, item);
      };
      let obj = {
        text: "Category",
        align: "left",
        sortable: true,
        value: "category"
      };

      this.headers.insert(0, obj);
    }
  },

  data() {
    return {
      search: "",
      expanded: [],
      key: 0,
      singleExpand: true,
      headers: [
        { text: "Year", value: "year" },
        { text: "Title", value: "title" },
        {
          text: "",
          value: "slug",
          align: "center",
          sortable: false
        }
      ]
    };
  },
  methods: {
    forceRender() {
      return this.key + 1;
    },
    download(item) {
      let path = item.mediaMaterial.file.url;
      window.open(this.$store.getters.config.baseURL + path);
    },
    // eslint-disable-next-line no-unused-vars
    getCategoryTitle(catEnum) {
      //   let categoryName = this.$store.getters.config.strapiEnums.meetings.filter(
      //     c => {
      //       return c.enum === catEnum;
      //     }
      //   );
      //   return categoryName[0].short;
      return "cat title here";
    }
  },

  props: {
    publications: {
      type: Array,
      default: () => []
    },
    hideCategory: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss" scoped></style>

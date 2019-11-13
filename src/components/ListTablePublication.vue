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
        :items="items"
        :items-per-page="15"
        :search="search"
        class="elevation-1 meetingTable hover"
        show-expand
        item-key="slug"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        @click:row="clicked"
      >
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | format }}
        </template>

        <template v-slot:item.category="{ item }" v-if="!hideCategory">
          <b>{{ getCategoryTitle(item.category) }}</b>
        </template>

        <template v-slot:item.slug="{ item }">
          <v-btn
            small
            outlined
            @click="download(item)"
            v-if="item.mediaMaterial && item.mediaMaterial.file"
            >Read&nbsp;&nbsp;&nbsp;<v-icon class="ml-1"
              >cloud_download</v-icon
            ></v-btn
          >

          <v-btn
            small
            outlined
            @click="gotoExternal(item)"
            v-if="item.externalMediaMaterial && item.externalMediaMaterial.url"
            >GO TO <v-icon class="ml-1">open_in_new</v-icon></v-btn
          >
        </template>

        <!-- <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
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
        </template> -->
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length + 2">
            <div class="py-5">
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
import { strapiEnumToObject } from "@/services/Utilities";
/* eslint-disable vue/valid-v-on */
export default {
  components: {
    PubPreview
  },
  mounted() {
    let elements = document.getElementsByClassName("v-icon--link");
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute("aria-label", "Read More / Read Less");
    }
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
    clicked(value) {
      if (value === this.expanded[0]) {
        this.expanded = [];
      } else {
        if (this.expanded.length) {
          this.expanded.shift();
          this.expanded.push(value);
        } else {
          this.expanded.push(value);
        }
      }
    },
    download(item) {
      let path = item.mediaMaterial.file.url;
      window.open(this.$store.getters.config.baseURL + path);
    },
    gotoExternal(item) {
      //console.log(item.externalMediaMaterial.url);
      if (item.externalMediaMaterial.url) {
        this.$ga.event({
          eventCategory: "Video",
          eventAction: "Play",
          eventLabel: item.externalMediaMaterial.url
        });
        window.open(item.externalMediaMaterial.url);
      }
    },
    // eslint-disable-next-line no-unused-vars
    getCategoryTitle(catEnum) {
      let cat = strapiEnumToObject("publications", catEnum);
      //console.log(cat);
      //   let categoryName = this.$store.getters.config.strapiEnums.meetings.filter(
      //     c => {
      //       return c.enum === catEnum;
      //     }
      //   );
      //   return categoryName[0].short;
      return cat[0].title;
    }
  },

  props: {
    items: {
      type: Array,
      default: () => []
    },
    hideCategory: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped></style>

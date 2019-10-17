/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { EventBus } from "@/event-bus";
import { strapiEnumToObject } from "@/services/Utilities";

const searchIndexPromise = process.BROWSER_BUILD
  ? import("@/api/searchIndex.json")
  : Promise.resolve(require("@/api/searchIndex.json"));

const configPromise = process.BROWSER_BUILD
  ? import("@/config.json")
  : Promise.resolve(require("@/config.json"));

const getSearchIndex = async () => {
  try {
    let searchIndex = await searchIndexPromise;

    let pages = searchIndex["pages"].map(item => {
      if (item.slug === "home") {
        item.parentPath = "/";
      } else {
        if (item.section) {
          if (item.slug === item.section.slug) {
            item.parentPath = `/`;
          } else {
            item.parentPath = `/${item.section.slug}`;
          }
        }

        // else {
        //   item.parentPath = `/resources`;
        // }
      }
      return item;
    });

    let news = searchIndex["news"].map(item => {
      item.parentPath = "/news";
      return item;
    });

    let meetings = searchIndex["meetings"].map(item => {
      let categoryObj = strapiEnumToObject("meetings", item.category);
      item.parentPath = `/meetings/${categoryObj[0].slug}`;
      return item;
    });

    let biographies = searchIndex["biographies"].map(item => {
      item.parentPath = "/about/biographies";
      return item;
    });

    let publications = searchIndex["publications"].map(item => {
      let categoryObj = strapiEnumToObject("publications", item.category);
      item.parentPath = `/publications/${categoryObj[0].slug}`;
      return item;
    });

    return [...news, ...pages, ...meetings, ...biographies, ...publications];
  } catch (e) {
    EventBus.$emit("Search service error: ", e.toString());
    // eslint-disable-next-line no-console
    console.log(e.toString());
    return [];
  }
};

export { getSearchIndex };

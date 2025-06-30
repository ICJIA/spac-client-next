/**
 * @fileoverview Build script for generating the search index from GraphQL API.
 * This script fetches all published content (pages, news, publications, sections, tags)
 * from the GraphQL API and creates a searchable JSON index for the client-side search functionality.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-console */
const { request } = require("graphql-request");
const jsonfile = require("jsonfile");

const config = require("./src/config.json");
const fs = require("fs");

/**
 * GraphQL API endpoint URL constructed from configuration.
 * @type {string}
 */
const api = `${config.baseURL}/graphql`;

/**
 * Directory path where the search index will be saved.
 * @type {string}
 */
const apiDir = "./src/api";

/**
 * Filename for the generated search index JSON file.
 * @type {string}
 */
const fileName = "searchIndex.json";

/**
 * GraphQL query to fetch all published content for search indexing.
 * Retrieves pages, news posts, publications, sections, and tags with their
 * associated metadata, content, and relationships.
 *
 * @type {string}
 */
const query = `{
  pages (where: {isPublished: true}) {
    createdAt
    updatedAt
    title
    summary
    content
    slug
    searchMeta
    isPublished
    
    section {
      title
      slug
      summary
      searchMeta
      summary
    }
    
    tags {
      name
      slug
    }
   
    
  }
  news: posts (sort: "createdAt:desc", where: {isPublished: true}) {
    createdAt
    updatedAt
    title
    slug
    searchMeta
    content
    isPublished
    summary
    
    
    tags {
      name
      slug
    }
   
    
  }




  meetings (sort: "scheduledDate:desc", where: {isPublished: true}){
    title
    createdAt
    updatedAt
    scheduledDate
    summary
    searchMeta
    content
    category
    slug
    isPublished
    
   
    tags {
      name
      slug
    }
    
  }

  
 


  biographies (where: {isPublished: true}){
   
    firstName
    middleName
    lastName
    membership
    isPublished
    order
    prefix
    suffix
    slug
    title
    content
    category
    alphabetizeBy
     headshot {
      url
      name
    }
  }

  publications (sort: "year:desc,title:asc", where: {isPublished: true}) {
   createdAt
    updatedAt
    title
    slug
    searchMeta
    summary
    category
    tags {
      name
      slug
    }
  }

  sections (where: {isPublished: true}) {
   createdAt
    updatedAt
    title
    slug
    searchMeta
    summary
    
  }

  tags {
    name
    slug
    searchMeta
  }

  
 
 
  
  
  
}`;

/**
 * Ensure the API directory exists before writing the search index file.
 * Creates the directory if it doesn't exist.
 */
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
  console.log(`Created: ${apiDir}/`);
}

/**
 * Execute the GraphQL query and write the search index to file.
 * Fetches all published content from the API and saves it as a JSON file
 * that can be used for client-side search functionality.
 *
 * @async
 * @function
 * @param {string} api - GraphQL API endpoint URL
 * @param {string} query - GraphQL query string
 * @returns {Promise<void>} Promise that resolves when the file is written
 */
request(api, query).then(res => {
  jsonfile.writeFile(`${apiDir}/${fileName}`, res, function(err) {
    if (err) console.error(err);
    console.log(`Created: ${apiDir}/${fileName}`);
  });
});

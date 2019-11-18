/* eslint-disable no-console */
const { request } = require("graphql-request");
const jsonfile = require("jsonfile");

const config = require("./src/config.json");
const fs = require("fs");

const api = `${config.baseURL}/graphql`;
const apiDir = "./src/api";
const fileName = "searchIndex.json";

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

  
 
 
  
  
  
}`;

if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
  console.log(`Created: ${apiDir}/`);
}

request(api, query).then(res => {
  jsonfile.writeFile(`${apiDir}/${fileName}`, res, function(err) {
    if (err) console.error(err);
    console.log(`Created: ${apiDir}/${fileName}`);
  });
});

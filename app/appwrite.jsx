import { Client, Account, ID, Databases } from 'react-native-appwrite';

const client = new Client()
    .setProject('67e1886100136d78d532')
    .setEndpoint("https://cloud.appwrite.io/v1");

const account = new Account(client);
const databases = new Databases(client);
const database_id = "67e18a5d0032427a7041";
const users_collection_id = "67e18a6f0032fd7267b5";
const medicines_collection_id = "67e19d6a00259e67cfe3";

export {client,account,users_collection_id,databases,database_id,medicines_collection_id};
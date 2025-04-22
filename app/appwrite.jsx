import { Client, Account, ID, Databases } from 'react-native-appwrite';

const client = new Client()
    .setProject('')
    .setEndpoint("https://cloud.appwrite.io/v1");

const account = new Account(client);
const databases = new Databases(client);
const database_id = "";
const users_collection_id = "";
const medicines_collection_id = "";
const medicines_history_id = "";


export {client,account,users_collection_id,databases,database_id,medicines_collection_id,medicines_history_id};
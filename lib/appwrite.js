import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';
export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.moubile.aora",
    projectId: "6739c0200000342e40f7",
    databaseId: "6739c24700390ea0d537",
    userCollectionId: "6739c262000e8d8eced6",
    videoCollectionId: "6739c2cc000ef6f97865",
    storageId: "6739c48d000f5c6529a7",
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error;
        
        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            }
        )
        return newUser;
    } catch(error) {
        console.log(error);
        throw new Error(error);
    }

}

export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email,password)
      return session;  
    } catch (error) {
        throw new Error(error)
        
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}
import { Client, Databases, Users, Query } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);

  const db = process.env.APPWRITE_DB;
  const col1 = process.env.APPWRITE_ADDRESS;
  const col2 = process.env.APPWRITE_BOOKING;

  const { userId } = JSON.parse(req.body ?? '{}');
    log(`Received delete request for userId: ${userId}`);
    console.log(userId)

  const deleteDocs = async (db, col) => {
    const docs = await databases.listDocuments(db, col, [
      Query.equal("userID", userId)
    ]);
    for (const doc of docs.documents) {
      await databases.deleteDocument(db, col, doc.$id);
    }
  };

  const deleteDocs2 = async (db, col) => {
    const docs = await databases.listDocuments(db, col, [
      Query.equal("userIdentification", userId)
    ]);
    for (const doc of docs.documents) {
      await databases.deleteDocument(db, col, doc.$id);
    }
  };

  try {
    await deleteDocs(db, col1);
    await deleteDocs2(db, col2);
    await users.delete(userId);
    return res.json({ success: true });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, error: err.message });
  }
};

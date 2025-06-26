import { Client, Databases, Users, Query } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);

  const db1 = process.env.DB1_ID;
  const col1 = process.env.COLLECTION1_ID;
  const db2 = process.env.DB2_ID;
  const col2 = process.env.COLLECTION2_ID;

  const { userId } = JSON.parse(req.payload ?? '{}');

  const deleteDocs = async (db, col) => {
    const docs = await databases.listDocuments(db, col, [
      Query.equal("userID", userId)
    ]);
    for (const doc of docs.documents) {
      await databases.deleteDocument(db, col, doc.$id);
    }
  };

  try {
    await deleteDocs(db1, col1);
    await deleteDocs(db2, col2);
    await users.delete(userId);
    return res.json({ success: true });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, error: err.message });
  }
};

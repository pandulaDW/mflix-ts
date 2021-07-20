import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();
const uri = process.env.MFLIX_DB_URI as string;

describe("MongoClient", () => {
  test("client initialized with URI", async () => {
    let testClient;
    try {
      // testing client connection
      testClient = await MongoClient.connect(uri, {
        connectTimeoutMS: 5000,
        retryWrites: true,
      });
      expect(testClient).not.toBeNull();

      // retrieve client options
      const clientOptions = testClient.options;
      expect(clientOptions).not.toBeUndefined();

      // expect clientOptions to have the correct settings
      expect(clientOptions.connectTimeoutMS).toBe(5000);
      expect(clientOptions.retryWrites).toBe(true);

      // expected this connection to have SSL enabled
      expect(clientOptions.tls).toBe(true);
    } catch (err) {
      expect(err).toBeNull();
    } finally {
      testClient?.close();
    }
  });
});

const { MongoClient } = require("mongodb");

describe("MongoClient", () => {
  test("Client initialized with URI", async () => {
    let testClient;
    try {
      testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        useNewUrlParser: true,
      });
      expect(testClient).not.toBeNull();

      // retrieve client options
      const clientOptions = testClient.s.options;
      expect(clientOptions).not.toBeUndefined();

      // expect this connection to have SSL enabled
      if (typeof clientOptions.ssl !== "undefined") {
        expect(clientOptions).toHaveProperty("ssl");
        expect(clientOptions.ssl).toBe(true);

        // expect this user to authenticate against the "admin" database
        expect(clientOptions).toHaveProperty("authSource");
        expect(clientOptions.authSource).toBe("admin");
      }
    } catch (e) {
      expect(e).toBeNull();
    } finally {
      testClient.close();
    }
  });

  test("Client initialized with URI and options", async () => {
    let testClient;
    try {
      testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        connectTimeoutMS: 2000,
        retryWrites: true,
        useNewUrlParser: true,
      });

      const clientOptions = testClient.s.options;

      // expect clientOptions to have the correct settings
      expect(clientOptions.connectTimeoutMS).toBe(2000);
      expect(clientOptions.retryWrites).toBe(true);
      expect(clientOptions.useNewUrlParser).toBe(true);
    } catch (e) {
      expect(e).toBeNull();
    } finally {
      if (testClient) testClient.close();
    }
  });
});

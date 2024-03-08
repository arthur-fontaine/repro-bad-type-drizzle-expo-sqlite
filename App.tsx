import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { db1, db2 } from "database/database";
import migrations1 from "database/migrations1/migrations";
import migrations2 from "database/migrations2/migrations";
import { messages as messagesTable } from "database/schema/messages";

export default function App() {
  return (
    <View style={styles.container}>
      <TestDb db={db1} migrations={migrations1} dbName="db1" />
      <TestDb db={db2} migrations={migrations2} dbName="db2" />
    </View>
  );
}

function TestDb({
  db,
  migrations,
  dbName,
}: {
  db: typeof db1 | typeof db2;
  migrations: typeof migrations1 | typeof migrations2;
  dbName: string;
}) {
  // Migrate the database
  const { success } = useMigrations(db, migrations);
  const [messages, setMessages] = useState<
    (typeof messagesTable.$inferSelect)[] | undefined
  >();

  // When success, insert a message
  useEffect(() => {
    if (success) {
      db.insert(messagesTable)
        .values({
          text: "Hello, World!",
          id: Math.floor(Math.random() * 100000),
        })
        .then(() => db.query.messages.findMany().execute())
        .then((rows) => setMessages(rows));
    }
  }, [success]);

  return (
    <View style={styles.dbContainer}>
      <Text style={styles.dbName}>
        {dbName}{" "}
        {messages !== undefined &&
          (typeof messages.at(-1)?.id === "string" ? (
            <Text style={styles.fail}>Fail</Text>
          ) : (
            <Text style={styles.success}>Success</Text>
          ))}
      </Text>
      <Text>
        Migrations: {Object.values(migrations.migrations).length} applied{"\n"}
      </Text>
      <Text style={styles.mostRecent}>10 most recent entries:</Text>
      {messages?.slice(-10).map((message) => (
        <Text key={message.id}>
          {"{"}"id": {typeof message.id}, "text": {typeof message.text}
          {"}"}
        </Text>
      )) || <Text>Loading...</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  dbContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dbName: {
    fontSize: 30,
  },
  mostRecent: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
  },
  fail: {
    color: "red",
    fontSize: 20,
  },
  success: {
    color: "green",
    fontSize: 20,
  },
});

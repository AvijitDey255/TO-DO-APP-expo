
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";


export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("tasks");
      if (stored) setTasks(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([{ id: Date.now().toString(), text: task, done: false }, ...tasks]);
    setTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const renderItem = ({ item }: { item: { id: string; text: string; done: boolean } }) => (
    <View style={styles.task}>
      <TouchableOpacity onPress={() => toggleTask(item.id)} style={{ flex: 1 }}>
        <Text style={[styles.taskText, item.done && styles.done]}>{item.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Ionicons name="trash" size={20} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a task..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {tasks.length === 0 ? (
        <Text style={styles.empty}>No tasks yet 🎉</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f2f2" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15 },
  inputRow: { flexDirection: "row", marginBottom: 15 },
  input: { flex: 1, backgroundColor: "#fff", padding: 10, borderRadius: 8, fontSize: 16 },
  addBtn: { marginLeft: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 8 },
  task: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, marginBottom: 8, borderRadius: 8 },
  taskText: { fontSize: 16 },
  done: { textDecorationLine: "line-through", color: "#888" },
  empty: { textAlign: "center", marginTop: 50, color: "#888", fontSize: 16 },
});

import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean;
};

const STORAGE_KEY = "my-todos";

export default function Index() {
  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [todoText, setTodoText] = useState("");



  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem('my-todos')
        if (todos !== null) {
          setTodos(JSON.parse(todos))
        }
      } catch (error) {
        console.log(error);

      }
    }
    getTodos()
  }, [])

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (err) {
        console.log("Load error", err);
      }
    };
    loadTodos();
  }, []);

  // 🔹 Add todo (IMMUTABLE)
  const addTodo = async () => {
    if (!todoText.trim()) return;

    const newTodo: ToDoType = {
      id: Date.now(),
      title: todoText.trim(),
      isDone: false,
    };

    const updatedTodos = [...todos, newTodo];

    setTodos(updatedTodos);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    setTodoText("");
    Keyboard.dismiss()
  };

  // 🔹 Toggle checkbox
  const toggleTodo = async (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    );

    setTodos(updatedTodos);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
  };

  // 🔹 Delete todo
  const deleteTodo = async (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(updatedTodos);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>

        <Image
          source={{
            uri: "https://media.licdn.com/dms/image/v2/D4D03AQHkZUIiuTQlRw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1707815215521",
          }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>

      {/* Todo List */}
      <FlatList
        data={[...todos].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            <View style={styles.todoInfoCond}>
              <Checkbox
                value={item.isDone}
                onValueChange={() => toggleTodo(item.id)}
                color={item.isDone ? "#4630EB" : undefined}
              />
              <Text
                style={[
                  styles.todoText,
                  item.isDone && { textDecorationLine: "line-through" },
                ]}
              >
                {item.title}
              </Text>
            </View>

            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer */}
      <KeyboardAvoidingView behavior="padding" style={styles.footer}>
        <TextInput
          value={todoText}
          onChangeText={setTodoText}
          placeholder="Add new task"
          style={styles.newTodoInput}
        />

        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f6f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  todoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  todoInfoCond: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  newTodoInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4630EB",
    padding: 10,
    borderRadius: 10,
    marginLeft: 12,
  },
});

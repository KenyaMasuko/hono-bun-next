import { Box } from "@mantine/core";
import { TodoList } from "./todo-list";
import { FormContextProvider, FormProvider, TodoForm } from "./form";

export default function Home() {
  return (
    <Box maw={340} mx="auto">
      <FormContextProvider>
        <TodoForm />
        <TodoList />
      </FormContextProvider>
    </Box>
  );
}

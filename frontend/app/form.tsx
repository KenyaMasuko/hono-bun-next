"use client";

import { Button, Group, TextInput } from "@mantine/core";
import { createFormContext } from "@mantine/form";

type FormValues = {
  title: string;
  id?: number;
};

export const [FormProvider, useFormContext, useForm] =
  createFormContext<FormValues>();

export const FormContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const form = useForm({
    initialValues: {
      title: "",
    },
    validate: {
      title: (value) => (value.length !== 0 ? null : "Title is required"),
    },
  });

  return <FormProvider form={form}>{children}</FormProvider>;
};

export const TodoForm: React.FC = () => {
  const form = useFormContext();

  const handleSubmit = form.onSubmit(async (values) => {
    if (values.id) {
      const res = await fetch(`/api/todos?id=${values.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        console.log(res);
      }
    } else {
      const res = await fetch(`/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        console.log(res);
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        withAsterisk
        label="Title"
        placeholder="todo"
        {...form.getInputProps("title")}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

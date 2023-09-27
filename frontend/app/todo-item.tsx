"use client";

import { useFormContext } from "@/app/form";
import { Checkbox, Flex, UnstyledButton } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";

type Props = {
  todo: {
    id: number;
    title: string;
    completed: boolean;
  };
};

export const TodoItem: React.FC<Props> = (props) => {
  const form = useFormContext();
  const [checked, setChecked] = React.useState(props.todo.completed);
  return (
    <li>
      <Flex align={"center"} justify={"space-between"}>
        {props.todo.title}
        <Flex>
          <UnstyledButton
            onClick={() =>
              form.setValues({
                title: props.todo.title,
                id: props.todo.id,
              })
            }
          >
            <IconEdit />
          </UnstyledButton>
          <Checkbox
            checked={checked}
            onChange={async () => {
              const res = await fetch(`/api/todos?id=${props.todo.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...props.todo,
                  completed: !checked,
                }),
              });
              if (!res.ok) {
                console.log(res);
              }
              setChecked(!checked);
            }}
          />
        </Flex>
      </Flex>
    </li>
  );
};

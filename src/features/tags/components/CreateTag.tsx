import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, Stack, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCreateTag } from "../api/create-tag";
import { ITagDTO } from "../model/ITag";
import { AiOutlineTag } from "react-icons/ai";


export const CreateTag: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ITagDTO>({
    defaultValues: {
      name: "",
    },
  });

  const mutation = useCreateTag(() => {
    close();
    reset();
  });

  const onSubmit = (data: ITagDTO) => {
    mutation.mutate(data);
  };

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="New Tag">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextInput
                  label="Name"
                  placeholder="Enter tag name"
                  {...field}
                  error={errors.name?.message}
                />
              )}
            />
            <div className="flex flex-row gap-6 justify-end">
              <Button onClick={close}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </Stack>
        </form>
      </Modal>


      <Stack align="center">
        <Button onClick={open} leftIcon={< AiOutlineTag size={18} />}>
          New Tag
        </Button>
      </Stack>
    </>
  );
};

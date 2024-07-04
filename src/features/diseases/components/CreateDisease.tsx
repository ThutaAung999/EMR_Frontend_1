import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, Stack, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCreateDisease } from "../api/create-disease";
import { IDiseaseDTO } from "../model/IDisease";

import { IconUserPlus } from "@tabler/icons-react";

import { GiVirus } from "react-icons/gi";

export const CreateDisease: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IDiseaseDTO>({
    defaultValues: {
      name: "",
      description: "",
      //patients: [],
      // medicines: [],
    },
  });

  const mutation = useCreateDisease(() => {
    close();
    reset();
  });

  const onSubmit = (data: IDiseaseDTO) => {
    mutation.mutate(data);
  };

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="New Disease">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextInput
                  label="Name"
                  placeholder="Enter disease name"
                  {...field}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <TextInput
                  label="Description"
                  placeholder="Enter description"
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
        <Button onClick={open} leftIcon={<GiVirus size={18} />}>
          New Disease
        </Button>
      </Stack>
    </>
  );
};

//export default CreateDisease;

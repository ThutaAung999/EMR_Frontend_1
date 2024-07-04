import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, Stack, Modal } from "@mantine/core";

import { useUpdateTag } from "../api/update-tag";
import { ITag } from "../model/ITag";

interface UpdateTagProps {
  tag: ITag;
  closeModal: () => void;
}

export const UpdateTag: React.FC<UpdateTagProps> = ({
  tag,
  closeModal,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ITag>({
    defaultValues: {
      ...tag,
    },
  });

  const mutation = useUpdateTag();

  const onSubmit = (data: ITag) => {
    const transformedData = {
      ...data,
    };
    mutation.mutate(transformedData);
    closeModal();
  };

  useEffect(() => {
    reset(tag);
  }, [tag, reset]);

  return (
    <Modal opened={true} onClose={closeModal} title="Edit Tag">
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
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
};



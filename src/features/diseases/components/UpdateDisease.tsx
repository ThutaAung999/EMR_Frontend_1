import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, Stack, Modal } from "@mantine/core";

import { useUpdateDisease } from "../api/update-disease";
import { IDisease } from "../model/IDisease";
import { notifications } from "@mantine/notifications";
import { FaEdit, FaExclamationCircle } from "react-icons/fa";

interface UpdateDiseaseProps {
  disease: IDisease;
  closeModal: () => void;
}

const UpdateDisease: React.FC<UpdateDiseaseProps> = ({
  disease,
  closeModal,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IDisease>({
    defaultValues: {
      ...disease,
    },
  });

  const mutation = useUpdateDisease();

  const onSubmit = (data: IDisease) => {
    const transformedData = {
      ...data,
    };
    mutation.mutate(transformedData, {
      onSuccess: () => {
        closeModal();

        notifications.show({
          title: "Success",
          message: "Disease updated successfully",
          color: "green",
          autoClose: 3000,
          icon: <FaEdit size={20} />,
          withCloseButton: true,
        });
      },
      onError: (error) => {
        closeModal();
        console.error("Failed to update disease", error);
        notifications.show({            
          title: 'Fail',
          message: 'Disease not saved successfully',
          color: 'red',
          autoClose: 3000,
          icon: <FaExclamationCircle  size={20} />,                        
          withCloseButton: true,
        })
      },
    });
  };

  useEffect(() => {
    reset(disease);
  }, [disease, reset]);

  return (
    <Modal opened={true} onClose={closeModal} title="Edit Disease">
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
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateDisease;

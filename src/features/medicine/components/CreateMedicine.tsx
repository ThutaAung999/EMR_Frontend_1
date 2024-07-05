import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateMedicine } from "../api/create-medicine";
import {  IMedicineDTO } from "../model/IMedicine";
import { Button, Modal, MultiSelect, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useGetMedicines } from "../api/get-all-medicines";

import { useGetDiseases } from "../../diseases/api/get-all-diseases";


import { GiPillDrop } from "react-icons/gi";

const CreateMedicine: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IMedicineDTO>({
    defaultValues: {
      name: "",
      manufacturer: "",
      diseases: [],
    },
  });

  const mutation = useCreateMedicine(() => {
    close();
    reset();
  });

  const onSubmit = (data: IMedicineDTO) => {
    mutation.mutate(data);
  };

  const [opened, { open, close }] = useDisclosure(false);

  const { data: medicines, error, isLoading } = useGetMedicines();
  const { data: diseases, error:diseaseError, isLoading : diseaseIsLoading } = useGetDiseases();

  if (isLoading || diseaseIsLoading) return <div>Loading...</div>;

  if (error || diseaseError) return <div>Error</div>;

  if(medicines) console.log(medicines);

  const diseaseOptions =
    diseases
      ?.filter(
        (disease, index, self) =>
          disease &&
          disease._id &&
          self.findIndex((d) => d?._id === disease._id) === index
      )
      .map((disease) => ({ value: disease._id, label: disease.name })) || [];
  
  return (
    <>
      <Modal opened={opened} onClose={close} title="New Medicine">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="md">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextInput
                  label="Name"
                  placeholder="Enter medicine name"
                  {...field}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              name="manufacturer"
              control={control}
              rules={{ required: "Manufacturer is required" }}
              render={({ field }) => (
                <TextInput
                  label="Manufacturer"
                  placeholder="Enter manufacturer"
                  {...field}
                  error={errors.manufacturer?.message}
                />
              )}
            />

            <Controller
              name="diseases"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  data={diseaseOptions}
                  label="Diseases"
                  placeholder="Select diseases"
                  value={field.value}
                  onChange={(values) => field.onChange(values)}
                  error={
                    errors.diseases && "Please select at least one disease"
                  }
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
        <Button onClick={open} leftIcon={<GiPillDrop size={18} />}>
          New Medicine
        </Button>
      </Stack>
    </>
  );
};

export default CreateMedicine;

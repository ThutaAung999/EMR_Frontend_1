

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Modal, MultiSelect, Stack, TextInput,Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCreateMedicine } from "../api/create-medicine";
import { IMedicineDTO } from "../model/IMedicine";
import { useGetDiseases1 } from "../../diseases/api/get-all-diseases";
import { GiPillDrop } from "react-icons/gi";
import {BaseTypeForPagination} from "../../utilForFeatures/basePropForPagination";

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

  const defaultQuery: BaseTypeForPagination = {
    page: 1,
    limit: 100, 
  };
  
  const { data: diseases, error: diseaseError, isLoading: diseaseIsLoading } =
  useGetDiseases1(defaultQuery);

  if (diseaseIsLoading) return <div>Loading...</div>;
  if (diseaseError) return <div>Error</div>;

    const diseaseOptions = diseases?.data?.map((disease) => ({ 
        value: disease._id, 
        label: disease.name 
    })) || [];

    //console.log('disease options in CreateMedicine: ', diseaseOptions);

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
                  error={errors.diseases && "Please select at least one disease"}
                />
              )}
            />

            <div className="flex flex-row gap-6 justify-end">
              <Button onClick={close} disabled={mutation.isPending}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader size="sm" color="white" /> : "Save"}
                </Button>
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


// components/UpdatePatient.tsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, MultiSelect, Stack, Modal } from "@mantine/core";

import { useUpdateMedicine } from "../api/update-medicine";
import { IMedicine } from "../model/IMedicine";
import { useGetDiseases } from "../../../features/diseases/api/get-all-diseases";

interface UpdateMedicineProps {
  medicine: IMedicine;
  closeModal: () => void;
}

export const UpdateMedicine: React.FC<UpdateMedicineProps> = ({medicine,closeModal,}) => {

  console.log("medicine to update :",medicine)
  const {control,handleSubmit,formState: { errors },reset,} = useForm<IMedicine>({
    defaultValues: {
      ...medicine,
      diseases: medicine.diseases?.map((disease) => ({ _id: disease._id })),
    },
  });


  const mutation = useUpdateMedicine();
  const { data: diseasesData } = useGetDiseases();

  const onSubmit = (data: IMedicine) => {
    const transformedData = {
      ...data,
      diseases: data.diseases.map((disease) => disease._id),
    };

    mutation.mutate(transformedData);
    closeModal();
  };

  useEffect(() => {
    reset(medicine);
  }, [medicine, reset]);

  return (
    <Modal opened={true} onClose={closeModal} title="Edit Medicine">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
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
            rules={{ required: "manufacturer is required" }}
            render={({ field }) => (
              <TextInput
                label="Manufacturer"
                placeholder="Enter manufacturer name"
                {...field}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="diseases"
            control={control}
            render={({ field }) => (
              <MultiSelect
                data={
                  diseasesData?.map((disease) => ({
                    value: disease._id,
                    label: disease.name,
                  })) || []
                }
                label="Diseases"
                placeholder="Select diseases"
                value={field.value.map((disease: any) => disease._id)}
                onChange={(values) =>
                  field.onChange(values.map((id) => ({ _id: id })))
                }
                error={errors.diseases && "Please select at least one disease"}
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


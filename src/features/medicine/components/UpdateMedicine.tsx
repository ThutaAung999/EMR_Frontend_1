import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, MultiSelect, Stack, Modal } from "@mantine/core";

import { useUpdateMedicine } from "../api/update-medicine";
import { IMedicine, IMedicineDTO } from "../model/IMedicine";
import {useGetDiseases1} from "../../../features/diseases/api/get-all-diseases";
import { IDisease } from "../../diseases/model/IDisease";
import {BaseTypeForPagination} from "../../utilForFeatures/basePropForPagination";
import { FaEdit, FaExclamationCircle } from "react-icons/fa";
import { notifications } from "@mantine/notifications";


interface UpdateMedicineProps {
  medicine: IMedicine;
  closeModal: () => void;
}

const UpdateMedicine: React.FC<UpdateMedicineProps> = ({
  medicine,
  closeModal,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IMedicineDTO>({
    defaultValues: {
      ...medicine,
      diseases: medicine.diseases?.map((disease) => disease._id) || [],
    },
  });

  //console.log("medicine: "+medicine.diseases.map((disease) =>disease.name) + "\n");

  const mutation = useUpdateMedicine();

  const defaultQuery: BaseTypeForPagination = {
    page: 1,
    limit: 50,
  };

  const { data: diseasesData } = useGetDiseases1(defaultQuery);

  const onSubmit = (data: IMedicineDTO) => {
    const transformedData: IMedicineDTO = {
      ...data,
      diseases: data.diseases,
    };

    mutation.mutate(transformedData,{
      onSuccess: () => {
        

        notifications.show({
          title: "Success",
          message: "EMR updated successfully",
          color: "green",
          autoClose: 3000,
          icon: <FaEdit size={20} />,
          withCloseButton: true,
        });
        closeModal();
      },
      onError: (error) => {
        
        notifications.show({            
          title: 'Fail',
          message: 'Disease not saved successfully',
          color: 'red',
          autoClose: 3000,
          icon: <FaExclamationCircle  size={20} />,                        
          withCloseButton: true,
        })
        console.error("Failed to update disease", error);
        closeModal();
      },
    });
    
  };

  useEffect(() => {
    reset({
      ...medicine,
      diseases: medicine.diseases?.map((disease) => disease._id) || [],
    });
  }, [medicine, reset]);

  const diseaseOptions =
    diseasesData?.data.map((disease: IDisease) => ({
      value: disease._id,
      label: disease.name,
    })) || [];

  //console.log("diseaseOptions :",diseaseOptions);

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
            rules={{ required: "Manufacturer is required" }}
            render={({ field }) => (
              <TextInput
                label="Manufacturer"
                placeholder="Enter manufacturer name"
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
                label="Diseases"
                placeholder="Select diseases"
                data={diseaseOptions}
                value={field.value}
                onChange={(values) => field.onChange(values)}
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

export default UpdateMedicine;

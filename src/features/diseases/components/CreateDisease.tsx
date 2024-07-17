import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, Stack, Modal, Loader } from '@mantine/core';
import { useDisclosure } from "@mantine/hooks";
import { useCreateDisease } from "../api/create-disease";
import { IDiseaseDTO } from "../model/IDisease";
import { GiVirus } from "react-icons/gi";
import { notifications } from "@mantine/notifications";
import { IconUpload } from "@tabler/icons-react";
import { FaTimesCircle } from "react-icons/fa"; 


const CreateDisease: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IDiseaseDTO>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = useCreateDisease(() => {
    close();
    reset();
  });


  const onSubmit = (data: IDiseaseDTO) => {
    mutation.mutate(data, {

      onSuccess: (data: IDiseaseDTO) =>{

       // console.log('Successfully saved', data.name, data.description);
        
        notifications.show({            
          title: 'Success',
          message: 'Disease saved successfully :'+data.name,
          color: 'green',
          autoClose: 3000,
          icon: <IconUpload size={20} />,                        
          withCloseButton: true,          
        })
      } ,

      onError: () => {
        alert("Failed to create disease");
        notifications.show({            
          title: 'Fail',
          message: 'Disease not saved successfully',
          color: 'red',
          autoClose: 3000,
          icon: <FaTimesCircle size={20} />,                        
          withCloseButton: true,
          
        })
      },
    });
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
                  error={errors.description?.message}
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
        <Button onClick={open} leftIcon={<GiVirus size={18} />}>
          New Disease
        </Button>
      </Stack>
    </>
  );
};

export default CreateDisease;
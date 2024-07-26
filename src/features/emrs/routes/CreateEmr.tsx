import React, { useState } from "react";
import { Button, Stack, Loader } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { FaCheck, FaExclamationCircle, FaPlus } from "react-icons/fa";
import { notifications } from "@mantine/notifications";

import { useNavigate } from "react-router-dom";
import { IEmrDTO } from "../model/emr.model";
import { useCreateEmr } from "../api/create-emr";
import { useGetDiseases1 } from "../../diseases/api/get-all-diseases";
import { useGetMedicines1 } from "../../medicine/api/get-all-medicines";
import useGetPatients1 from "../../patients/api/get-all-patients";
import { useGetTags1 } from "../../tags/api/get-all-tags";
import { useImageUpload } from "./customHooks/fileUpload";
import { BaseTypeForPagination } from "../../utilForFeatures/basePropForPagination";
import ImageUploadModal from "./ImageUploadModal";
import UploadedImages from "./UploadedImages";
import FormFields from "./FormFields";
import LoadingError from "./LoadingError";
import { IDisease } from "../../diseases/model/IDisease";
import { IPatient } from "../../patients/model/IPatient";
import { IMedicine } from "../../medicine/model/IMedicine";
import { ITag } from "../../tags/model/ITag";


const CreateEmr: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IEmrDTO>({
    defaultValues: {
      medicines: [],
      diseases: [],
      patients: [],
      emrImages: [],
      notes: "",
    },
  });

  const navigate = useNavigate();
  const defaultQuery: BaseTypeForPagination = { page: 1, limit: 100 };

  const {
    data: diseases,
    isLoading: diseaseIsLoading,
    error: diseaseError,
  } = useGetDiseases1(defaultQuery);
  const {
    data: medicines,
    isLoading: medicineIsLoading,
    error: medicineError,
  } = useGetMedicines1(defaultQuery);
  const {
    data: patients,
    isLoading: patientIsLoading,
    error: patientError,
  } = useGetPatients1(defaultQuery);
  const {
    data: tags,
    isLoading: tagIsLoading,
    error: tagError,
  } = useGetTags1(defaultQuery);

  const { uploadedImages, uploadImages, removeImage } = useImageUpload();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [mutationPending, setMutationPending] = useState(false);




  const mutation = useCreateEmr(() => {
    reset();
    setSelectedFiles([]);
    setSelectedTags([]);
    navigate("/emrs");
  });

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;
    setSelectedFiles(Array.from(files));
  };

  const handleImageUpload = async () => {
    setMutationPending(true);

    await uploadImages(selectedFiles, selectedTags);
    setSelectedTags([]);
    setSelectedFiles([]);
    setModalOpen(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMutationPending(false);

  };

  const onSubmit = (data: IEmrDTO) => {
    data.emrImages = uploadedImages;
    mutation.mutate(data,{
      onSuccess: () =>{
        notifications.show({            
          title: 'Success',
          message: 'EMR saved successfully :',
          color: 'green',
          autoClose: 3000,
          icon: <FaCheck size={20} />,                        
          withCloseButton: true,          
        })
      },
      onError: () =>{
        notifications.show({            
          title: 'Fail',
          message: 'EMR not saved successfully',
          color: 'red',
          autoClose: 3000,
          icon: <FaExclamationCircle  size={20} />,                        
          withCloseButton: true,
        })
      }
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedFiles([]);
    setSelectedTags([]);
  };

  if (diseaseIsLoading || medicineIsLoading || patientIsLoading || tagIsLoading)
    return <LoadingError loading={true} />;

  if (diseaseError || medicineError || patientError || tagError)
    return <LoadingError error={true} />;

  const diseaseOptions =
    diseases?.data?.map((disease: IDisease) => ({
      value: disease._id,
      label: disease.name,
    })) || [];
  const patientOptions =
    patients?.data?.map((patient: IPatient) => ({
      value: patient._id,
      label: patient.name,
    })) || [];
  const medicineOptions =
    medicines?.data?.map((medicine: IMedicine) => ({
      value: medicine._id,
      label: medicine.name,
    })) || [];
  const tagsOptions =
    tags?.data?.map((tag: ITag) => ({ value: tag._id, label: tag.name })) || [];

  return (
    <section className="h-full w-full">
      <div className="flex flex-col justify-between items-start min-w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
          encType="multipart/form-data"
        >
          <Stack>
            <Controller
              name="emrImages"
              control={control}
              render={() => (
                <div className="flex flex-row items-center">
                  <Button
                    leftIcon={<FaPlus />}
                    onClick={() => setModalOpen(true)}
                  >
                    Add Item
                  </Button>
                  <UploadedImages
                    images={uploadedImages}
                    removeImage={removeImage}
                  />
                </div>
              )}
            />
            <FormFields
              control={control}
              errors={errors}
              diseaseOptions={diseaseOptions}
              medicineOptions={medicineOptions}
              patientOptions={patientOptions}
            />
           
            <div className="flex flex-row gap-6 justify-end">
              <Button
                onClick={() => navigate("/emrs")}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader size="sm" color="white" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Stack>
        </form>
      </div>
      <ImageUploadModal
        opened={modalOpen}
        onClose={handleModalClose}
        tagsOptions={tagsOptions}
        selectedFiles={selectedFiles}
        handleImageSelect={handleImageSelect}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        handleImageUpload={handleImageUpload}
       // mutationPending={mutation.isPending}
        setSelectedFiles={setSelectedFiles} 
        mutationPending={mutationPending}               
      />
    </section>
  );
};

export default CreateEmr;

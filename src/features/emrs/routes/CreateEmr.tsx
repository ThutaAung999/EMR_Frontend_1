import React, { useState, useRef } from "react";
import {
  Button,
  MultiSelect,
  Stack,
  Textarea,
  Modal,
  Loader,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IEmrDTO } from "../model/emr.model";
import { useCreateEmr } from "../api/create-emr";

import { useGetDiseases1 } from "../../diseases/api/get-all-diseases";
import { useGetMedicines1 } from "../../medicine/api/get-all-medicines";
import useGetPatients1 from "../../patients/api/get-all-patients";
import { useGetTags1 } from "../../tags/api/get-all-tags";


import { useImageUpload } from "./customHooks/fileUpload";
import { BaseTypeForPagination } from "../../utilForFeatures/basePropForPagination";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    await uploadImages(selectedFiles, selectedTags);
    setSelectedTags([]);
    setSelectedFiles([]);
    setModalOpen(false);
  };

  const onSubmit = (data: IEmrDTO) => {
    data.emrImages = uploadedImages;
    mutation.mutate(data);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedFiles([]);
    setSelectedTags([]);
  };

  if (diseaseIsLoading || medicineIsLoading || patientIsLoading || tagIsLoading)
    return <div>Loading...</div>;
  if (diseaseError || medicineError || patientError || tagError)
    return <div>Error</div>;

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
                  <div className="mt-2 flex flex-row items-center w-30 h-30 rounded-full ms-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`http://localhost:9999/${image.image}`}
                          alt="Uploaded"
                          className="w-24 h-24 rounded-full"
                          style={{ margin: "10px" }}
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0"
                          onClick={() => removeImage(index)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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
            <Controller
              name="medicines"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  data={medicineOptions}
                  label="Medicine"
                  placeholder="Select medicine"
                  value={field.value}
                  onChange={(values) => field.onChange(values)}
                  error={
                    errors.medicines && "Please select at least one medicine"
                  }
                />
              )}
            />
            <Controller
              name="patients"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  data={patientOptions}
                  label="Patient"
                  placeholder="Select patients"
                  value={field.value}
                  onChange={(values) => field.onChange(values)}
                  error={
                    errors.patients && "Please select at least one patient"
                  }
                />
              )}
            />
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Note :"
                  autosize
                  minRows={2}
                  maxRows={4}
                  placeholder="Enter your notes"
                  {...field}
                  error={errors.notes?.message}
                />
              )}
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
      <Modal
        opened={modalOpen}
        onClose={handleModalClose}
        title="Upload Image and Tags"
      >
        <Stack>
          <Button onClick={() => fileInputRef.current?.click()}>
            Add Photo
          </Button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleImageSelect(e.target.files)}
          />
          <div className="mt-4 flex flex-row flex-wrap gap-4">
            {selectedFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt="Selected"
                className="w-48 h-48"
              />
            ))}
          </div>
          <MultiSelect
            data={tagsOptions}
            label="Tags"
            placeholder="Select tags"
            value={selectedTags}
            maxDropdownHeight={150}
            onChange={setSelectedTags}
          />
          <div className="flex flex-row gap-6 justify-end mt-4">
            <Button onClick={handleModalClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleImageUpload} disabled={mutation.isPending}>
              {mutation.isPending ? <Loader size="sm" color="white" /> : "Save"}
            </Button>
          </div>
        </Stack>
      </Modal>
    </section>
  );
};

export default CreateEmr;

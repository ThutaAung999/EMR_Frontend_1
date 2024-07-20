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

import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { IEmrDTO, EmrImage } from "../model/emr.model";

import { useCreateEmr } from "../api/create-emr";
import { useGetDiseases1 } from "../../diseases/api/get-all-diseases";
import { useGetMedicines1 } from "../../medicine/api/get-all-medicines";
import useGetPatients1 from "../../patients/api/get-all-patients";
import { useGetTags1 } from "../../tags/api/get-all-tags";

import { BaseTypeForPagination } from "../../utilForFeatures/basePropForPagination";

const CreateEmr: React.FC = () => {
  // const apiUrl = import.meta.env.VITE_API_URL;

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

  //const { data: emrs, error, isLoading } = useGetEmrs();

  const defaultQuery: BaseTypeForPagination = {
    page: 1,
    limit: 100,
  };

  const {
    data: diseases,
    error: diseaseError,
    isLoading: diseaseIsLoading,
  } = useGetDiseases1(defaultQuery);

  const {
    data: medicines,
    error: medicineError,
    isLoading: medicineIsLoading,
  } = useGetMedicines1(defaultQuery);
  const {
    data: patients,
    error: patientError,
    isLoading: patientIsLoading,
  } = useGetPatients1(defaultQuery);

  const {
    data: tags,
    error: tagError,
    isLoading: tagIsLoading,
  } = useGetTags1(defaultQuery);

  const mutation = useCreateEmr(() => {
    reset();
    setUploadedImages([]); // Clear uploaded images
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    navigate("/emrs"); // Navigate to the desired route after saving
  });

  const [uploadedImages, setUploadedImages] = useState<EmrImage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const res = await axios.post(
        "http://localhost:9999/api/emrs/uploads",
        //"https://emr-backend-intz.onrender.com/api/emrs/uploads",
        // apiUrl + "api/emrs/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { images } = res.data;
      const newImages: EmrImage[] = images.map((image: { image: string }) => ({
        image: image.image,
        tags: selectedTags, // Add selected tags to the uploaded image
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
      setSelectedTags([]); // Reset tags after saving
      setModalOpen(false); // Close modal after saving
      setSelectedFiles([]); // Clear selected files
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remove the image from selected files if not uploaded yet
    //This function receives the current state (prevFiles) and returns the new state.
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    // Remove the image from uploaded images if already uploaded
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
    (Array.isArray(diseases?.data) &&
      diseases?.data.map((disease) => ({
        value: disease._id,
        label: disease.name,
      }))) ||
    [];

  const patientOptions =
    (Array.isArray(patients?.data) &&
      patients?.data?.map((patient) => ({
        value: patient._id,
        label: patient.name,
      }))) ||
    [];

  const medicineOptions =
    (Array.isArray(medicines?.data) &&
      medicines?.data?.map((medicine) => ({
        value: medicine._id,
        label: medicine.name,
      }))) ||
    [];

  const tagsOptions =
    (Array.isArray(tags?.data) &&
      tags?.data?.map((tag) => ({ value: tag._id, label: tag.name }))) ||
    [];

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
                          //src={`https://emr-backend-intz.onrender.com/${image.image}`}
                          src={`http://localhost:9999/${image.image}`}
                          // src={apiUrl + `${image.image}`}
                          alt="Uploaded"
                          className="w-24 h-24 rounded-full"
                          style={{ margin: "10px" }}
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0"
                          onClick={() => handleRemoveImage(index)} // Pass index to handleRemoveImage
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
                className="w-48 h-48 "
              />
            ))}
          </div>

          <MultiSelect
            data={tagsOptions}
            label="Tags"
            placeholder="Select tags"
            value={selectedTags}
            onChange={setSelectedTags}
            /*     styles={dropdownStyles} */
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

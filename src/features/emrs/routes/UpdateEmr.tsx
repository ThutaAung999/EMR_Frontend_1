import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  MultiSelect,
  Stack,
  Textarea,
  Modal,
  Loader,
} from "@mantine/core";
import { FaEdit, FaExclamationCircle, FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";

import { IEmrDTO, EmrImage } from "../model/emr.model";
import { useUpdateEmr } from "../api/update-emr";
import useGetPatients from "../../patients/api/get-all-patients";

import { useGetDiseases1 } from "../../diseases/api/get-all-diseases";
import { useGetTags1 } from "../../tags/api/get-all-tags";
import { useGetMedicines1 } from "../../medicine/api/get-all-medicines";

import { BaseTypeForPagination } from "../../utilForFeatures/basePropForPagination";
import { notifications } from "@mantine/notifications";

export interface UpdateEmrProps {
  emr: IEmrDTO;
  closeModal: () => void;
}

const UpdateEmr: React.FC<UpdateEmrProps> = ({ emr, closeModal }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IEmrDTO>({
    defaultValues: {
      ...emr,
      patients: emr.patients,
      diseases: emr.diseases,
      medicines: emr.medicines,
      emrImages: emr.emrImages,
      notes: emr.notes,
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImages, setUploadedImages] = useState<EmrImage[]>(
    emr.emrImages
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Add this state

  const defaultQuery: BaseTypeForPagination = {
    page: 1,
    limit: 50,
  };
  const { data: diseases } = useGetDiseases1(defaultQuery);

  const { data: medicines } = useGetMedicines1(defaultQuery);
  const { data: patients } = useGetPatients(defaultQuery);
  const { data: tags } = useGetTags1(defaultQuery);

  const mutation = useUpdateEmr();

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
        // "http://localhost:9999/api/emrs/uploads",
        //"https://emr-backend-intz.onrender.com/api/emrs/uploads",
        apiUrl + "api/emrs/uploads",
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
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    // Remove the image from uploaded images if already uploaded
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = (data: IEmrDTO) => {
    data.emrImages = uploadedImages;
    mutation.mutate(data, {
      onSuccess: () => {
        closeModal();

        notifications.show({
          title: "Success",
          message: "EMR updated successfully",
          color: "green",
          autoClose: 3000,
          icon: <FaEdit size={20} />,
          withCloseButton: true,
        });
      },
      onError: (error) => {
        closeModal();
        notifications.show({
          title: "Fail",
          message: "Disease not saved successfully",
          color: "red",
          autoClose: 3000,
          icon: <FaExclamationCircle size={20} />,
          withCloseButton: true,
        });
        console.error("Failed to update disease", error);
      },
    });
  };

  useEffect(() => {
    reset(emr);
  }, [emr, reset]);

  const onlyDiseaseData = diseases?.data;

  const diseaseOptions =
    (Array.isArray(onlyDiseaseData) &&
      onlyDiseaseData?.map((disease) => ({
        value: disease._id,
        label: disease.name,
      }))) ||
    [];

  const patientOptions =
    patients?.data.map((patient) => ({
      value: patient._id,
      label: patient.name,
    })) || [];

  const medicineOptions =
    medicines?.data.map((medicine) => ({
      value: medicine._id,
      label: medicine.name,
    })) || [];

  const tagsOptions =
    tags?.data.map((tag) => ({ value: tag._id, label: tag.name })) || [];

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedFiles([]);
    setSelectedTags([]);
  };

  return (
    <div className="h-screen w-full">
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

                <div className="mt-2 flex flex-row items-center space-x-4 ">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative ">
                      <img
                        // src={`https://emr-backend-intz.onrender.com/${image.image}`}
                        src={apiUrl + `${image.image}`}
                        //src={`http://localhost:9999/${image.image}`}
                        alt="Uploaded"
                        className="w-24 h-24 rounded-full"
                        style={{ margin: "10px" }}
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 "
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
                error={errors.diseases && "Please select at least one disease"}
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
                error={errors.patients && "Please select at least one patient"}
              />
            )}
          />

          <Controller
            name="notes"
            control={control}
            rules={{ required: "NOTES is required" }}
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
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </Stack>
      </form>

      <Modal
        opened={modalOpen}
        onClose={handleModalClose}
        title="Upload Image and Add Tags"
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
          />

          
          <div className="flex flex-row gap-6 justify-end mt-4">
            <Button onClick={handleModalClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleImageUpload} disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader size="sm" color="white" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </Stack>
      </Modal>
    </div>
  );
};

export default UpdateEmr;

import React, { useState, useRef } from "react";
import { Button, MultiSelect, Stack, Textarea, Modal } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { IEmrDTO, EmrImage } from "../model/emr.model";
import { useCreateEmr } from "../api/create-emr";
import useGetEmrs from "../api/get-all-emrs";
import { useGetDiseases } from "../../diseases/api/get-all-diseases";
import { useGetMedicines } from "../../medicine/api/get-all-medicines";
import useGetPatients from "../../patients/api/get-all-patients";
import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useGetTags } from "../../tags/api/get-all-tags";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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

  const navigate = useNavigate(); // Initialize useNavigate

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: emrs, error, isLoading } = useGetEmrs();
  const {
    data: diseases,
    error: diseaseError,
    isLoading: diseaseIsLoading,
  } = useGetDiseases();
  const {
    data: medicines,
    error: medicineError,
    isLoading: medicineIsLoading,
  } = useGetMedicines();
  const {
    data: patients,
    error: patientError,
    isLoading: patientIsLoading,
  } = useGetPatients();

  const { data: tags, error: tagError, isLoading: tagIsLoading } = useGetTags();

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
    mutation.mutate(data);
  };

  if (
    isLoading ||
    diseaseIsLoading ||
    medicineIsLoading ||
    patientIsLoading ||
    tagIsLoading
  )
    return <div>Loading...</div>;
  if (error || diseaseError || medicineError || patientError || tagError)
    return <div>Error</div>;

  const diseaseOptions =
    diseases
      ?.filter(
        (disease, index, self) =>
          disease &&
          disease._id &&
          self.findIndex((d) => d?._id === disease._id) === index
      )
      .map((disease) => ({ value: disease._id, label: disease.name })) || [];

  const patientOptions =
    patients
      ?.filter(
        (patient, index, self) =>
          patient &&
          patient._id &&
          self.findIndex((d) => d?._id === patient._id) === index
      )
      .map((patient) => ({ value: patient._id, label: patient.name })) || [];

  const medicineOptions =
    medicines
      ?.filter(
        (medicine, index, self) =>
          medicine &&
          medicine._id &&
          self.findIndex((d) => d?._id === medicine._id) === index
      )
      .map((medicine) => ({ value: medicine._id, label: medicine.name })) || [];

  const tagsOptions =
    tags
      ?.filter(
        (tag, index, self) =>
          tag && tag._id && self.findIndex((t) => t?._id === tag._id) === index
      )
      .map((tag) => ({ value: tag._id, label: tag.name })) || [];

  // CSS class for the dropdown container to add scrollbar
  const dropdownStyles = {
    dropdown: {
      maxHeight: "80px", // Adjust as needed
      overflowY: "auto",
    },
  };

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
              render={({ field }) => (
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
                          src={`http://localhost:9999/${image.image}`} // Correct image path
                          alt="Uploaded"
                          className="w-24 h-24 rounded-full"
                          style={{ margin: "10px" }}
                        />
                        <button type='button'
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
              <Button onClick={() => navigate("/emrs")}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </Stack>
        </form>
      </div>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
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
            styles={dropdownStyles}
          />
          <div className="flex flex-row gap-6 justify-end mt-4">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleImageUpload}>Save</Button>
          </div>
        </Stack>
      </Modal>
    </section>
  );
};

export default CreateEmr;

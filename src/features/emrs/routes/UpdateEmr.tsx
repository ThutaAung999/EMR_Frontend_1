import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, MultiSelect, Stack, Textarea, Modal } from "@mantine/core";
import { IEmrDTO, EmrImage } from "../model/emr.model";
import { useUpdateEmr } from "../api/update-emr";
import { useGetDiseases } from "../../diseases/api/get-all-diseases";
import { useGetMedicines } from "../../medicine/api/get-all-medicines";
import useGetPatients from "../../patients/api/get-all-patients";
import { useGetTags } from "../../tags/api/get-all-tags";
import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";

export interface UpdateEmrProps {
  emr: IEmrDTO;
  closeModal: () => void;
}

const UpdateEmr: React.FC<UpdateEmrProps> = ({ emr, closeModal }) => {
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
  const [uploadedImages, setUploadedImages] = useState<EmrImage[]>(emr.emrImages);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: diseases } = useGetDiseases();
  const { data: medicines } = useGetMedicines();
  const { data: patients } = useGetPatients();
  const { data: tags } = useGetTags();

  const mutation = useUpdateEmr();

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Create a new array without the image at the specified index
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
  };

  const onSubmit = (data: IEmrDTO) => {
    data.emrImages = uploadedImages;
    mutation.mutate(data);
    closeModal();
  };

  useEffect(() => {
    reset(emr);
  }, [emr, reset]);

  const diseaseOptions =
    diseases?.map((disease) => ({ value: disease._id, label: disease.name })) || [];

  const patientOptions =
    patients?.map((patient) => ({ value: patient._id, label: patient.name })) || [];

  const medicineOptions =
    medicines?.map((medicine) => ({ value: medicine._id, label: medicine.name })) || [];

  const tagsOptions =
    tags?.map((tag) => ({ value: tag._id, label: tag.name })) || [];

  return (
    <div className="h-screen w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full" encType="multipart/form-data">
        <Stack>
          <Controller
            name="emrImages"
            control={control}
            render={() => (
              <div className="flex flex-row items-center">
                <Button leftIcon={<FaPlus />} onClick={() => setModalOpen(true)}>
                  Add Item
                </Button>

                
                <div className="mt-2 flex flex-row items-center space-x-4 ">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative ">
                      <img
                        src={`http://localhost:9999/${image.image}`} // Correct image path
                        alt="Uploaded"
                        className="object-cover w-32 h-32 rounded-lg shadow-md  mx-3 " 
                      />
                      <button type='button'
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
                error={errors.medicines && "Please select at least one medicine"}
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
        onClose={() => setModalOpen(false)}
        title="Upload Image and Add Tags"
      >
        <Stack>
          <Button onClick={() => fileInputRef.current?.click()}>Add Photo</Button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e.target.files)}
          />
          <MultiSelect
            data={tagsOptions}
            label="Tags"
            placeholder="Select tags"
            value={selectedTags}
            onChange={setSelectedTags}
          />
          <div className="flex flex-row gap-6 justify-end mt-4">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (fileInputRef.current?.files) {
                  handleImageUpload(fileInputRef.current.files);
                }
              }}
            >
              Save
            </Button>
          </div>
        </Stack>
      </Modal>
    </div>
  );
};

export default UpdateEmr;

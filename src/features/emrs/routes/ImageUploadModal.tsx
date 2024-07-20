import React, { useRef } from "react";
import { Button, Stack, Modal, MultiSelect, Loader } from "@mantine/core";
//import { ITag } from "../../tags/model/ITag";

interface ImageUploadModalProps {
  opened: boolean;
  onClose: () => void;
  tagsOptions: { value: string; label: string }[];
  selectedFiles: File[];
  handleImageSelect: (files: FileList | null) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  handleImageUpload: () => Promise<void>;
  mutationPending: boolean;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  opened,
  onClose,
  tagsOptions,
  selectedFiles,
  handleImageSelect,
  selectedTags,
  setSelectedTags,
  handleImageUpload,
  mutationPending,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Modal opened={opened} onClose={onClose} title="Upload Image and Tags">
      <Stack>
        <Button onClick={() => fileInputRef.current?.click()}>Add Photo</Button>
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
          <Button onClick={onClose} disabled={mutationPending}>
            Cancel
          </Button>
          <Button onClick={handleImageUpload} disabled={mutationPending}>
            {mutationPending ? <Loader size="sm" color="white" /> : "Save"}
          </Button>
        </div>
      </Stack>
    </Modal>
  );
};

export default ImageUploadModal;

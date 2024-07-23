import React, { useRef, useState, useEffect } from "react";
import { Button, Stack, Modal, MultiSelect, Loader, Text } from "@mantine/core";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagError, setTagError] = useState("");

  useEffect(() => {
    if (!opened) {
      setIsSubmitting(false);
      setTagError("");
    }
  }, [opened]);

  const handleSave = async () => {
    if (selectedTags.length === 0) {
      setTagError("Please select at least one tag.");
      return;
    }

    setIsSubmitting(true);
    setTagError(""); // Clear error before attempting upload
    await handleImageUpload();
    onClose();
  };

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
    if (tags.length > 0) {
      setTagError("");
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Upload Image and Tags">
      <Stack>
        <Button onClick={() => fileInputRef.current?.click()} disabled={isSubmitting || mutationPending}>
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
          onChange={handleTagChange}
        />
        {tagError && <Text color="red" size="sm">{tagError}</Text>}
        <div className="flex flex-row gap-6 justify-end mt-4">
          <Button onClick={onClose} disabled={isSubmitting || mutationPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting || mutationPending}>
            {isSubmitting || mutationPending ? <Loader size="sm" color="white" /> : "Save"}
          </Button>
        </div>
      </Stack>
    </Modal>
  );
};

export default ImageUploadModal;

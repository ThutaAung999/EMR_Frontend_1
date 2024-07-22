import React from "react";
import { FaTimes } from "react-icons/fa";

interface UploadedImagesProps {
  images: { image: string }[];
  removeImage: (index: number) => void;
}

const UploadedImages: React.FC<UploadedImagesProps> = ({
  images,
  removeImage,
}) => {
  return (
    <div className="mt-2 flex flex-row items-center w-30 h-30 rounded-full ms-4">
      {images.map((image, index) => (
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
  );
};

export default UploadedImages;



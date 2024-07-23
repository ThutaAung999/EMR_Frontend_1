import { useState } from 'react';
import axios from 'axios';
import { EmrImage } from '../../model/emr.model';

export const useImageUpload = () => {
  
  const [uploadedImages, setUploadedImages] = useState<EmrImage[]>([]);


  const uploadImages = async (files: File[], tags: string[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('image', file));

    const apiUrl = import.meta.env.VITE_API_URL;       
    
    //or
    ////"https://emr-backend-intz.onrender.com/api/emrs/uploads",

    const res = await axios.post(
      //`http://localhost:9999/api/emrs/uploads`, 
      apiUrl + "api/emrs/uploads",
      formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
      }
  );

    const { images } = res.data;
    const newImages = images.map((image: { image: string }) => ({
      image: image.image,
      tags,
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };


  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return { uploadedImages, uploadImages, removeImage };
};

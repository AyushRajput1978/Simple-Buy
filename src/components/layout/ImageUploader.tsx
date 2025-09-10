import { useState, useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  img: string | File;
  setImg: (img: File) => void;
  size: string;
  isLoading: boolean;
}

const ImageUploader = ({ img, setImg, size, isLoading }: ImageUploaderProps) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    let revokeUrl: string | null = null;

    if (img instanceof File) {
      const objectUrl = URL.createObjectURL(img);
      setImage(objectUrl);
      revokeUrl = objectUrl;
    } else {
      setImage(img || null);
    }

    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [img]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    // Only proceed if the file is an image
    if (!file?.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImg(file);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });
  return (
    <div
      className="border border-success"
      {...getRootProps()}
      style={{
        marginBottom: '16px',
        border: '1px dashed #ccc',
        padding: '16px',
        textAlign: 'center',
        width: '10em',
        height: '10em',
      }}
    >
      <input {...getInputProps()} />
      {image ? (
        <Image src={image} alt="Existing Image" style={{ width: '100%', height: '100%' }} />
      ) : (
        <p>Drag & drop an image here, or click to select one {size}</p>
      )}
      {image && (
        <Button className="mt-4 btn-dark fontweigh-500" disabled={isLoading}>
          Change
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Image } from "react-bootstrap";

const ImageUploader = ({ img, setImg, size, isLoading }) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    // Check if img is a File (binary)
    if (img instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        setImage(dataUrl);
      };
      reader.readAsDataURL(img);
    } else {
      // Assume img is a Data URL
      setImage(img);
    }
  }, [img]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Only proceed if the file is an image
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImg(file);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });
  return (
    <div
      className="border border-success"
      {...getRootProps()}
      style={{
        marginBottom: "16px",
        border: "1px dashed #ccc",
        padding: "16px",
        textAlign: "center",
        width: "10em",
        height: "10em",
      }}
    >
      <input {...getInputProps()} />
      {image ? (
        <Image
          src={image}
          alt="Existing Image"
          style={{ width: "100%", height: "100%" }}
        />
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

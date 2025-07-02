import { Col, Image, Row } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { IoCloseCircle } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

const MultImageUploader = ({ images, setImages }) => {
  const onDrop = (acceptedFiles) => {
    setImages((prev) => [...(prev || []), ...acceptedFiles]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const getImagePreview = (image) => {
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };

  return (
    <Row className="justify-content-center g-3">
      {images?.map((image, index) => (
        <Col
          lg={2}
          md={3}
          sm={4}
          xs={6}
          key={index}
          className="position-relative"
        >
          <div
            className="rounded overflow-hidden shadow-sm position-relative"
            style={{
              border: "1px solid #dee2e6",
              transition: "transform 0.2s",
            }}
          >
            <Image
              src={getImagePreview(image)}
              alt={`Preview ${index + 1}`}
              fluid
              style={{ height: "11em", width: "100%", objectFit: "cover" }}
              className="rounded"
            />
            <IoCloseCircle
              className="position-absolute text-danger"
              onClick={() => removeImage(index)}
              size={24}
              style={{
                top: 6,
                right: 6,
                cursor: "pointer",
                background: "white",
                borderRadius: "50%",
              }}
            />
          </div>
        </Col>
      ))}

      <Col
        lg={2}
        md={3}
        sm={4}
        xs={6}
        {...getRootProps()}
        className="d-flex align-items-center justify-content-center rounded border border-2 border-dashed"
        style={{
          height: "11em",
          cursor: "pointer",
          background: "#f9f9f9",
          transition: "background 0.2s",
        }}
      >
        <input {...getInputProps()} />
        <div className="text-muted text-center">
          <FaPlus className="mb-2" size={22} />
          <div>Add Image</div>
        </div>
      </Col>
    </Row>
  );
};

export default MultImageUploader;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronDown, XIcon } from "lucide-react";

import useUploadImage from "@/hooks/useUploadImage";
import { useAuthManager } from "@/store/AuthProvider";
import { CustomInput } from "@/components/ui/Input/CustomInput";
import { CustomTextarea } from "@/components/ui/Input/CustomTextAre";
import CustomFileInput from "@/components/ui/Input/CustomFileInput";
import CustomButton from "@/components/ui/Button/CustomButton";
import { CustomDateInput } from "@/components/ui/Input/CustomDateInput";

const CreateTicketForm = () => {
  const navigate = useNavigate();
  const { actor } = useAuthManager();

  const {
    preview: ImagePreview,
    selectedFile: imageFile,
    uploading: isImageUploading,
    handleFileChange: handleImageChange,
    uploadImage,
    resetUpload: resetImage,
  } = useUploadImage(5, ["image/"]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [salesDeadline, setSalesDeadline] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push("Title is required");
    }

    if (!description.trim()) {
      errors.push("Description is required");
    }

    if (!price || price <= 0) {
      errors.push("Price must be greater than 0");
    }

    if (!total || total <= 0) {
      errors.push("Total ticket must be greater than 0");
    }

    if (!salesDeadline) {
      errors.push("Sales deadline is required");
    }

    // if (!imageFile) {
    //   errors.push("Image is required");
    // }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleCreateNewTicket = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      console.log({
        title,
        description,
        price,
        total,
        salesDeadline,
      });

      // const uploadedImageUrl = await uploadImage();
      // const result = await actor.createPost({
      //   title,
      //   description,
      //   price,
      //   total,
      //   salesDeadline,
      //   imageUrl: uploadedImageUrl,
      // });
      // console.log("Post created successfully:", result);
      // resetForm();
      // navigate("/posts");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setTotal(0);
    setSalesDeadline(null);
    resetImage();
    setFormErrors([]);
  };

  const handleDateChange = (date: Date | null) => {
    setSalesDeadline(date ? date.getTime() : null);
  };

  return (
    <div className="mt-3 rounded-lg border border-border px-5 py-4 shadow-custom">
      <CustomInput
        label="Title"
        placeholder="Ticket Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <CustomTextarea
        containerClassName="mt-2 md:mt-4"
        textareaClassName="md:min-h-[100px]"
        label="Description"
        placeholder="Description about the ticket"
        maxLength={1000}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <CustomInput
        label="Price"
        placeholder="Ticket Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <CustomInput
        label="Total Ticket"
        placeholder="Ticket Total"
        type="number"
        value={total}
        onChange={(e) => setTotal(Number(e.target.value))}
      />
      <CustomDateInput
        label="Sales Deadline"
        value={salesDeadline ? new Date(salesDeadline) : null}
        onChange={handleDateChange}
        containerClassName="mb-4"
      />

      {/* Image Upload */}
      <div className="mt-4">
        <label className="mb-2 block font-semibold text-subtext">Image</label>
        <div className="space-y-5">
          <CustomFileInput
            onChange={handleImageChange}
            placeholder="Upload ticket image"
            containerClassName="max-w-[300px]"
          />

          {ImagePreview && (
            <div className="relative w-fit">
              <img
                src={ImagePreview}
                alt="Image Preview"
                className="h-48 w-full rounded-lg object-cover"
              />
              <button
                onClick={resetImage}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1"
              >
                <XIcon className="h-3 w-3 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error messages */}
      {formErrors.length > 0 && (
        <div className="mt-4 text-red-500">
          {formErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className="flex w-full md:justify-end">
        <CustomButton
          variant="secondary"
          disabled={loading || isImageUploading}
          onClick={handleCreateNewTicket}
          className="mb-3 mt-5 w-full md:w-[300px]"
        >
          {loading || isImageUploading ? "Uploading..." : "Post Ticket"}
        </CustomButton>
      </div>
    </div>
  );
};

export default CreateTicketForm;

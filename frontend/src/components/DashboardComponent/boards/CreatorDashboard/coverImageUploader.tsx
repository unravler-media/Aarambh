import { useState, useRef } from "react";
import { UploadImage } from "@/hooks/creatorDashboard";

interface ImageUploaderProps {
  value?: string | null; // initial image (for edit mode)
  onChange: (value: string | null) => void; // callback to parent
}

export default function CoverImageUploader({ value = null, onChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setLoading(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = reader.result as string;

          console.log("Uploading the Image…");
          const uploadResponse = await UploadImage(result, file.name, file.type);

          if (uploadResponse?.response) {
            // ✅ server returns the final URL
            const uploadedUrl = uploadResponse.response;
            setPreview(uploadedUrl);
            onChange(uploadedUrl);
            console.log(`✅ Image uploaded: ${uploadedUrl}`);
          } else {
            throw new Error("Unexpected response format from server");
          }
        } catch (err: any) {
          console.error("❌ Upload failed:", err);
          setError(err.message || "Failed to upload image");
          setPreview(null);
          onChange(null);
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input
    }
  };

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-white">Cover photo</label>

      {/* Loading state */}
      {loading && (
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
          <p className="text-gray-400">Uploading...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* No preview */}
      {!preview && !loading && (
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
          <div className="text-center">
            <div className="mt-4 flex text-sm text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Upload a Photo</span>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      )}

      {/* Preview state */}
      {preview && !loading && (
        <div className="mt-2 space-y-2">
          <img
            src={preview}
            alt="Uploaded preview"
            className="max-h-full w-auto rounded-lg border border-white/25"
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleChangeClick}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm font-medium text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
          <input
            ref={fileInputRef}
            id="file-upload"
            name="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>
      )}
    </div>
  );
}

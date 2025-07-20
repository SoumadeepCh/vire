"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Loader2, Upload, FileVideo, FileImage, CheckCircle, AlertCircle, X } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);

  const onError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
    setProgress(0);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    setProgress(100);
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
    setProgress(0);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      const roundedProgress = Math.round(percentComplete);
      setProgress(roundedProgress);
      if (onProgress) {
        onProgress(roundedProgress);
      }
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or WebP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return false;
      }
    }
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const FileIcon = fileType === "video" ? FileVideo : FileImage;
  const maxSize = fileType === "video" ? "100MB" : "5MB";
  const acceptedFormats = fileType === "video" ? "MP4, MOV, AVI, WebM" : "JPEG, PNG, WebP";

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="relative">
        <div
          className={`
            relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 bg-gray-800/30 backdrop-blur-sm
            ${dragActive 
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]' 
              : uploading 
                ? 'border-emerald-500/50 bg-emerald-500/5' 
                : 'border-gray-600/50 hover:border-emerald-500/30 hover:bg-emerald-500/5'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrag}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23059669\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none rounded-2xl"></div>
          
          <div className="relative text-center">
            {uploading ? (
              /* Upload Progress */
              <div className="space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-emerald-400 font-semibold">Uploading {fileType}...</p>
                  <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{progress}% complete</p>
                </div>
              </div>
            ) : (
              /* Upload Interface */
              <div className="space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className={`
                    absolute inset-0 rounded-full transition-all duration-300
                    ${dragActive ? 'bg-emerald-400/30 animate-pulse' : 'bg-emerald-500/20'}
                  `}></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    {dragActive ? (
                      <Upload className="w-8 h-8 text-white animate-bounce" />
                    ) : (
                      <FileIcon className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-lg">
                    {dragActive ? `Drop your ${fileType} here` : `Upload ${fileType}`}
                  </h3>
                  <p className="text-gray-400">
                    Drag and drop or click to browse files
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>Max: {maxSize}</span>
                    <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                    <span>{acceptedFormats}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <IKUpload
            fileName={fileType === "video" ? "video" : "image"}
            onError={onError}
            onSuccess={handleSuccess}
            onUploadStart={handleStartUpload}
            onUploadProgress={handleProgress}
            accept={fileType === "video" ? "video/*" : "image/*"}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            validateFile={validateFile}
            useUniqueFileName={true}
            folder={fileType === "video" ? "/videos" : "/images"}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Status Messages */}
      <div className="space-y-3">
        {/* Success State */}
        {progress === 100 && !uploading && !error && (
          <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-emerald-400 font-semibold">Upload successful!</p>
              <p className="text-emerald-300/80 text-sm">Your {fileType} has been uploaded and processed.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-red-400 font-semibold">Upload failed</p>
                <p className="text-red-300/80 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Upload Tips */}
        {!uploading && !error && progress !== 100 && (
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Upload Tips</span>
            </h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Ensure stable internet connection for large files</li>
              <li>• {fileType === "video" ? "Supported formats: MP4, MOV, AVI, WebM" : "Supported formats: JPEG, PNG, WebP"}</li>
              <li>• Maximum file size: {maxSize}</li>
              <li>• Files are automatically optimized after upload</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
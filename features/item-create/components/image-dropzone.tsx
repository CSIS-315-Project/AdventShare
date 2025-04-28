"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface ImageDropzoneProps {
  files: File[]
  setFiles: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
}

export default function ImageDropzone({
  files,
  setFiles,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
}: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Limit the number of files
      const newFiles = [...files]

      acceptedFiles.forEach((file) => {
        if (newFiles.length < maxFiles) {
          newFiles.push(file)
        }
      })

      setFiles(newFiles)
    },
    [files, setFiles, maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize,
    maxFiles: maxFiles - files.length,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
        ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50 hover:border-primary/50"}`}
    >
      <input {...getInputProps()} />
      <Upload size={32} className="mx-auto text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">
        Drag & drop images here
        <br />
        or <span className="text-primary underline">click to select</span>
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Max {maxFiles} images, up to {Math.round(maxSize / 1024 / 1024)}MB each
      </p>
    </div>
  )
}

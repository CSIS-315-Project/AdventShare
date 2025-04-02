//this is just an example, no real functionality
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const ImageUpload: React.FC = () => {
  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-md flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 mb-4">Upload images of your item</p>
        
        <Button 
          type="button" 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {/* Does nothing */}}
        >
          <Upload className="h-4 w-4" />
          <span>Add Images</span>
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
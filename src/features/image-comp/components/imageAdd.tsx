"use client"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { XCircle } from 'lucide-react';

interface ImageAdditionProps {
  image: string | null;
  side: "left" | "right";
  expanded: boolean;
  handleImageUpload: (side: "left" | "right", event: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: (side: "left" | "right") => void;
}

const ImageAddition = (
  { image, side, expanded, handleImageUpload, clearImage  } : ImageAdditionProps
) => {

  if(expanded) {
    return (
      <div className={`flex-1 space-y-4 w-1/2`}>
      <h2 className="text-xl text-center font-semibold">{side} Image</h2>
      {image ? (
        <div className="relative aspect-square">

          <Image
            src={image}
            alt={`${side} image`}
            layout="fill"
            objectFit="contain"
          />
          <Button
            className="absolute top-2 right-2 rounded-full"
            variant={'destructive'}
            size={'icon'}
            onClick={() => clearImage(side)}
          >
            <XCircle size={24} />
          </Button>

        </div>
      ) : (
        <div className="aspect-square flex items-center justify-center bg-white/50 rounded-lg">
          <Label htmlFor={`${side}-image-upload`}className="cursor-pointer">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                Upload {side} image
              </span>
            </div>
          </Label>
          <Input
            id={`${side}-image-upload`}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleImageUpload(side, e)}
          />
        </div>
      )}
    </div>
    )
  } else {
    return (
      <div className={``}>

      </div>
    )
  }


}

export default ImageAddition;
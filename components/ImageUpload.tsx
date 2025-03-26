'use client';
import React, { useRef, useState } from 'react'
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from '@/lib/config';
import ImageKit from 'imagekit';
import { set } from 'zod';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

const { env : {imagekit : {publicKey, urlEndpoint}} } = config;



const authenticator = async() => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status} : ${errorText}`);
    }
    const data = await response.json();
    const {signature, expire, token} = data;
    return {signature, expire, token};
  } catch (error:any) {
    throw new Error(`Auth failed : ${error.message}`)
  }
};

const ImageUpload = ({onFileChange}:{onFileChange :(string) => void;}) => {

  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{string} | null>(null);

  const onError = (error:any) => {
    console.error(error);
    toast({
      title: "Image upload failed",
      description: `Your image could not be uploaded`,
      variant: 'destructive',
    })
  };
  const onSuccess = (res:any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast({
      title: "Image uploaded successfully",
      description: `${res.filePath} uploaded successfully`,
    })
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <IKUpload 
      className='hidden' 
      ref={ikUploadRef}
      onSuccess={onSuccess}
      onError={onError}
      fileName='test-upload.png'
       />
       <button className='upload-btn' onClick={(e)=> {
        e.preventDefault();
        if(ikUploadRef.current) {
          ikUploadRef.current ?.click();
        }
       }}>
        <Image src='/icons/upload.svg' className='object-contain' alt='upload' width={20} height={20} />
        <p className='text-base text-light-100'>Upload a file</p>
        {file && <p className='upload-filename'>{file.filePath}</p>}
       </button>
       {file && <IKImage alt={file.filePath} path={file.filePath} width={500} height={500} />}
    </ImageKitProvider>
  )
}

export default ImageUpload
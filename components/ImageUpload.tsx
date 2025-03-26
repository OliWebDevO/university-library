'use client';
import React from 'react'
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";

const authenticator = async() => {
  try {
    const response = await fetch();
  } catch (error:any) {
    throw new Error(`Auth failed : ${error.message}`)
  }
};

const ImageUpload = () => {
  return (
    <div>ImageUpload</div>
  )
}

export default ImageUpload
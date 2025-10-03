"use client"

import style from './index.module.css';
import { useRef, useState } from "react";
import { downloadImage } from '@/utils/dowloadImage';
import { useDispatch } from 'react-redux';
import {
    Upload as UploadIcon,
    Image as ImageIcon,
    Download as DownloadIcon,
    LoaderCircle as LoaderCircleIcon
} from 'lucide-react';
import { notificationFactory } from '@/utils/notificationFactory';
import { AppDispatch } from '../../../../../redux-store';
import { add, remove } from '../../../../../redux-store/slices/notificationListSlice';
import { v4 as uuidv4 } from 'uuid';

export function Upload() {
    const dispatch = useDispatch<AppDispatch>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [image, setImage] = useState<File | null>(null);

    function handleInputFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            setImage(file);
        }
    }

    async function getStatusOfProcess(processId: string) {
        const response = await fetch(`http://localhost:8080/image/resize/${processId}`, {
            method: 'GET'
        });

        const result = await response.json();
        return result;
    }

    async function sendImageToResize() {
        setLoading(true);

        const formData = new FormData();
        if (image) {
            formData.append("image", image);
        }

        const response = await fetch("http://localhost:8080/image/resize", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.status === 200) {
            const intervalId = setInterval(async () => {
                const resultOfProcess = await getStatusOfProcess(result.processId);

                if (resultOfProcess.status === 200) {
                    downloadImage(resultOfProcess.imageUrl);
                    clearInterval(intervalId);

                    const notfication = notificationFactory(uuidv4(), "Sua imagem foi redimensionada com sucesso e o download começará automaticamente.");
                    dispatch(add(notfication));
                    setTimeout(() => {
                        dispatch(remove({ id: notfication.id }));
                    }, 5000);
                    
                    setLoading(false);
                    return;
                }

                clearInterval(intervalId);
                setLoading(false);
            }, 1000);
        }
    }

    return (
        <div className={style.containerUpload}>
            {image && (
                <>
                    <img
                        className={style.selectedImage}
                        src={imageURL}
                        alt="Selected image"
                    />
                    <div className={style.containerBtns}>
                        <button
                            className={loading ? style.processImageBtnLoading : style.processImageBtn}
                            onClick={sendImageToResize}
                        >
                            {loading && (
                                <LoaderCircleIcon
                                    className={style.iconLoading}
                                    color="white"
                                />
                            )}
                            {!loading && (
                                <DownloadIcon
                                    color="white"
                                />
                            )}
                            Redimensionar
                        </button>
                        <p>ou</p>
                        <button
                            className={loading ? style.changeImageBtnLoading : style.changeImageBtn}
                            onClick={() => {
                                setImage(null);
                                setImageURL("");
                            }}
                        >
                            Escolher outra imagem
                        </button>
                    </div>
                </>
            )}
            {!image && (
                <>
                    <div className={style.uploadIcon}>
                        <UploadIcon color="white" />
                    </div>
                    <h2>Selecione uma imagem para redimensionar</h2>
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleInputFileChange}
                    />
                    <button
                        className={style.choseImageBtn}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon color="white" />
                        Escolher imagem
                    </button>
                </>
            )}
        </div >
    )
}
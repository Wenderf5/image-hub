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
import { AppDispatch } from '../../../../redux-store';
import { add, remove } from '../../../../redux-store/slices/notificationListSlice';
import { v4 as uuidv4 } from 'uuid';
import { iconType } from '@/components/notification';

export function Upload() {
    const dispatch = useDispatch<AppDispatch>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [image, setImage] = useState<File | null>(null);

    function handleInputFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            setImage(file);
        }
    }

    async function getStatusOfProcess(processId: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_ENDPOINT}/image/resize/${processId}`, {
                method: 'GET'
            });
            const result = await response.json();
            return result;
        } catch (error) {
            return {
                status: 400
            }
        }
    }

    function sendNotification(message: string, iconType?: iconType) {
        const notification = notificationFactory(uuidv4(), message, iconType);
        dispatch(add(notification));
        setTimeout(() => {
            dispatch(remove({ id: notification.id }));
        }, 5000);
    }

    async function verifyProcess(processId: string, interval: NodeJS.Timeout) {
        const resultOfProcess = await getStatusOfProcess(processId);

        if (resultOfProcess.status === 200) {
            downloadImage(resultOfProcess.imageUrl);
            clearInterval(interval);
            sendNotification("Sua imagem foi redimensionada com sucesso e o download começará automaticamente.", "checkCheckIcon");
            setLoading(false);
            return;
        }

        if (resultOfProcess.status === 400) {
            sendNotification("Ocorreu um erro inesperado ao redimensionar a imagem.", "xIcon");
            clearInterval(interval);
            setLoading(false);
            return;
        }
    }

    async function sendImageToResize() {
        try {
            if (!image) {
                sendNotification("Por favor, selecione uma imagem para redimensionar.", "fileWarningIcon");
                return;
            }

            setLoading(true);
            const formData = new FormData();
            formData.append("image", image);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_ENDPOINT}/image/resize`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.status === 200) {
                const interval = setInterval(() => {
                    verifyProcess(result.processId, interval);
                }, 1000);
                return;
            }

            sendNotification("Ocorreu um erro inesperado ao redimensionar a imagem.", "xIcon");
            setLoading(false);
        } catch (error) {
            sendNotification("Ocorreu um erro inesperado ao redimensionar a imagem.", "xIcon");
            setLoading(false);
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
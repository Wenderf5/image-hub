"use client"

import style from './index.module.css';
import { useRef, useState } from "react";
import {
    Upload as UploadIcon,
    Image as ImageIcon,
    Download as DownloadIcon,
    LoaderCircle as LoaderCircleIcon
} from 'lucide-react';

export function Upload() {
    const [loading, setLoading] = useState(false);
    const [isImageSelected, setIsImageSelected] = useState<boolean>(false);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleInputFileClick() {
        fileInputRef.current?.click();
    }

    function handleChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
        }
        setIsImageSelected(true);
    }

    return (
        <div className={style.containerUpload}>
            {imageURL && (
                <>
                    <img
                        className={style.selectedImage}
                        src={imageURL}
                        alt="Selected image"
                    />
                    <div className={style.containerBtns}>
                        <button
                            className={loading ? style.processImageBtnLoading : style.processImageBtn}
                            onClick={() => setLoading(true)}
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
                                setIsImageSelected(false);
                                setImageURL(null);
                            }}
                        >
                            Escolher outra imagem
                        </button>
                    </div>
                </>
            )}
            {!isImageSelected && (
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
                        onChange={handleChangeImage}
                    />
                    <button
                        className={style.choseImageBtn}
                        onClick={handleInputFileClick}
                    >
                        <ImageIcon color="white" />
                        Escolher imagem
                    </button>
                </>
            )}
        </div >
    )
}
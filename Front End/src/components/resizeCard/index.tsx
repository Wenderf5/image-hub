import style from './index.module.css';
import { Upload } from './_components/upload';

export function ResizeCard() {
    return (
        <div className={style.container}>
            <div className={style.ttlContainer}>
                <h1>  Redimensionador de Imagens </h1>
                <p>Faça upload de suas imagens e redimensione-as de forma rápida e simples.</p>
            </div>
            <Upload />
        </div>
    )
}
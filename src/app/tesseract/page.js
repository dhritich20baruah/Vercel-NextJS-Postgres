"use client"
import Ocr from "./Ocr"

export default function TesseractOCR(){
    return(
        <main className="m-5">
           <h1 className="text-center m-10 font-semibold text-xl">Tesseract</h1>
           <Ocr/>
        </main>
    )
}
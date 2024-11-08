import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Tesseract from "tesseract.js";
import "react-quill/dist/quill.snow.css";
import { saveAs } from "file-saver";
import * as htmlDocx from 'html-docx-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from "next/navigation";

const Ocr = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const performOCR = () => {
    if (!image) return;
    setLoading(true);
    Tesseract.recognize(image, "eng", {
      logger: (m) => console.log(m),
    })
      .then((result) => {
        if (result && result.data && result.data.text) {
          setText(result.data.text); // Safely set the extracted text
        } else {
          console.error("OCR result is missing text");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const DynamicEditor = useMemo(() => {
    return dynamic(() => import("react-quill"), {
      ssr: false,
      loading: () => <p>Loading...</p>,
    });
  }, []);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const handleCopyText = ()=> {
    const editorContent = document.querySelector('.ql-editor')?.innerText;
    if (!editorContent) return;

    // Use Clipboard API to copy text to clipboard
    navigator.clipboard.writeText(editorContent).then(
        () => {
            alert('Text copied to clipboard!');
        },
        (err) => {
            console.error('Failed to copy text: ', err);
        }
    );
};


const handleSaveAsPDF = async () => {
  const content = document.querySelector('#editorWrapper .ql-editor');
  if (!content) return;

  const canvas = await html2canvas(content);
  const imgData = canvas.toDataURL('image/png');

  // Create a PDF with jsPDF and add the image from canvas
  const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Scale image to fit PDF page dimensions
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save('document.pdf');
};

const chooseNew = () => {
  window.location.reload()
}

  return (
    <div className="font-mono flex flex-col justify-center items-center w-full">
      <h1 className="text-xl font-semibold text-gray-700">
        Extract Text From Image with Tesseract
      </h1>
      <div className="m-10 p-5 shadow-lg shadow-black rounded-md">
        <label htmlFor="image" className="text-lg">
          Choose Image to Extract Text
        </label>{" "}
        <br /> <br />
        <input
          type="file"
          name="image"
          id="image"
          accept="image/"
          onChange={handleImageUpload}
        />
        {image && (<button className="shadow-lg shadow-black p-2 bg-red-700 m-5 text-white" onClick={chooseNew}>Choose another</button>)}
      </div>
      <div className="md:flex w-[100%] md:m-10">
          {image && (
            <div className="md:w-[40%] w-full shadow-lg shadow-black p-10 md:mx-10 rounded-md">
              <img src={image} alt="Uploaded" />
              <button
                onClick={performOCR}
                disabled={loading}
                className="shadow-lg shadow-black p-2 bg-red-700 my-5 text-white"
              >
                {loading ? "Processing..." : "Extract Text"}
              </button>
            </div>
          )}
  
        <div className="md:w-[60%] w-full my-5">
          {" "}
          {text && (
            <div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Extracted Text:
                </h3>
                <div id="editorWrapper">
                <DynamicEditor
                  modules={modules}
                  onChange={setText}
                  theme="snow"
                  className="h-[70vh]"
                  defaultValue={text}
                  />
                  </div>
              </div>
              <div className="mt-10">
              <button className="shadow-lg shadow-black p-2 bg-red-700 m-5 text-white" onClick={handleCopyText}>
                Copy Text
              </button>
              <button className="shadow-lg shadow-black p-2 bg-red-700 m-5 text-white" onClick={handleSaveAsPDF}>
                Save as PDF
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ocr;

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Tesseract from "tesseract.js";
import "react-quill/dist/quill.snow.css";
import { saveAs } from "file-saver";
import htmlDocx from 'html-docx-js'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Ocr = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSaveAsWord = () => {
    const content = document.querySelector('#editorWrapper .ql-editor').innerHTML;
    const blob = htmlDocx.asBlob(content);
    saveAs(blob, 'document.docx');
};

const handleSaveAsPDF = () => {
  const content = document.querySelector('#editorWrapper .ql-editor').innerHTML;
  const doc = new jsPDF();

  doc.fromHTML(content, 15, 15, {
      width: 170,
      elementHandlers: {
          '.ql-editor': function(element, renderer) {
              return true;
          }
      }
  });

  doc.save('document.pdf');
};

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
      </div>
      <div className="md:flex w-[100%] m-10">
        <div className="md:w-[40%] w-full shadow-lg shadow-black p-10 mx-10 rounded-md">
          {" "}
          {image && (
            <div>
              <img src={image} alt="Uploaded" style={{ maxWidth: "400px" }} />
              <button
                onClick={performOCR}
                disabled={loading}
                className="shadow-lg shadow-black p-2 bg-red-700 my-5 text-white"
              >
                {loading ? "Processing..." : "Extract Text"}
              </button>
            </div>
          )}
        </div>
        <div className="md:w-[60%] w-full">
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
              <button className="shadow-lg shadow-black p-2 bg-red-700 m-5 text-white" onClick={handleSaveAsWord}>
                Save as Word
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

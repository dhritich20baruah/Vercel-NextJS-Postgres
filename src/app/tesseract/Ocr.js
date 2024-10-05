import React, { useState } from "react";
import Tesseract from "tesseract.js";

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

  return (
    <div>
      <h1>OCR with Tesseract</h1>
      <input
        type="file"
        name="image"
        id="image"
        accept="image/"
        onChange={handleImageUpload}
      />
      {image && (
        <div>
          <img src={image} alt="Uploaded" style={{ maxWidth: "400px" }} />
          <button
            onClick={performOCR}
            disabled={loading}
            className="shadow-lg shadow-black p-2"
          >
            {loading ? "Processing..." : "Extract Text"}
          </button>
        </div>
      )}
      {text && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default Ocr;

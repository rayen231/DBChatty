import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { FaTrash } from "react-icons/fa";

interface LibraryProps {
  backendUrl: string;
}

const Library: React.FC<LibraryProps> = ({ backendUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [files, setFiles] = useState<string[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<Uint8Array | null>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter((file) =>
        file.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, files]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${backendUrl}/get_files_basenames`);
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      const filesWithExtension = data.files.map((file) =>
        file.endsWith(".pdf") ? file : `${file}.pdf`
      );
      setFiles(filesWithExtension);
      setFilteredFiles(filesWithExtension);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleAddDocument = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("file_type", selectedFile.type);
    formData.append("language", selectedLanguage);

    try {
      setIsLoading(true);

      const response = await fetch(`${backendUrl}/add_file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUploadStatus(data.status);

      setSelectedFile(null);
      setSelectedLanguage("en");
      setIsModalOpen(false);
      fetchFiles();
    } catch (error) {
      if (error instanceof Error) {
        console.error("There was a problem with the fetch operation:", error);
        setUploadStatus(`File upload failed: ${error.message}`);
      } else {
        console.error("Unexpected error", error);
        setUploadStatus("File upload failed due to an unexpected error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = async (filepath: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/get_pdf?filename=${encodeURIComponent(filepath)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the PDF file");
      }
      const arrayBuffer = await response.arrayBuffer();
      setPdfFile(new Uint8Array(arrayBuffer));
    } catch (error) {
      console.error("Error fetching PDF file:", error);
      setPdfFile(null);
    }
  };
  const handleDelete = async (filename: string) => {
    console.log("Attempting to delete file:", filename);
  
    try {
      const response = await fetch(
        `${backendUrl}/delete_file/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );
  
      console.log("Delete response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Delete response error data:", errorData);
        throw new Error(errorData.message || "Failed to delete the file");
      }
  
      const data = await response.json();
      console.log("Delete response data:", data);
  
      if (data.status === "success") {
        // Remove the deleted file from both files and filteredFiles
        setFiles((prevFiles) => prevFiles.filter((file) => file !== filename));
        setFilteredFiles((prevFiles) =>
          prevFiles.filter((file) => file !== filename)
        );
      } else {
        console.error("Failed to delete file:", data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting file:", error.message);
      } else {
        console.error("Unexpected error", error);
      }
    }
  };
  

  return (
    <div className="flex w-screen flex-1">
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-2xl mb-4">Search</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded outline-none w-full"
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-4"
          onClick={handleAddDocument}
        >
          + Add Document
        </button>
        <ul className="list-none p-0">
          {filteredFiles.map((file, index) => (
            <li
              key={index}
              className="p-2 mb-2 bg-gray-800 rounded flex justify-between items-center overflow-hidden"
            >
              <span
                className="text-ellipsis overflow-hidden whitespace-nowrap flex-1 cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                {file}
              </span>
              <button
                className="bg-red-500 text-white rounded py-1 px-2 ml-2 flex-shrink-0"
                onClick={() => handleDelete(file)}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row w-full p-4 bg-gray-700 justify-center items-center">
        {pdfFile ? (
          <div className="w-full h-svh border border-gray-300 overflow-hidden">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfFile}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        ) : (
          <p className="text-white">No PDF selected</p>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl mb-4">Add New Document</h2>
            <input
              type="file"
              accept=".csv,.docx,.pdf,.txt"
              onChange={handleFileChange}
              className="mb-4"
            />
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="mb-4 p-2 border border-gray-300 rounded"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
            </select>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleUpload}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;

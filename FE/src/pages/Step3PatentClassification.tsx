import { useState } from "react";
import Title from "../components/common/Title";
import PatentFileUpload from "../components/Step3/PatentFileUpload";
import PatentTable from "../components/Step3/PatentTable";

function Step3PatentClassification() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);

  // 파일 처리 완료 핸들러
  const handleFileProcessed = (file: File, buffer: ArrayBuffer) => {
    setUploadedFile(file);
    setFileBuffer(buffer);
  };

  return (
    <div className="p-8 pb-6 flex flex-col justify-stretch grow">
      <Title
        text="분류 데이터 분류"
        subText="분류할 특허 데이터 파일을 업로드해주세요. 이전 단계에서 설정한 분류체계에 따라 AI가 자동으로 특허를 분류합니다."
      />

      {!uploadedFile || !fileBuffer ? (
        <PatentFileUpload onFileProcessed={handleFileProcessed} />
      ) : (
        <PatentTable file={uploadedFile} fileBuffer={fileBuffer} />
      )}
    </div>
  );
}

export default Step3PatentClassification;

import React, { useState, useRef } from "react";
import { CloudUpload } from "lucide-react";
import Button from "../common/Button";
import { ClipLoader } from "react-spinners";

interface PatentFileUploadProps {
  onFileProcessed?: (file: File, buffer: ArrayBuffer) => void;
}

const PatentFileUpload: React.FC<PatentFileUploadProps> = ({
  onFileProcessed,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supportedFormats = ["CSV", "XLSX"];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatString = supportedFormats.join(", ");

  // 파일 업로드 처리 함수
  const handleFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toUpperCase();
    if (extension && supportedFormats.includes(extension)) {
      setIsLoading(true);

      // 파일 읽기 객체 생성
      const reader = new FileReader();

      // 파일 읽기 완료 시 함수
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // target이 null이 아닌지 확인
        if (e.target && e.target.result && onFileProcessed) {
          const fileReader = e.target as FileReader;
          // result가 존재하는지 확인
          if (fileReader.result) {
            setTimeout(() => {
              // 파일과 버퍼 데이터 부모 컴포넌트로 전달
              onFileProcessed(file, fileReader.result as ArrayBuffer);
              setIsLoading(false);
            }, 1000);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      };

      // 파일 읽기 중 오류 시
      reader.onerror = () => {
        alert("파일을 읽는 중 오류가 발생했습니다.");
        setIsLoading(false);
      };

      // 파일 읽기 시작
      reader.readAsArrayBuffer(file);
    } else {
      alert(`지원하는 파일 형식만 업로드 가능합니다: ${formatString}`);
    }
  };

  // 파일 입력 처리 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // 드래그 이벤트 핸들러
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // 드롭 이벤트 핸들러
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full rounded-lg">
      <div className="pt-24 px-20 w-full">
        {isLoading ? (
          // 로딩
          <div className="flex flex-col items-center justify-center w-full p-16 border border-[#E3E6EA] rounded-lg bg-white shadow-[0_2px_4px_rgba(25,33,61,0.08)] h-96">
            <ClipLoader
              color="#3b82f6"
              loading={true}
              size={50}
              aria-label="Loading"
            />
            <p className="mt-4 text-primary-gray font-samsung400">Loading</p>
          </div>
        ) : (
          // 파일 업로드
          <div
            className={`relative flex flex-col items-center justify-center w-full p-16 border border-[#E3E6EA] rounded-lg transition-colors bg-white shadow-[0_2px_4px_rgba(25,33,61,0.08)] ${
              dragActive ? "border-primary-blue bg-gray-100" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative p-8 rounded-full">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, #8DC1FF, transparent)",
                    opacity: 0.6,
                  }}
                />
                <CloudUpload className="relative w-8 h-8 text-primary-blue" />
              </div>

              <h3 className="text-base text-primary-black font-samsung400 mt-4">
                특허 문서 파일을 여기에 업로드 해 주세요.
              </h3>

              <p className="text-xs text-primary-gray text-center font-samsung400">
                파일을 이 영역에 끌어다 놓거나 '파일 선택' 버튼을 클릭하여
                업로드할 수 있습니다.
              </p>

              <p className="text-xs text-primary-gray font-samsung400">
                지원 형식: {formatString}
              </p>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.xlsx"
                onChange={handleChange}
              />

              <Button variant="primary" size="md" onClick={handleButtonClick}>
                파일 선택
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 이전/다음 버튼 영역 */}
      <div className="flex justify-between w-full mt-10">
        <Button variant="outline" size="md" className="w-24">
          이전
        </Button>
        <Button variant="primary" size="md" className="w-24">
          다음
        </Button>
      </div>
    </div>
  );
};

export default PatentFileUpload;

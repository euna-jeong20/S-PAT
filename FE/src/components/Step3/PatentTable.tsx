import React from "react";

interface PatentTableProps {
  file: File;
  fileBuffer: ArrayBuffer;
}

const PatentTable: React.FC<PatentTableProps> = ({ file, fileBuffer }) => {
  // fileBuffer가 없다면
  if (!fileBuffer) {
    return (
      <div className="flex flex-col w-full h-full pt-8">
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white h-96 overflow-auto">
          <div className="mb-4 text-red-500">
            <p>
              <strong>오류:</strong> 파일 데이터를 읽을 수 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // fileBuffer가 있다면
  const bufferSize = fileBuffer.byteLength;

  return (
    <div className="flex flex-col w-full h-full pt-8">
      <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white h-96 overflow-auto">
        <div className="mb-4">
          <p>
            <strong>파일명:</strong> {file.name}
          </p>
          <p>
            <strong>파일 크기:</strong> {(bufferSize / 1024).toFixed(2)} KB
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <p>ArrayBuffer가 성공적으로 생성되었습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PatentTable;

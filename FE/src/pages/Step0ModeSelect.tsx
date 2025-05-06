import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ChartNoAxesCombined, Check, FileText } from "lucide-react";

// 세션 ID 생성 및 저장 함수
const createSessionId = () => {
  const sessionId = Math.random().toString(36).substring(2, 10);
  localStorage.setItem("sessionId", sessionId);
  return sessionId;
};

const Step0ModeSelect: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* 앱 소개 섹션 */}
          <div className="text-center mb-14">
            <h1 className="font-pretendard font-bold text-primary-black text-5xl mb-6">
              S-PAT (Samsung Patent AI Technology)
            </h1>
            <p className="font-samsung400 text-primary-gray text-lg max-w-2xl mx-auto">
              SPAT은 AI 기반 특허 분류 시스템으로, 효율적인 특허 관리와 분석을
              지원합니다.
            </p>
            <p className="font-samsung400 text-primary-gray text-lg max-w-2xl mx-auto mb-6">
              특허 문서를 빠르고 정확하게 분류하여 업무 효율성을 높이세요.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-gray-100 font-samsung400 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center">
                <BadgeCheck
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  color="white"
                  strokeWidth={1}
                />
                AI 기반 분류
              </div>
              <div className="bg-gray-100 font-samsung400 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center">
                <FileText
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  color="white"
                  strokeWidth={1}
                />
                특허 문서 관리
              </div>
              <div className="bg-gray-100 font-samsung400 px-4 py-2 rounded-full text-sm font-medium text-gray-700 flex items-center">
                <ChartNoAxesCombined className="h-4 w-4 mr-1" />
                데이터 분석
              </div>
            </div>
          </div>

          {/* 모드 선택 섹션 */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {/* 사용자 모드 */}
            <Link
              to="/user/step1"
              onClick={() => createSessionId()}
              className="flex-1 p-6 rounded-lg border-2 shadow-md border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 font-samsung700">
                  사용자 모드
                </h2>
              </div>

              <p className="text-sm text-primary-gray mb-4 font-samsung400">
                자신만의 기술 분류 체계로 특허를 스마트하게 정리하세요. 최적화된
                AI가 복잡한 특허 문서를 정확히 분류합니다.
              </p>

              <ul className="text-sm text-gray-600 space-y-2 ml-1 font-samsung400">
                <li className="flex items-center ">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-primary-blue"
                  />
                  사용자 맞춤화 특허 분류 체계 생성
                </li>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-primary-blue"
                  />
                  AI 기반 특허 데이터 자동 분류
                </li>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-primary-blue"
                  />
                  분류 결과 확인 및 다운로드
                </li>
              </ul>
            </Link>

            {/* 관리자 모드 */}
            <Link
              to="/admin/step1"
              onClick={() => createSessionId()}
              className="flex-1 p-6 rounded-lg border-2 shadow-md border-gray-200 hover:border-[#ae9aff] hover:bg-[#EEF1FF] hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 font-samsung700">
                  관리자 모드
                </h2>
              </div>

              <p className="text-sm text-primary-gray mb-4 font-samsung400">
                최신 LLM들의 특허 분류 성능을 객관적으로 비교하고 평가하세요.
                정밀한 분석을 통해 가장 효과적인 AI 모델을 선별합니다.
              </p>

              <ul className="text-sm text-gray-600 space-y-2 ml-1 font-samsung400">
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-[#5D3FD3]"
                  />
                  다중 LLM 병렬 분류
                </li>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-[#5D3FD3]"
                  />
                  벡터 유사도 기반 정량적 평가
                </li>
                <li className="flex items-center">
                  <Check
                    strokeWidth={3}
                    className="h-4 w-4 mr-2 text-[#5D3FD3]"
                  />
                  LLM 자체 평가 및 전문가 피드백 시스템
                </li>
              </ul>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Step0ModeSelect;

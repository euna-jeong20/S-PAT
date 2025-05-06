import React from "react";
import { Moon, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

const SideBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // admin인지 user인지 확인
  const isAdminMode = currentPath.includes("/admin");
  const mode = isAdminMode ? "admin" : "user";

  // 현재 스텝 확인
  const currentStep = currentPath.includes("step1")
    ? 1
    : currentPath.includes("step2")
    ? 2
    : currentPath.includes("step3")
    ? 3
    : currentPath.includes("step4")
    ? 4
    : 1; // 기본값 step1

  // 다크 모드 상태 관리
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  // 다크 모드 토글 핸들러
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Todo : 다크 모드 적용 로직 추가
  };

  // 새 특허 프로세스 시작
  // Todo : 모달 추가
  const startNewPatent = () => {
    navigate(`/${mode}/step1`);
  };

  return (
    <div className="w-1/5 p-6 flex flex-col">
      {/* 로고 영역 */}
      <div className="flex items-center justify-center mb-8 p-2">
        <h1 className="text-logo font-bold text-blue-600">S-PAT</h1>
      </div>

      {/* step 영역 */}
      <div className="flex-1">
        {/* Step 1 */}
        <div
          className={`mb-4 rounded-md ${
            currentStep === 1 ? "bg-white shadow" : ""
          }`}>
          <div className="px-4 py-3">
            <p
              className={`${
                currentStep === 1
                  ? "text-[#19213D] font-[14px] font-samsung400"
                  : "text-primary-gray font-[14px] font-samsung400"
              }`}>
              Step 1 특허 분류 체계 준비
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div
          className={`mb-4 rounded-md ${
            currentStep === 2 ? "bg-white shadow" : ""
          }`}>
          <div className="px-4 py-3">
            <p
              className={`${
                currentStep === 2
                  ? "text-[#19213D] font-[14px] font-samsung400"
                  : "text-primary-gray font-[14px] font-samsung400"
              }`}>
              Step 2 특허 분류 체계 수정
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div
          className={`mb-4 rounded-md ${
            currentStep === 3 ? "bg-white shadow" : ""
          }`}>
          <div className="px-4 py-3">
            <p
              className={`${
                currentStep === 3
                  ? "text-[#19213D] font-[14px] font-samsung400"
                  : "text-primary-gray font-[14px] font-samsung400"
              }`}>
              Step 3 특허 데이터 분류
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div
          className={`mb-4 rounded-md ${
            currentStep === 4 ? "bg-white shadow" : ""
          }`}>
          <div className="px-4 py-3">
            <p
              className={`${
                currentStep === 4
                  ? "text-[#19213D] font-[14px] font-samsung400"
                  : "text-primary-gray font-[14px] font-samsung400"
              }`}>
              Step 4 특허 데이터 분류 결과
            </p>
          </div>
        </div>
      </div>

      {/* 하단 영역 */}
      <div className="mt-auto">
        {/* 다크모드 토글 */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center">
            <Moon className="h-5 w-5 text-primary-gray mr-2" />
            <span className="text-primary-gray text-[14px] font-samsung400">
              Dark mode
            </span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              id="darkModeToggle"
              className="sr-only"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <div
              className={`block w-12 h-6 rounded-full transition ${
                isDarkMode ? "bg-black" : "bg-gray-300"
              }`}
              onClick={toggleDarkMode}></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                isDarkMode ? "translate-x-6" : "translate-x-0"
              }`}
              onClick={toggleDarkMode}></div>
          </div>
        </div>

        {/* 새 특허 시작 버튼 */}
        <Button
          onClick={startNewPatent}
          icon={<Plus className="h-5 w-5" />}
          size="lg">
          Start new patent
        </Button>
      </div>
    </div>
  );
};

export default SideBar;

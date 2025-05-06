import React, { useState, useRef, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import IntroContent from "./IntroContent";
import Prompt from "./Prompt";
import Button from "../common/Button"; // Button 컴포넌트 import
import axios from "axios";

// 메시지 타입 정의
type MessageType = "user" | "assistant";

// 표준 항목 인터페이스
interface Standard {
  code: string;
  level: string;
  name: string;
  description: string;
}

// 메시지 타입 정의 (문자열 내용 또는 표준 배열 내용)
interface Message {
  type: MessageType;
  content: string | Standard[];
  timestamp: Date;
}

const ChatContent: React.FC = () => {
  // 상태 관리
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedTables, setExpandedTables] = useState<number[]>([]); // 확장된 테이블 인덱스 추적
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null); // 선택된 메시지 인덱스
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // 진행하기 버튼 로딩 상태
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 표시 여부
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);

  // 스크롤을 위한 ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 대화가 시작되었는지 여부
  const chatStarted = messages.length > 0;

  // 메시지가 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 컴포넌트 마운트 시 대화 기록 불러오기
  useEffect(() => {
    const fetchConversationHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const session_id = "123123123"; // 하드코딩된 세션 ID 사용
        const result = await axios.get(
          `https://s-pat.site/api/standard/${session_id}/conversation`
        );

        console.log("Conversation History:", result.data);

        // 대화 기록이 있는 경우 메시지 상태로 변환
        if (result.data && result.data.length > 0) {
          const historyMessages: Message[] = [];

          // 각 대화 항목을 Message 객체로 변환
          result.data.forEach((item: any) => {
            // 사용자 메시지 추가
            historyMessages.push({
              type: "user",
              content: item.query,
              timestamp: new Date(item.created_at),
            });

            // AI 응답 메시지 추가 (표준 배열)
            if (item.answer && item.answer.standards) {
              historyMessages.push({
                type: "assistant",
                content: item.answer.standards,
                timestamp: new Date(item.created_at),
              });
            }
          });

          // 대화 기록을 메시지 상태에 설정
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error("Error fetching conversation history:", error);
        // 오류 발생 시 빈 메시지 배열로 초기화
        setMessages([]);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    // 함수 호출
    fetchConversationHistory();
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // API 호출 함수
  const fetchAssistantResponse = async (prompt: string) => {
    const session_id = "123123123";
    const result = await axios.post(
      `https://s-pat.site/api/standard/${session_id}`,
      { query: prompt }
    );
    console.log("API Response:", result.data);
    return result.data;
  };

  // 메시지 제출 핸들러
  const handleSubmit = async (promptText: string) => {
    if (!promptText.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      type: "user",
      content: promptText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // API 호출
      const response = await fetchAssistantResponse(promptText);

      // 응답 메시지 추가
      const assistantMessage: Message = {
        type: "assistant",
        content: response.standards,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);

      // 에러 메시지 추가
      const errorMessage: Message = {
        type: "assistant",
        content: "아직 통신이 원활하지 않습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 테이블 확장/축소 토글 함수
  const toggleTableExpansion = (messageIndex: number) => {
    setExpandedTables((prev) => {
      if (prev.includes(messageIndex)) {
        return prev.filter((index) => index !== messageIndex);
      } else {
        return [...prev, messageIndex];
      }
    });
  };

  // 테이블 선택 토글 함수 (단순화)
  const toggleTableSelection = (messageIndex: number) => {
    setSelectedMessageIndex((prev) =>
      prev === messageIndex ? null : messageIndex
    );
  };

  // 진행하기 버튼 클릭 핸들러
  const handleProceed = () => {
    // 모달 표시
    setShowModal(true);
  };

  // 모달 확인 버튼 핸들러
  const handleModalConfirm = async () => {
    setIsProcessing(true); // 로딩 상태 시작
    try {
      console.log("진행하기 버튼 클릭됨");
    } catch (error) {
      console.error("진행 중 오류가 발생했습니다:", error);
      // 오류 처리 로직
    } finally {
      setIsProcessing(false); // 로딩 상태 종료
    }
  };

  // 모달 취소 버튼 핸들러
  const handleModalCancel = () => {
    setShowModal(false);
  };

  // 표준 테이블 렌더링 함수
  const renderStandardsTable = (
    standards: Standard[],
    messageIndex: number
  ) => {
    const isExpanded = expandedTables.includes(messageIndex);
    const displayedStandards = isExpanded ? standards : standards.slice(0, 5);
    const showMoreButton = standards.length > 5;

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-800">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-900">코드</th>
                <th className="px-4 py-3 font-medium text-gray-900">분류</th>
                <th className="px-4 py-3 font-medium text-gray-900">이름</th>
                <th className="px-4 py-3 font-medium text-gray-900">설명</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border-t border-gray-200">
              {displayedStandards.map((standard, index) => (
                <tr
                  key={standard.code}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">{standard.code}</td>
                  <td className="px-4 py-3">{standard.level}</td>
                  <td className="px-4 py-3">{standard.name}</td>
                  <td className="px-4 py-3 max-w-md">
                    <div className="line-clamp-2">{standard.description}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 더 보기/접기 버튼 */}
        {showMoreButton && (
          <div
            className="flex justify-center items-center p-2 bg-gray-50 border-t border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() => toggleTableExpansion(messageIndex)}>
            <span className="text-blue-600 font-medium text-sm">
              {isExpanded ? "접기" : "더 보기"}
            </span>
            <svg
              className={`ml-1 w-5 h-5 text-blue-600 transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </div>
    );
  };

  // AI 로딩 컴포넌트
  const LoadingIndicator = () => (
    <div className="flex justify-start mb-6">
      <div className="flex items-center gap-4">
        <ClipLoader
          color="#3b82f6"
          loading={true}
          size={25}
          aria-label="로딩 중"
        />
        <div className="flex flex-col">
          <p className="text-blue-500 font-samsung700 text-sm">
            AI가 분류체계를 생성 중입니다. 잠시만 기다려주세요...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    // absolute 위치 지정을 위한 relative 컨테이너
    <div className="relative h-full">
      {/* 메시지 영역 - 입력 영역 높이보다 큰 여백을 주어 내용이 짤리지 않도록 함 */}
      <div className="absolute top-0 left-0 right-0 bottom-[180px] overflow-y-auto p-6">
        {!chatStarted ? (
          // 대화가 시작되지 않았으면 IntroContent 표시
          <div className="flex justify-center items-center h-full pt-12">
            <div className="w-full max-w-5xl">
              {isHistoryLoading ? (
                <div className="flex justify-center">
                  <ClipLoader
                    color="#3b82f6"
                    loading={true}
                    size={40}
                    aria-label="대화 기록 로딩 중"
                  />
                  <p className="ml-4 text-blue-500 font-samsung700">
                    이전 대화 기록을 불러오는 중입니다...
                  </p>
                </div>
              ) : (
                <IntroContent />
              )}
            </div>
          </div>
        ) : (
          // 대화가 시작되었으면 채팅 메시지 표시
          <>
            {messages.map((message, index) => {
              const isUser = message.type === "user";
              const formattedTime = message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const isSelected = selectedMessageIndex === index;
              const isStandardArray = !isUser && Array.isArray(message.content);

              return (
                <div key={index} className="mb-6">
                  {/* 사용자 정보와 메시지 */}
                  {isUser ? (
                    <div className="mb-4">
                      {/* 사용자 프로필 및 시간 */}
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-indigo-900 text-white rounded-full flex items-center justify-center mr-2">
                          <span className="text-sm font-samsung700">S</span>
                        </div>
                        <span className="font-medium text-sm">User</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {formattedTime}
                        </span>
                      </div>
                      {/* 사용자 메시지 */}
                      <div className="pl-10">
                        <div className="text-primary-gray font-pretendard font-normal rounded-lg">
                          {message.content as string}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      {/* AI 프로필 및 시간 */}
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                          <span className="text-sm">S</span>
                        </div>
                        <span className="font-medium text-sm">S-PAT</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {formattedTime}
                        </span>

                        {/* 표준 배열인 경우에만 선택 버튼 표시 */}
                        {isStandardArray && (
                          <div className="ml-auto">
                            <Button
                              variant={isSelected ? "primary" : "outline"}
                              size="sm"
                              onClick={() => toggleTableSelection(index)}>
                              {isSelected ? "선택완료" : "선택하기"}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* AI 메시지 - 타입에 따라 렌더링 */}
                      <div className="pl-10">
                        <div
                          className={`bg-white font-pretendard font-medium text-gray-800 rounded-lg px-4 py-2 shadow-sm 
                            transition-all duration-200 
                            ${
                              isSelected
                                ? "border-2 border-blue-500"
                                : "border border-transparent"
                            }`}>
                          {typeof message.content === "string" ? (
                            // 일반 텍스트인 경우
                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>
                          ) : (
                            // 표준 배열인 경우
                            renderStandardsTable(message.content, index)
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {/* 로딩 표시 - react-spinners 사용 */}
            {isLoading && <LoadingIndicator />}

            {/* 스크롤 참조 - 여백 추가 */}
            <div ref={messagesEndRef} className="pb-4" />
          </>
        )}
      </div>

      {/* 진행하기 버튼 영역 - 메시지 영역과 입력 영역 사이 */}
      {selectedMessageIndex !== null && (
        <div className="absolute bottom-[120px] right-4 flex justify-center items-center py-4">
          <Button
            variant="primary"
            size="md"
            onClick={handleProceed}
            isLoading={isProcessing}>
            진행하기
          </Button>
        </div>
      )}

      {/* 모달 컴포넌트 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={handleModalCancel}></div>

          {/* 모달 내용 */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-10">
            {/* 모달 헤더 */}
            <div className="px-4 pt-4 mt-6">
              <h3 className="text-lg font-pretendard font-semibold text-black">
                해당 분류체계를 진행하시겠습니까?
              </h3>
            </div>

            {/* 모달 본문 */}
            <div className="px-4 py-2 font-pretendard text-primary-gray">
              <p>진행하기 버튼을 누르시면 다음 단계로 넘어갑니다.</p>
            </div>

            {/* 모달 푸터 (버튼 영역) */}
            <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-2">
              <Button variant="outline" size="md" onClick={handleModalCancel}>
                취소
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleModalConfirm}
                isLoading={isProcessing}>
                진행하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 입력 영역 - 항상 하단에 고정 */}
      <div className="absolute bottom-0 left-0 right-0">
        <Prompt onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChatContent;

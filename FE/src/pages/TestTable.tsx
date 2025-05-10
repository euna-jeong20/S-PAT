import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { ListFilter, Search } from "lucide-react";

import type { ColDef, RowSelectionOptions } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const CustomButtonComponent = () => {
  return <button onClick={() => window.alert("clicked")}>Push Me!</button>;
};

const MissionResultRenderer = (params: CustomCellRendererProps) => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      height: "100%",
      alignItems: "center",
    }}>
    {
      <img
        alt={`${params.value}`}
        src={`https://www.ag-grid.com/example-assets/icons/${
          params.value ? "tick-in-circle" : "cross-in-circle"
        }.png`}
        style={{ width: "auto", height: "auto" }}
      />
    }
  </span>
);

// 그리드 예제 컴포넌트 생성
const TestTable = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const [quickFilterText, setQuickFilterText] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 참조 (외부 클릭 감지용)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 표시 상태

  // 외부 클릭 감지 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 행 데이터: 표시될 데이터
  const [rowData, setRowData] = useState<any[]>([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
  ]);

  // 컬럼 정의: 그리드 컬럼을 정의하고 제어함
  const [colDefs, setColDefs] = useState<ColDef<any, any>[]>([
    {
      headerName: "#",
      colId: "rowNum",
      valueGetter: "node.id",
      width: 80,
      // pinned: "left",
      // lockPinned: true,
      // lockPosition: "left",
    },
    { field: "make" }, // 제조사 필드
    { field: "model" }, // 모델 필드
    { field: "price" }, // 가격 필드
    { field: "electric", cellRenderer: MissionResultRenderer }, // 전기차 여부 필드
    { field: "button", cellRenderer: CustomButtonComponent },
  ]);

  // 기본 컬럼 정의: 모든 컬럼에 적용될 기본 속성
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1, // 컬럼이 사용 가능한 공간을 균등하게 나눠 가짐
      // filter: true,
      // floatingFilter: true,
      editable: true,
      sortable: true,
      unSortIcon: true,
      rowDrag: true,
      // width: 150,
      // cellStyle: { fontWeight: "bold" },
      // lockPinned: true,
    };
  }, []);

  const rowSelection: RowSelectionOptions = useMemo(() => {
    return {
      mode: "multiRow",
      enableClickSelection: true,
      enableSelectionWithoutKeys: true,
    };
  }, []);

  const clearSort = useCallback(() => {
    gridRef.current!.api.applyColumnState({
      defaultState: { sort: null },
    });
  }, []);

  const resetState = useCallback(() => {
    gridRef.current!.api.resetColumnState();
    console.log("column state reset");
  }, []);

  const onRemoveSelected = useCallback(() => {
    const selectedRowData = gridRef.current!.api.getSelectedRows();
    gridRef.current!.api.applyTransaction({ remove: selectedRowData });
  }, []);

  // 컨테이너: 그리드의 테마와 크기를 정의
  return (
    <>
      <button onClick={clearSort}>Clear Sort</button>
      <button onClick={resetState}>Reset State</button>
      <button onClick={onRemoveSelected}>Remove Selected</button>

      {/* Column 필터 영역 */}
      <div className="flex relative items-center space-x-2" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 h-8 text-sm font-semibold text-gray-500">
          <ListFilter className="h-4 w-4" />
          <span>Columns</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-8 z-20 w-52 max-h-72 p-1 bg-white border border-gray-200 rounded-md overflow-auto shadow-md">
            {/* 개별 컬럼 선택 */}
            {colDefs.map((column) => (
              <div
                key={column.field}
                className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100/80 rounded-md ">
                <span className="text-sm font-pretendard truncate">
                  {column.field}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 검색 영역 */}
      <div className="relative">
        <input
          type="text"
          value={quickFilterText}
          onChange={(e) => setQuickFilterText(e.target.value)}
          placeholder="Search"
          className="w-56 h-8 pl-7 pr-3 py-1 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <Search
          className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 opacity-40"
          strokeWidth={3}
        />
      </div>
      <div className="h-screen w-full">
        <AgGridReact
          rowData={rowData} // 표시할 데이터
          columnDefs={colDefs} // 컬럼 정의
          defaultColDef={defaultColDef} // 기본 컬럼 속성
          rowSelection={rowSelection} // 행 선택
          onCellValueChanged={(event) =>
            console.log(`New Cell Value: ${event.value}`)
          }
          // animateRows={false}
          // alwaysMultiSort={true}
          ref={gridRef}
          // loading={loading}
          quickFilterText={quickFilterText}
          suppressDragLeaveHidesColumns={true}
          rowDragManaged={true}
          rowDragMultiRow={true}
          // rowDragEntireRow={true}

          // suppressMoveWhenRowDragging={true}
        />
      </div>
    </>
  );
};

export default TestTable;

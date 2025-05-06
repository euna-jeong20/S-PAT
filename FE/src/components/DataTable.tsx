import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  Check,
  Save,
  Trash2,
  Plus,
} from "lucide-react";

// 데이터 타입 정의
type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  status: "active" | "inactive";
};

// 샘플 데이터
const defaultData: Person[] = [
  {
    id: 1,
    firstName: "철수",
    lastName: "김",
    age: 25,
    email: "kim@example.com",
    status: "active",
  },
  {
    id: 2,
    firstName: "영희",
    lastName: "이",
    age: 32,
    email: "lee@example.com",
    status: "active",
  },
  {
    id: 3,
    firstName: "민준",
    lastName: "박",
    age: 28,
    email: "park@example.com",
    status: "inactive",
  },
  {
    id: 4,
    firstName: "지영",
    lastName: "최",
    age: 35,
    email: "choi@example.com",
    status: "active",
  },
  {
    id: 5,
    firstName: "현우",
    lastName: "정",
    age: 22,
    email: "jung@example.com",
    status: "inactive",
  },
];

// 컬럼 헬퍼
const columnHelper = createColumnHelper<Person>();

// 체크박스 필터 드롭다운 컴포넌트
interface CheckboxFilterDropdownProps<T> {
  column: any;
  options: any[];
  optionKey: keyof T;
}

function CheckboxFilterDropdown<T>({
  column,
  options,
  optionKey,
}: CheckboxFilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterValue = (column.getFilterValue() as string[]) || [];

  // 임시 선택 상태를 관리 (확인 버튼 누르기 전까지는 실제 필터에 적용되지 않음)
  const [tempSelectedValues, setTempSelectedValues] = useState<any[]>([]);

  // 초기화 플래그 - 한 번만 실행되도록
  const initializedRef = useRef(false);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 컴포넌트 마운트 시 전체 선택으로 초기화
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // 처음에는 전체 선택으로 필터 설정 (값이 없을 때만)
      if (!filterValue.length) {
        column.setFilterValue([...options]);
      }
    }
  }, [options]);

  // 옵션이 변경될 때마다 현재 필터 값 업데이트
  useEffect(() => {
    // 새로운 옵션이 추가되었는지 확인
    const hasNewOptions = options.some(
      (option) => !filterValue.includes(option)
    );

    // 전체 선택 상태인 경우
    if (filterValue.length === 0 || filterValue.length === options.length - 1) {
      // 자동으로 모든 옵션 선택
      column.setFilterValue([...options]);
    }
    // 일부만 선택된 상태인 경우, 새로운 옵션은 추가하지 않음
    else if (hasNewOptions && filterValue.length > 0) {
      // 이미 선택된 옵션 유지
      // 아무것도 하지 않음
    }
  }, [options]);

  // 드롭다운이 열릴 때 임시 선택 상태 초기화
  useEffect(() => {
    if (isOpen) {
      // 이미 필터가 설정되어 있으면 해당 값 사용, 아니면 전체 선택
      if (filterValue.length > 0) {
        setTempSelectedValues([...filterValue]);
      } else {
        // 전체 선택 - 기본값
        setTempSelectedValues([...options]);
      }
    }
  }, [isOpen, options]); // 무한 루프 방지를 위해 filterValue 의존성 제거

  const handleCheckboxChange = (value: any) => {
    setTempSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSelectAll = () => {
    if (tempSelectedValues.length === options.length) {
      // 모두 선택된 경우, 모두 해제
      setTempSelectedValues([]);
    } else {
      // 일부만 선택되었거나 아무것도 선택되지 않은 경우, 모두 선택
      setTempSelectedValues([...options]);
    }
  };

  const applyFilter = () => {
    column.setFilterValue(
      tempSelectedValues.length ? tempSelectedValues : undefined
    );
    setIsOpen(false);
  };

  const cancelFilter = () => {
    // 취소 시 현재 필터 값으로 복원
    if (filterValue.length) {
      setTempSelectedValues([...filterValue]);
    } else {
      setTempSelectedValues([...options]);
    }
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // 정렬 토글 방지
    setIsOpen(!isOpen);
  };

  // 활성화된 필터가 있는지 확인
  const hasActiveFilters =
    filterValue.length > 0 && filterValue.length < options.length;

  // 선택된 항목이 있는지 확인 (확인 버튼 활성화 여부 결정)
  const hasSelection = tempSelectedValues.length > 0;

  // 전체 선택 상태 확인
  const isAllSelected = tempSelectedValues.length === options.length;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className={`ml-2 p-1 rounded ${
          hasActiveFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
        }`}
        onClick={toggleDropdown}
        title="필터">
        <Filter size={14} />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-3 h-3 text-xs flex items-center justify-center"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 right-0 bg-white border border-gray-200 rounded shadow-lg p-2 min-w-48">
          <div className="mb-2 text-xs font-bold pb-1 border-b flex justify-between items-center">
            <span>필터 선택</span>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  column.setFilterValue([...options]); // 전체 선택으로 설정
                  setTempSelectedValues([...options]);
                  setIsOpen(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
                title="필터 초기화 (전체 선택)">
                <Check size={14} />
              </button>
            )}
          </div>

          {/* 전체 선택 체크박스 */}
          <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-100">
            <input
              type="checkbox"
              id={`${column.id}-select-all`}
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="h-3 w-3"
            />
            <label
              htmlFor={`${column.id}-select-all`}
              className="text-xs font-medium">
              전체 선택
            </label>
          </div>

          <div className="max-h-48 overflow-y-auto my-1">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 my-1 hover:bg-gray-50 px-1 py-0.5 rounded">
                <input
                  type="checkbox"
                  id={`${column.id}-${option}`}
                  checked={tempSelectedValues.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="h-3 w-3"
                />
                <label
                  htmlFor={`${column.id}-${option}`}
                  className="text-xs truncate">
                  {option === "active"
                    ? "활성"
                    : option === "inactive"
                    ? "비활성"
                    : String(option)}
                </label>
              </div>
            ))}
          </div>

          {/* 확인/취소 버튼 */}
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
            <button
              onClick={cancelFilter}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              취소
            </button>
            <button
              onClick={applyFilter}
              disabled={!hasSelection}
              className={`px-2 py-1 text-xs rounded ${
                hasSelection
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 편집 가능한 셀 컴포넌트 (더블 클릭 방식)
interface EditableCellProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  row,
  column,
  table,
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  // 값이 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 편집 모드에서 자동으로 input에 포커스
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // 외부 클릭 감지하여 편집 모드 종료
  useEffect(() => {
    if (!isEditing) return;

    function handleClickOutside(event: MouseEvent) {
      if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
        finishEditing();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const finishEditing = () => {
    setIsEditing(false);

    // 값이 변경된 경우에만 업데이트
    if (value !== initialValue) {
      table.options.meta?.updateData(row.index, column.id, value);
    }
  };

  const handleDoubleClick = () => {
    // ID 컬럼은 편집 불가능
    if (column.id === "id") return;

    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      finishEditing();

      // 다음 셀로 이동 (선택 사항)
      if (e.key === "Tab") {
        const nextCell = document.querySelector(
          `[data-row="${row.index}"][data-col="${column.id + 1}"]`
        );
        if (nextCell) {
          (nextCell as HTMLElement).click();
        }
      }
    }

    if (e.key === "Escape") {
      setIsEditing(false);
      setValue(initialValue); // 취소 - 원래 값으로 복원
    }
  };

  // ID 컬럼은 편집 불가능
  if (column.id === "id") {
    return <div>{initialValue}</div>;
  }

  // 상태(active/inactive) 컬럼이면 셀렉트 박스로 편집
  if (column.id === "status") {
    return isEditing ? (
      <div ref={cellRef} className="relative">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={handleKeyDown}
          autoFocus
          className="p-1 border border-blue-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>
    ) : (
      <div
        onDoubleClick={handleDoubleClick}
        className="cursor-pointer"
        data-row={row.index}
        data-col={column.id}>
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            initialValue === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
          {initialValue === "active" ? "활성" : "비활성"}
        </span>
      </div>
    );
  }

  // 일반 텍스트 편집
  return isEditing ? (
    <div ref={cellRef}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={finishEditing}
        onKeyDown={handleKeyDown}
        className="p-1 border border-blue-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  ) : (
    <div
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
      title="더블클릭하여 편집"
      data-row={row.index}
      data-col={column.id}>
      {initialValue}
    </div>
  );
};

// DataTable 컴포넌트
const DataTable: React.FC = () => {
  // 상태 관리
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [data, setData] = useState<Person[]>([...defaultData]);
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [addRowPosition, setAddRowPosition] = useState<number | null>(null);
  const [newRow, setNewRow] = useState<Omit<Person, "id">>({
    firstName: "",
    lastName: "",
    age: 0,
    email: "",
    status: "active",
  });

  // 행 추가 모달 토글 함수
  const toggleAddRowModal = (position: number | null = null) => {
    setIsAddingRow(!isAddingRow);
    setAddRowPosition(position);

    // 새 행 폼 초기화
    setNewRow({
      firstName: "",
      lastName: "",
      age: 0,
      email: "",
      status: "active",
    });
  };

  // 새 행 추가 함수
  const addNewRow = () => {
    // 필수 필드 검증
    if (!newRow.firstName || !newRow.lastName || !newRow.email) {
      alert("이름, 성, 이메일 필드는 필수입니다.");
      return;
    }

    const newId = Math.max(...data.map((row) => row.id)) + 1;
    const rowToAdd = { id: newId, ...newRow };

    if (addRowPosition !== null) {
      // 특정 위치에 행 추가
      const newData = [...data];
      newData.splice(addRowPosition, 0, rowToAdd);
      setData(newData);
    } else {
      // 맨 끝에 행 추가
      setData([...data, rowToAdd]);
    }

    // 모달 닫기
    setIsAddingRow(false);
    setAddRowPosition(null);
  };

  // DataTable 컴포넌트 내부에서 삭제 함수 추가
  const deleteSelectedRows = () => {
    if (Object.keys(rowSelection).length === 0) {
      alert("삭제할 행을 선택해주세요.");
      return;
    }

    // 선택되지 않은 행만 필터링하여 새 데이터 생성
    const selectedIds = Object.keys(rowSelection).map((id) => parseInt(id));
    const newData = data.filter((_, index) => !selectedIds.includes(index));

    setData(newData);
    setRowSelection({});
  };

  // 테이블 데이터 업데이트 함수
  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  // 각 컬럼의 고유 값 추출
  const uniqueFirstNames = useMemo(
    () => Array.from(new Set(data.map((item) => item.firstName))),
    [data]
  );

  const uniqueLastNames = useMemo(
    () => Array.from(new Set(data.map((item) => item.lastName))),
    [data]
  );

  const uniqueAges = useMemo(
    () =>
      Array.from(new Set(data.map((item) => item.age))).sort((a, b) => a - b),
    [data]
  );

  const uniqueEmails = useMemo(
    () => Array.from(new Set(data.map((item) => item.email))),
    [data]
  );

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(data.map((item) => item.status))),
    [data]
  );

  // 데이터 변경 후 필터 자동 업데이트
  useEffect(() => {
    // 각 컬럼에 대해 현재 필터 값을 확인하고 필요시 업데이트
    table.getAllColumns().forEach((column) => {
      if (column.getCanFilter()) {
        const filterValue = (column.getFilterValue() as any[]) || [];

        // 컬럼 ID에 따라 해당 필드의 고유 값 가져오기
        let uniqueValues: any[] = [];

        switch (column.id) {
          case "firstName":
            uniqueValues = uniqueFirstNames;
            break;
          case "lastName":
            uniqueValues = uniqueLastNames;
            break;
          case "age":
            uniqueValues = uniqueAges;
            break;
          case "email":
            uniqueValues = uniqueEmails;
            break;
          case "status":
            uniqueValues = uniqueStatuses;
            break;
        }

        // 필터가 전체 선택인 경우 (모든 옵션 선택)
        if (
          filterValue.length === 0 ||
          filterValue.length === uniqueValues.length
        ) {
          column.setFilterValue([...uniqueValues]);
        }
        // 새로운 값 추가 여부 확인
        else {
          const newValues = uniqueValues.filter(
            (val) => !filterValue.includes(val)
          );

          // 필터 값에 새로운 값 포함 여부는 컬럼에 따라 달라질 수 있음
          // 필요에 따라 아래 조건을 변경하여 자동 추가 로직 구현
          if (newValues.length && false) {
            // 자동 포함 비활성화 (필요시 true로 변경)
            column.setFilterValue([...filterValue, ...newValues]);
          }
        }
      }
    });
  }, [
    uniqueFirstNames,
    uniqueLastNames,
    uniqueAges,
    uniqueEmails,
    uniqueStatuses,
  ]);

  // 컬럼 정의
  const columns = [
    // 선택 체크박스 컬럼
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-gray-300"
          />
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => <EditableCell {...info} />,
    }),
    columnHelper.accessor("firstName", {
      header: "이름",
      cell: (info) => <EditableCell {...info} />,
      filterFn: "arrIncludesSome",
      meta: {
        filterComponent: (props: any) => (
          <CheckboxFilterDropdown
            column={props.column}
            options={uniqueFirstNames}
            optionKey="firstName"
          />
        ),
      },
    }),
    columnHelper.accessor("lastName", {
      header: "성",
      cell: (info) => <EditableCell {...info} />,
      filterFn: "arrIncludesSome",
      meta: {
        filterComponent: (props: any) => (
          <CheckboxFilterDropdown
            column={props.column}
            options={uniqueLastNames}
            optionKey="lastName"
          />
        ),
      },
    }),
    columnHelper.accessor("age", {
      header: "나이",
      cell: (info) => <EditableCell {...info} />,
      filterFn: "arrIncludesSome",
      meta: {
        filterComponent: (props: any) => (
          <CheckboxFilterDropdown
            column={props.column}
            options={uniqueAges}
            optionKey="age"
          />
        ),
      },
    }),
    columnHelper.accessor("email", {
      header: "이메일",
      cell: (info) => <EditableCell {...info} />,
      filterFn: "arrIncludesSome",
      meta: {
        filterComponent: (props: any) => (
          <CheckboxFilterDropdown
            column={props.column}
            options={uniqueEmails}
            optionKey="email"
          />
        ),
      },
    }),
    columnHelper.accessor("status", {
      header: "상태",
      cell: (info) => <EditableCell {...info} />,
      filterFn: "arrIncludesSome",
      meta: {
        filterComponent: (props: any) => (
          <CheckboxFilterDropdown
            column={props.column}
            options={uniqueStatuses}
            optionKey="status"
          />
        ),
      },
    }),
  ];

  // 테이블 초기화
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // 메타 데이터에 데이터 업데이트 함수 전달
    meta: {
      updateData,
    },
    // 필터링 함수 등록
    filterFns: {
      arrIncludesSome: (row, columnId, filterValues) => {
        if (!filterValues?.length) return true;
        const value = row.getValue(columnId);
        return filterValues.includes(value);
      },
    },
  });

  return (
    <div className="p-4">
      {/* 전역 필터와 삭제 버튼 */}
      <div className="mb-4 flex items-center">
        <div className="flex-grow relative">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="모든 컬럼 검색..."
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <button
          onClick={() => toggleAddRowModal(null)}
          className="ml-2 p-2 rounded bg-green-500 text-white hover:bg-green-600">
          <Plus size={18} />
        </button>
        <button
          onClick={deleteSelectedRows}
          className={`ml-2 p-2 rounded ${
            Object.keys(rowSelection).length > 0
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 text-gray-400"
          }`}
          title="선택한 행 삭제">
          <Trash2 size={18} />
        </button>
      </div>

      {/* 안내 메시지 */}
      <div className="mb-2 text-xs text-gray-500">
        셀을 더블클릭하여 내용을 편집할 수 있습니다. ID 컬럼은 편집할 수
        없습니다.
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {/* 정렬 표시기 */}
                        {header.column.getIsSorted() && (
                          <span className="ml-1">
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </span>
                        )}
                      </div>

                      {/* 필터 아이콘 드롭다운 */}
                      {header.column.getCanFilter() &&
                        header.column.columnDef.meta?.filterComponent &&
                        header.column.columnDef.meta.filterComponent({
                          column: header.column,
                        })}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* 행 추가 버튼을 각 행 사이에 표시하기 위한 코드 - tbody 부분 수정 */}
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              <>
                {table.getRowModel().rows.map((row, rowIndex) => (
                  <React.Fragment key={row.id}>
                    <tr className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                    {/* 행 사이에 추가 버튼 표시 */}
                    <tr className="h-2 group">
                      <td
                        colSpan={columns.length}
                        className="p-0 border-b-0 relative">
                        <button
                          onClick={() => toggleAddRowModal(rowIndex + 1)}
                          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="여기에 행 추가">
                          <Plus size={14} />
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </>
            )}
          </tbody>
          {/* 행 추가 모달 */}
          {isAddingRow && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">
                  {addRowPosition !== null
                    ? `행 ${addRowPosition} 앞에 삽입`
                    : "행 추가"}
                </h3>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      이름 *
                    </label>
                    <input
                      type="text"
                      value={newRow.firstName}
                      onChange={(e) =>
                        setNewRow({ ...newRow, firstName: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      성 *
                    </label>
                    <input
                      type="text"
                      value={newRow.lastName}
                      onChange={(e) =>
                        setNewRow({ ...newRow, lastName: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      나이
                    </label>
                    <input
                      type="number"
                      value={newRow.age}
                      onChange={(e) =>
                        setNewRow({ ...newRow, age: Number(e.target.value) })
                      }
                      className="p-2 border border-gray-300 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      value={newRow.email}
                      onChange={(e) =>
                        setNewRow({ ...newRow, email: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      상태
                    </label>
                    <select
                      value={newRow.status}
                      onChange={(e) =>
                        setNewRow({
                          ...newRow,
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className="p-2 border border-gray-300 rounded w-full">
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAddingRow(false)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    취소
                  </button>
                  <button
                    onClick={addNewRow}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    추가
                  </button>
                </div>
              </div>
            </div>
          )}
        </table>
      </div>

      {/* 선택된 행 정보 */}
      <div className="mt-4 mb-2">
        <div className="text-sm font-medium text-gray-700">
          {Object.keys(rowSelection).length} 행 선택됨
        </div>
      </div>

      {/* 데이터 변경 시 저장 버튼 */}
      <div className="mt-4">
        <button
          onClick={() => console.log("저장된 데이터:", data)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
          <Save size={16} className="mr-1" />
          변경사항 저장
        </button>
      </div>
    </div>
  );
};

export default DataTable;

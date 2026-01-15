import { Link } from "react-router-dom";
import { useState } from "react";
import PledgeModal from "./PledgeModal";

function DataTable({ data }: { data: Record<string, string | undefined>[] }) {
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [selectedGovernor, setSelectedGovernor] = useState<string>("");

  if (data.length === 0) return <div>데이터 없음</div>;

  // 필드 순서 명시적 정의
  const getColumns = (): string[] => {
    const firstRow = data[0];

    // 단체장 데이터인지 확인 (position 필드 존재)
    if ("position" in firstRow) {
      // 기초단체장: metropolitanRegion 필드 있음
      if ("metropolitanRegion" in firstRow) {
        return ["position", "name", "party", "metropolitanRegion"];
      }
      // 광역단체장: metropolitanRegion 필드 없음
      return ["position", "name", "party"];
    }

    // 국회의원 데이터 (기존 방식)
    return Object.keys(firstRow);
  };

  const columns = getColumns();

  // 단체장 데이터 여부 확인
  const isGovernorData = "position" in data[0];

  // 필드명 한글 매핑
  const getColumnName = (col: string): string => {
    const columnNameMap: Record<string, string> = {
      // 국회의원 필드
      HG_NM: "이름",
      POLY_NM: "정당",
      ORIG_NM: "지역구",
      // 단체장 필드
      position: "직책",
      name: "이름",
      party: "정당",
      inaugurationDate: "취임일",
      status: "상태",
      notes: "비고",
      metropolitanRegion: "지역",
    };
    return columnNameMap[col] || col;
  };

  return (
    <div className="overflow-x-auto border">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 text-left whitespace-nowrap">#</th>
            {columns.map((col) => (
              <th key={col} className="border px-2 py-1 text-left whitespace-nowrap">
                {getColumnName(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border px-2 py-1 whitespace-nowrap">{i + 1}</td>
              {columns.map((col) => (
                <td key={col} className="border px-2 py-1 whitespace-nowrap">
                  {/* 단체장 이름에 클릭 이벤트 추가 */}
                  {col === "name" && isGovernorData && row[col] ? (
                    (() => {
                      const name = row[col] as string;
                      return name.includes(" → ") && name.includes("(대행)") ? (
                        // 대행자인 경우: 전임자 이름만 클릭 가능 (형식: "전임자 → 대행자(대행)")
                        <span>
                          <button
                            onClick={() => {
                              ``;
                              const predecessor = name.split(" → ")[0].trim();
                              setSelectedGovernor(predecessor);
                              setPledgeModalOpen(true);
                            }}
                            className="text-blue-600 hover:underline font-medium cursor-pointer"
                          >
                            {name.split(" → ")[0].trim()}
                          </button>
                          {" → " + name.split(" → ")[1]}
                        </span>
                      ) : (
                        // 일반 단체장: 이름 전체가 클릭 가능
                        <button
                          onClick={() => {
                            setSelectedGovernor(name);
                            setPledgeModalOpen(true);
                          }}
                          className="text-blue-600 hover:underline font-medium cursor-pointer"
                        >
                          {name}
                        </button>
                      );
                    })()
                  ) : col === "HG_NM" && row[col] ? (
                    /* 국회의원 이름에 링크 추가 */
                    <Link to={`/assembly/${encodeURIComponent(row[col])}`} className="text-blue-600 hover:underline font-medium">
                      {row[col]}
                    </Link>
                  ) : (
                    row[col] || "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 공약 모달 */}
      <PledgeModal governorName={selectedGovernor} isOpen={pledgeModalOpen} onClose={() => setPledgeModalOpen(false)} />
    </div>
  );
}
export default DataTable;

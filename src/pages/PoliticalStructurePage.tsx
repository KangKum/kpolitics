import SEO from "@/shared/components/SEO/SEO";
import JsonLd from "@/shared/components/SEO/JsonLd";

// 선거 섹션 컴포넌트
function ElectionSection({
  title,
  color,
  description,
  children,
}: {
  title: string;
  color: "blue" | "green" | "purple";
  description: string;
  children: React.ReactNode;
}) {
  const colorClasses = {
    blue: "border-blue-500 bg-blue-50",
    green: "border-green-500 bg-green-50",
    purple: "border-purple-500 bg-purple-50",
  };

  return (
    <div className={`border-l-4 ${colorClasses[color]} p-6 rounded-r-lg`}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

// 직책 박스 컴포넌트
function PositionBox({ title, subtitle, items }: { title: string; subtitle?: string; items?: string[] }) {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
      <h3 className="text-lg font-bold text-center">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600 text-center">{subtitle}</p>}
      {items && (
        <ul className="mt-2 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-center">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PoliticalStructurePage() {
  const governmentSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "대한민국 정부",
    "description": "대한민국의 정치 구조와 선거 제도에 대한 정보",
    "url": "https://www.kpolitics.co.kr/structure"
  };

  return (
    <>
      <SEO
        title="대한민국 정치 구조"
        description="대한민국의 정치 구조와 선거 제도를 한눈에 확인하세요. 대통령 선거, 국회의원 선거(총선), 지방선거의 구조와 주기, 광역단체장, 기초단체장, 지방의원 선출 방식을 설명합니다."
        keywords="대한민국 정치구조,선거제도,대통령선거,국회의원선거,총선,지방선거,광역단체장,기초단체장,광역의원,기초의원,시의원,구의원,군의원"
        canonical="/structure"
      />
      <JsonLd data={governmentSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">대한민국 정치 구조</h1>
        <p className="text-gray-600 mt-2">한눈에 보는 대한민국 선거와 정치 체계</p>
      </div>

      {/* 선거 구조 시각화 */}
      <div className="space-y-12">
        {/* 1. 대통령 선거 */}
        <ElectionSection title="대통령 선거 (대선)" color="blue" description="5년마다 실시, 전국 단위">
          <PositionBox title="대통령" />
        </ElectionSection>

        {/* 2. 국회의원 선거 */}
        <ElectionSection title="국회의원 선거 (총선)" color="green" description="4년마다 실시, 총 300명">
          <PositionBox title="국회의원" subtitle="지역구 + 비례대표" />
        </ElectionSection>

        {/* 3. 지방선거 */}
        <ElectionSection title="지방선거" color="purple" description="4년마다 실시, 광역/기초 단위">
          {/* 광역단체 */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">광역단체</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PositionBox title="광역단체장" items={["특별시장", "광역시장", "도지사"]} />
              <PositionBox title="광역의회 의원" items={["특별시의원", "광역시의원", "도의원"]} />
            </div>
          </div>

          {/* 기초단체 */}
          <div>
            <h3 className="font-bold mb-3">기초단체</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PositionBox title="기초단체장" items={["시장", "군수", "구청장"]} />
              <PositionBox title="기초의회 의원" items={["시의원", "군의원", "구의원"]} />
            </div>
          </div>
        </ElectionSection>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">선거 주기</h2>
        <ul className="space-y-2">
          <li>• 대통령 선거: 5년마다 (2030년 예정)</li>
          <li>• 국회의원 선거: 4년마다 (2028년 예정)</li>
          <li>• 지방선거: 4년마다 (2026년 예정)</li>
        </ul>
      </div>
      </div>
    </>
  );
}

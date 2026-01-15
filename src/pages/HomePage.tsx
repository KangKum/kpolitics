import KoreaMap from "@/components/KoreaMap";
import SEO from "@/shared/components/SEO/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="메인"
        description="대한민국 17개 광역시도의 국회의원, 시장, 도지사, 군수, 시의원 정보를 지역별로 확인하세요. 인터랙티브 지도를 클릭하여 각 지역 정치인 정보를 조회할 수 있습니다."
        keywords="정치인,국회의원,시장,도지사,광역단체장,기초단체장,선거,대한민국정치,서울,부산,대구,인천,광주,대전,울산,세종,경기도,강원도,충청북도,충청남도,전라북도,전라남도,경상북도,경상남도,제주도"
        canonical="/"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-start">
          <div className="fixed left-[-35px] top-20 w-[500px] md:relative md:w-[600px] md:left-0 md:top-0 md:mx-auto overflow-x-hidden touch-none">
            <KoreaMap />
          </div>
        </div>
      </div>
    </>
  );
}

import KoreaMap from "@/components/KoreaMap";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-start">
        <div className="fixed left-[-75px] top-20 w-[600px] md:relative md:w-[600px] md:left-0 md:top-0 md:mx-auto overflow-x-hidden">
          <KoreaMap />
        </div>
      </div>
    </div>
  );
}

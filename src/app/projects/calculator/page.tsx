import AspectRatioCalculator from "@/features/aspectRatio-calculator/aspect-ratio-calculator";
import ImageComparisonTool from "@/features/image-comp/imageComp";

export default function PageCalculator() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <AspectRatioCalculator />
    </div>
  )
}
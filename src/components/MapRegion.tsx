import { memo } from "react";

interface MapRegionProps {
  pathData: string;
  name: string;
  isSelected: boolean;
  isHovered: boolean;
  hasSelection: boolean;
  hasHover: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const MapRegion = memo(
  ({ pathData, isSelected, isHovered, hasSelection, hasHover, onMouseEnter, onMouseLeave, onClick }: MapRegionProps) => {
    let className = "map-region";
    if (isSelected) className += " map-region-selected";
    else if (hasSelection) className += " map-region-dimmed-selected";
    else if (isHovered) className += " map-region-hovered";
    else if (hasHover) className += " map-region-dimmed-hover";

    return <path d={pathData} className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} />;
  },
  (prevProps, nextProps) => {
    // Custom comparison - only re-render if visual state changes
    return (
      prevProps.pathData === nextProps.pathData &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isHovered === nextProps.isHovered &&
      prevProps.hasSelection === nextProps.hasSelection &&
      prevProps.hasHover === nextProps.hasHover
    );
  }
);

MapRegion.displayName = "MapRegion";

export default MapRegion;

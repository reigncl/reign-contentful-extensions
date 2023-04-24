import React, { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-width: 2px;
  border-style: dashed;
  border-color: #a9a9a9;
  border-dasharray: 5 3;
`;

interface ResizableImageProps {
  src: string;
  size: { width: number; height: number };
  onChangeSize: ({ width, height }: { width: number; height: number }) => void;
}

const ResizableImage: React.FC<ResizableImageProps> = ({
  src = "",
  size,
  onChangeSize,
}) => {
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const imgRef = useRef<HTMLImageElement>(null);
  const rndRef = useRef<Rnd>(null);

  const onLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setNaturalSize({ width: naturalWidth, height: naturalHeight });
    onChangeSize({ width: naturalWidth, height: naturalHeight });
  };

  return (
    <div
      data-testid="resizable-image"
      style={{ position: "relative" }}
      className="parent"
    >
      <Rnd
        ref={rndRef}
        style={{
          position: "relative",
          transform: "translate(0px,0px)",
        }}
        size={size}
        minWidth={50}
        maxWidth={naturalSize.width}
        onResize={(e, direction, ref) => {
          rndRef.current?.updatePosition({ x: 0, y: 0 });
          onChangeSize({
            width: parseInt(ref.style.width ?? "0"),
            height: parseInt(ref.style.height ?? "0"),
          });
        }}
        disableDragging
        lockAspectRatio
      >
        <Image
          src={src}
          alt="imagen redimensionable"
          ref={imgRef}
          onLoad={onLoad}
          width={size.width}
          height={size.height}
        />
      </Rnd>
    </div>
  );
};

export default ResizableImage;

import React from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
}

export default function Image({
  fill,
  priority,
  unoptimized: _unoptimized,
  className = "",
  style,
  alt = "",
  src,
  ...props
}: ImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full ${className}`}
        style={style}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  );
}

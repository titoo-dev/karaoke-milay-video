import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { Lyric, LyricsProps } from "./schema";

export const MyComposition: React.FC<LyricsProps> = ({
  lyrics,
  fontFamily = "Inter, system-ui, sans-serif",
  backgroundColor = "hsl(0 0% 20%)",
  textColor = "hsl(0 0% 98%)",
  highlightColor = "hsl(142.1 76.2% 36.3%)",
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Find the current and next lyric
  const currentLyricIndex = lyrics.findIndex(
    (l) => frame >= l.startFrame && frame <= l.endFrame,
  );

  const nextLyric = lyrics[currentLyricIndex + 1];

  const renderLyricLine = (lyric: Lyric, isActive: boolean, index: number) => {
    const isNext = nextLyric && nextLyric.text === lyric.text;
    const isPrevious = index === currentLyricIndex - 1;

    // Enhanced spring animation for entrance
    const entranceSpring = spring({
      frame: frame - (isActive ? lyric.startFrame : frame),
      fps,
      config: {
        damping: 20,
        mass: 0.8,
        stiffness: 120,
      },
    });

    const entrance = isActive
      ? entranceSpring
      : isNext
        ? 0.5
        : isPrevious
          ? 0.4
          : 0.2;

    const yOffset = isActive
      ? 0
      : isNext
        ? 30
        : isPrevious
          ? -20
          : index < currentLyricIndex
            ? -40
            : 60;

    const scale = interpolate(entrance, [0, 1], [0.85, 1], {
      extrapolateRight: "clamp",
    });

    const opacity = interpolate(entrance, [0, 1], [0.2, 1], {
      extrapolateRight: "clamp",
    });

    return (
      <div
        key={index}
        className="lyric-line"
        style={{
          opacity,
          transform: `translateY(${yOffset}px) scale(${scale})`,
          margin: "0.6rem 0",
          fontSize: isActive ? "2.6rem" : "1.6rem",
          fontWeight: isActive ? 700 : 400,
          color: isActive ? textColor : `${textColor}${isNext ? "CC" : "80"}`,
          textAlign: "center",
          padding: "0.8rem 2.5rem",
          borderRadius: "1rem",
          backgroundColor: isActive ? `${highlightColor}15` : "transparent",
          border: isActive ? `1px solid ${highlightColor}40` : "none",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          width: isActive ? "auto" : "85%",
          maxWidth: isActive ? "95%" : "90%",
          backdropFilter: isActive ? "blur(8px)" : "none",
          position: "relative",
          boxShadow: isActive
            ? `0 4px 15px -3px ${highlightColor}30, 0 2px 4px -2px ${highlightColor}20`
            : "none",
          lineHeight: 1.4,
          height: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "center center",
          // Display the timestamp if active (shadcn style)
          ...(isActive &&
            lyric.time && {
              "&::after": {
                content: `"${lyric.time}"`,
                position: "absolute",
                bottom: "-1.5rem",
                right: "1rem",
                fontSize: "0.75rem",
                opacity: 0.7,
                color: highlightColor,
                fontFamily: "monospace",
              },
            }),
        }}
      >
        {lyric.text}
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        background: `radial-gradient(circle at 50% 50%, ${backgroundColor} 0%, hsl(220 10% 8%) 90%)`,
      }}
    >
      <div
        className="lyrics-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          borderRadius: "1.2rem",
          backdropFilter: "blur(12px)",
          width: "auto",
          minWidth: width * 0.6,
          maxWidth: width * 0.8,
          maxHeight: "80%",
          position: "relative",
          overflow: "visible",
        }}
      >
        {lyrics.map((lyric, index) => {
          const isActive = index === currentLyricIndex;
          // Show more lines for better context but with a fade effect
          if (
            index >= currentLyricIndex - 2 &&
            index <= currentLyricIndex + 3
          ) {
            return renderLyricLine(lyric, isActive, index);
          }
          return null;
        })}
      </div>
    </AbsoluteFill>
  );
};

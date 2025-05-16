import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Lyrics, LyricsPropsSchema } from "./schema";

export const RemotionRoot: React.FC = () => {
  // Process lyrics from the text file
  const lyricsData = parseLyrics();

  // Calculate total duration based on lyrics
  const totalFrames =
    lyricsData.length > 0 ? lyricsData[lyricsData.length - 1].endFrame + 30 : 0; // Add a buffer of 1 second at the end
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        schema={LyricsPropsSchema}
        defaultProps={{
          lyrics: lyricsData,
          fontFamily: "Inter, system-ui, sans-serif",
          backgroundColor: "hsl(0 0% 20%)",
          textColor: "hsl(0 0% 98%)",
          highlightColor: "hsl(142.1 76.2% 36.3%)",
        }}
        durationInFrames={totalFrames}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};

// Function to parse the lyrics file into the required format
function parseLyrics(): Lyrics {
  // FPS for conversion from time to frames
  const fps = 30;

  // Sample lyrics data in the new format
  const lyricsJson = [
    { text: "And I never thought I'd feel this way", time: "00:00.000" },
    { text: "And as far as I'm concerned", time: "00:04.000" },
    { text: "I'm glad I got the chance to say", time: "00:08.000" },
    { text: "That I do believe I love you", time: "00:12.000" },
    { text: "And if I should ever go away", time: "00:16.000" },
    { text: "Well, then, close your eyes and try", time: "00:20.000" },
    { text: "To feel the way we do today", time: "00:24.000" },
    { text: "And then if you can remember", time: "00:28.000" },
    { text: "Keep smilin', keep shinin'", time: "00:32.000" },
    { text: "Knowin' you can always count on me for sure", time: "00:36.000" },
    { text: "That's what friends are for", time: "00:40.000" },
    { text: "For good times and bad times", time: "00:44.000" },
    { text: "I'll be on your side forevermore", time: "00:48.000" },
    { text: "That's what friends are for", time: "00:52.000" },
    { text: "Well, you came and opened me", time: "00:56.000" },
    { text: "And now, there's so much more I see", time: "01:00.000" },
    { text: "And so, by the way, I thank you", time: "01:04.000" },
    { text: "Oh, and then, for the times when we're apart", time: "01:08.000" },
    { text: "Well, then, close your eyes and know", time: "01:12.000" },
    { text: "These words are comin' from my heart", time: "01:16.000" },
    { text: "And then if you can remember, oh", time: "01:20.000" },
    { text: "Keep smiling, keep shining", time: "01:24.000" },
    { text: "Knowing you can always count on me for sure", time: "01:28.000" },
    { text: "That's what friends are for", time: "01:32.000" },
    { text: "In good times, in bad times", time: "01:36.000" },
    { text: "I'll be on your side forevermore", time: "01:40.000" },
    { text: "Oh, that's what friends are for, oh", time: "01:44.000" },
    { text: "Oh, keep smilin', keep shinin'", time: "01:48.000" },
    { text: "Knowin' you can always count on me for sure", time: "01:52.000" },
    { text: "That's what friends are for", time: "01:56.000" },
    { text: "For good times and bad times", time: "02:00.000" },
    { text: "I'll be on your side forevermore", time: "02:04.000" },
    { text: "That's what friends are for", time: "02:08.000" },
    { text: "Keep smilin', keep shinin'", time: "02:12.000" },
    {
      text: "Knowin' you can always count on me, oh, for sure",
      time: "02:16.000",
    },
    {
      text: "'Cause I tell you that's what friends are for",
      time: "02:20.000",
    },
    { text: "For good times and for bad times", time: "02:24.000" },
    { text: "I'll be on your side forevermore, oh", time: "02:28.000" },
    { text: "That's what friends are for", time: "02:32.000" },
    { text: "(Ha, ha, that's what friends are for)", time: "02:36.000" },
    { text: "(Ha, ha, yeah)", time: "02:40.000" },
    { text: "On me for sure", time: "02:44.000" },
    { text: "Count on me for sure", time: "02:48.000" },
    { text: "Count on me for sure", time: "02:52.000" },
    { text: "That's what friends are for", time: "02:56.000" },
    { text: "Keep smilin', keep shinin'", time: "03:00.000" },
  ];

  // Function to convert time string to frames
  const timeToFrames = (timeStr: string): number => {
    const [minutes, secondsMs] = timeStr.split(":");
    const [seconds, milliseconds] = secondsMs.split(".");

    const totalSeconds =
      parseInt(minutes) * 60 +
      parseInt(seconds) +
      parseInt(milliseconds || "0") / 1000;

    return Math.floor(totalSeconds * fps);
  };

  // Calculate duration for each lyric line
  const processedLyrics = [];
  for (let i = 0; i < lyricsJson.length; i++) {
    const current = lyricsJson[i];
    const next = lyricsJson[i + 1];

    const startFrame = timeToFrames(current.time);
    // If there's a next lyric, use its time as the end, otherwise add 4 seconds
    const endFrame = next ? timeToFrames(next.time) - 1 : startFrame + 4 * fps; // 4 seconds for the last line

    processedLyrics.push({
      text: current.text,
      time: current.time,
      startFrame,
      endFrame,
    });
  }

  return processedLyrics;
}

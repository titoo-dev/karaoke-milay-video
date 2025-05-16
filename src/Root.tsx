import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Lyrics, LyricsLineSchema } from "./schema";

export const RemotionRoot: React.FC = () => {
  // Process lyrics from the text file
  const lyricsData = parseLyrics();

  // Calculate total duration based on lyrics
  const totalFrames =
    lyricsData.length > 0 ? lyricsData[lyricsData.length - 1].endFrame : 0;

  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        schema={LyricsLineSchema}
        defaultProps={{
          lyrics: lyricsData,
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
  // Convert video length to total frames (3:50 = 230 seconds)
  const totalSeconds = 230; // 3*60 + 50
  const totalFrames = totalSeconds * 30; // at 30fps

  // Get actual lyrics lines (excluding metadata)
  // Read the lyrics file and extract lines, skipping the metadata
  const rawLyrics = `
And I never thought I'd feel this way
And as far as I'm concerned
I'm glad I got the chance to say
That I do believe I love you
And if I should ever go away
Well, then, close your eyes and try
To feel the way we do today
And then if you can remember

Keep smilin', keep shinin'
Knowin' you can always count on me for sure
That's what friends are for
For good times and bad times
I'll be on your side forevermore
That's what friends are for

Well, you came and opened me
And now, there's so much more I see
And so, by the way, I thank you
Oh, and then, for the times when we're apart
Well, then, close your eyes and know
These words are comin' from my heart
And then if you can remember, oh

Keep smiling, keep shining
Knowing you can always count on me for sure
That's what friends are for
In good times, in bad times
I'll be on your side forevermore
Oh, that's what friends are for, oh

Oh, keep smilin', keep shinin'
Knowin' you can always count on me for sure
That's what friends are for
For good times and bad times
I'll be on your side forevermore
That's what friends are for

Keep smilin', keep shinin'
Knowin' you can always count on me, oh, for sure
'Cause I tell you that's what friends are for
For good times and for bad times
I'll be on your side forevermore, oh
That's what friends are for

(Ha, ha, that's what friends are for)
(Ha, ha, yeah)
On me for sure
Count on me for sure
Count on me for sure
That's what friends are for
Keep smilin', keep shinin'
`;

  // Split into lines and filter out empty lines
  const lines = rawLyrics
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Calculate frames per line to distribute evenly
  const framesPerLine = Math.floor(totalFrames / lines.length);

  // Create lyrics array with proper timing
  return lines.map((text, index) => ({
    text,
    startFrame: index * framesPerLine,
    endFrame: (index + 1) * framesPerLine,
  }));
}

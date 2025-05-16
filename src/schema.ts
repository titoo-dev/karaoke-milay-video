import { z } from "zod";

export const LyricLineSchema = z.object({
  text: z.string(),
  startFrame: z.number().int(),
  endFrame: z.number().int(),
});

export const LyricsLineSchema = z.array(LyricLineSchema);

export type Lyric = z.infer<typeof LyricLineSchema>;
export type Lyrics = z.infer<typeof LyricsLineSchema>;

/**
 * Strips BattleScribe catalog formatting from game text.
 * BattleScribe encodes bold as **text** and faction keywords as ^^text^^.
 * These render as raw symbols in plain JSX and need to be removed.
 */
export function cleanGameText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/\^\^/g, '')   // ^^keyword^^ superscript markers
    .replace(/\*\*/g, '')    // **bold** markers
    .replace(/\*/g, '')      // *italic* markers
    .replace(/<br\s*\/?>/gi, ' ')  // <br> tags → space
    .replace(/<[^>]+>/g, '')       // remaining HTML tags
    .trim();
}

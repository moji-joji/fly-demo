import { JSONContent } from '@tiptap/react';

type Format = 'bold' | 'italic' | 'both' | 'none';

const format = {
  bold: {
    uppercase: {
      start: 0x1d5d4,
      end: 0x1d5ed,
      offset: 0x1d5d4 - 65, // 'A' in bold (Mathematical Sans-Serif Bold)
    },
    lowercase: {
      start: 0x1d5ee,
      end: 0x1d607,
      offset: 0x1d5ee - 97, // 'a' in bold (Mathematical Sans-Serif Bold)
    },
    numbers: {
      start: 0x1d7ec,
      end: 0x1d7f5,
      offset: 0x1d7ec - 48, // '0' in bold (Mathematical Sans-Serif Bold)
    },
  },
  italic: {
    uppercase: {
      start: 0x1d608,
      end: 0x1d621,
      offset: 0x1d608 - 65, // 'A' in italic (Mathematical Italic)
    },
    lowercase: {
      start: 0x1d622,
      end: 0x1d63b,
      offset: 0x1d622 - 97, // 'a' in italic (Mathematical Italic)
    },
  },
  boldItalic: {
    uppercase: {
      start: 0x1d468,
      end: 0x1d481,
      offset: 0x1d468 - 65, // 'A' in bold italic (Mathematical Bold Italic)
    },
    lowercase: {
      start: 0x1d482,
      end: 0x1d49b,
      offset: 0x1d482 - 97, // 'a' in bold italic (Mathematical Bold Italic)
    },
  },
};

function getMarksFromFormat(format: Format) {
  if (format === 'bold') return [{ type: 'bold' }];
  if (format === 'italic') return [{ type: 'italic' }];
  if (format === 'both') return [{ type: 'bold' }, { type: 'italic' }];
  return [];
}

// given our structure of the editor, the only possibilies for this function are:
// 1. Text is already unicode formatted and we are just removing the format
// 2. Text is not formatted and we are adding the format (both, bold, italic)
export function applyFormat(text: string, newFormat: Format) {

  const result = [];
  for (let i = 0; i < text.length; i++) {
    let code = text.codePointAt(i);
    if (!code) {
      result.push(text[i]);
      continue;
    }

    let offset = 0;

    const currentFormat = getFormat(code);

    if (newFormat === 'none') {
      // we will remove the formats
      if (currentFormat === 'bold') {
        if (
          code >= format.bold.uppercase.start &&
          code <= format.bold.uppercase.end
        )
          offset = -format.bold.uppercase.offset;

        if (
          code >= format.bold.lowercase.start &&
          code <= format.bold.lowercase.end
        )
          offset = -format.bold.lowercase.offset;

        if (
          code >= format.bold.numbers.start &&
          code <= format.bold.numbers.end
        )
          offset = -format.bold.numbers.offset;
      }

      if (currentFormat === 'italic') {
        if (
          code >= format.italic.uppercase.start &&
          code <= format.italic.uppercase.end
        )
          offset = -format.italic.uppercase.offset;

        if (
          code >= format.italic.lowercase.start &&
          code <= format.italic.lowercase.end
        )
          offset = -format.italic.lowercase.offset;
      }

      if (currentFormat === 'both') {
        if (
          code >= format.boldItalic.uppercase.start &&
          code <= format.boldItalic.uppercase.end
        )
          offset = -format.boldItalic.uppercase.offset;

        if (
          code >= format.boldItalic.lowercase.start &&
          code <= format.boldItalic.lowercase.end
        )
          offset = -format.boldItalic.lowercase.offset;
      }
    }

    // here own outwards, the current format must be none
    // if (currentFormat !== 'none') throw new Error('Invalid invocation');

    if (newFormat === 'bold') {
      if (code >= 65 && code <= 90) offset = format.bold.uppercase.offset;
      else if (code >= 97 && code <= 122)
        offset = format.bold.lowercase.offset;
      else if (code >= 48 && code <= 57) offset = format.bold.numbers.offset;
    }

    if (newFormat === 'italic') {
      if (code >= 65 && code <= 90) offset = format.italic.uppercase.offset;
      else if (code >= 97 && code <= 122)
        offset = format.italic.lowercase.offset;
    }

    if (newFormat === 'both') {
      if (code >= 65 && code <= 90) offset = format.boldItalic.uppercase.offset;
      else if (code >= 97 && code <= 122)
        offset = format.boldItalic.lowercase.offset;
    }

    if (offset) {
      result.push(String.fromCodePoint(code + offset));
      if (code > 0xffff) i++; // Skip the next code unit if it's a surrogate pair
    } else {
      result.push(text[i]);
    }
  }

  return result.join('');
}

export function getFormat(codePoint?: number): Format {
  if (!codePoint) return 'none';

  if (
    Object.values(format.bold).some(
      (range) => codePoint >= range.start && codePoint <= range.end
    )
  )
    return 'bold';

  if (
    Object.values(format.italic).some(
      (range) => codePoint >= range.start && codePoint <= range.end
    )
  )
    return 'italic';

  if (
    Object.values(format.boldItalic).some(
      (range) => codePoint >= range.start && codePoint <= range.end
    )
  )
    return 'both';

  return 'none';
}

export function makeTextCompatibleWithTipTap(text: string): JSONContent {
  const paragraphs = text.split('\n').map((line) => {
    const content: JSONContent[] = [];
    if (!line.trim()) return { type: 'paragraph', content: [] };

    let currentSegment = '';
    let currentFormat = getFormat(line.codePointAt(0)); // Initialize with the bold status of the first character

    for (let i = 0; i < line.length; i++) {
      const currentCode = line.codePointAt(i);
      if (!currentCode) continue;

      const charFormat = getFormat(currentCode);
      // do not break on white spaces
      if (charFormat !== currentFormat && currentCode !== 0x20) {
        if (currentSegment) {
          content.push({
            type: 'text',
            text: applyFormat(currentSegment, 'none'),
            ...(currentFormat !== 'none'
              ? { marks: getMarksFromFormat(currentFormat) }
              : {}),
          });
        }
        currentSegment = String.fromCodePoint(currentCode);
        currentFormat = charFormat;
      } else {
        currentSegment += String.fromCodePoint(currentCode);
      }
      const isSurrogatePair = currentCode > 0xffff;
      if (isSurrogatePair) i++;
    }

    // Add the last segment
    if (currentSegment) {
      content.push({
        type: 'text',
        text: applyFormat(currentSegment, currentFormat),
        ...(currentFormat !== 'none'
          ? { marks: getMarksFromFormat(currentFormat) }
          : {}),
      });
    }

    return {
      type: 'paragraph',
      content: line.trim() ? content : [],
    };
  });

  return {
    type: 'doc',
    content: paragraphs,
  };
}

export function applyMarksToText(content: JSONContent): string {
  if (!content.content) return '';

  return content.content
    .map((node) => {
      if (node.type === 'paragraph') {
        return node.content
          ?.map((childNode) => {
            if (childNode.type === 'text') {
              const text = childNode.text || '';
              const isBold = childNode.marks?.some(
                (mark) => mark.type === 'bold'
              );
              const isItalic = childNode.marks?.some(
                (mark) => mark.type === 'italic'
              );

              const isBoth = isBold && isItalic;

              return isBoth
                ? applyFormat(text, 'both')
                : isBold
                  ? applyFormat(text, 'bold')
                  : isItalic
                    ? applyFormat(text, 'italic')
                    : text;
            }
            return '';
          })
          .join('');
      }
      return '';
    })
    .join('\n');
}

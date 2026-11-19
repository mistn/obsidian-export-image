import { getMime } from 'src/utils';

const copyCache: Partial<Record<FileFormat, boolean>> = {};

const createCache: Partial<Record<FileFormat, boolean>> = {
  pdf: true,
};

export async function isCopiable(type: FileFormat) {
  if (type === 'pdf') {
    return false;
  }

  if (type in copyCache) {
    return copyCache[type]!;
  }

  const canCopy = typeof navigator !== 'undefined'
    && typeof navigator.clipboard?.write === 'function'
    && typeof ClipboardItem !== 'undefined';

  let result = false;
  if (canCopy) {
    // Checking support this way avoids writing to the clipboard just to
    // determine whether the format can be copied.
    result = typeof ClipboardItem.supports === 'function'
      ? ClipboardItem.supports(getMime(type))
      : true;
  }

  if (type === 'png0' || type === 'png1') {
    copyCache.png0 = result;
    copyCache.png1 = result;
  } else {
    copyCache[type] = result;
  }

  return result;
}

export async function isCreatable(type: FileFormat): Promise<boolean> {
  if (type in createCache) {
    return createCache[type]!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const mime = getMime(type);
  return new Promise(resolve => {
    try {
      canvas.toBlob(blob => {
        // Unsupported types fall back to PNG in some browsers, so compare the
        // actual blob type instead of only checking for a non-null result.
        const available = blob !== null && blob.type === mime;
        if (type.includes('png')) {
          createCache.png0 = available;
          createCache.png1 = available;
        } else {
          createCache[type] = available;
        }

        resolve(available);
      }, mime);
    } catch {
      if (type.includes('png')) {
        createCache.png0 = false;
        createCache.png1 = false;
      } else {
        createCache[type] = false;
      }

      resolve(false);
    }
  });
}

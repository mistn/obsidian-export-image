import {
  type App,
  MarkdownRenderChild,
  MarkdownRenderer,
  type TAbstractFile,
  type TFile,
  normalizePath,
} from 'obsidian';

export function isMarkdownFile(file: TFile | TAbstractFile) {
  return ['md', 'markdown'].includes((file as TFile)?.extension ?? '');
}

export async function fileToBase64(file: Blob): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', () => {
      resolve(reader.result as string);
    });

    reader.onerror = error => {
      reject(error);
    };
  });
}

export function fileToUrl(file: File) {
  return URL.createObjectURL(file);
}

export async function getSizeOfImage(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => {
      resolve({
        width: Math.round(image.width / 2),
        height: Math.round(image.height / 2),
      });
      URL.revokeObjectURL(url);
      image.remove();
    });

    image.onerror = error => {
      reject(error);
      URL.revokeObjectURL(url);
      image.remove();
    };

    image.src = url;
  });
}

export async function createHtml(
  path: string,
  app: App,
): Promise<HTMLDivElement> {
  const div = createDiv();
  await MarkdownRenderer.render(
    app,
    `![](${normalizePath(path).replaceAll(' ', '%20')})`,
    div,
    '',
    new MarkdownRenderChild(div),
  );
  return div;
}

export function getMetadata(file: TFile, app: App) {
  return app.metadataCache.getFileCache(file)?.frontmatter;
}

export async function delay(time: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

/**
 * Wait until async code block processors finish changing the DOM.
 * Resolves after the element has been quiet for `quietMs`, with a hard cap.
 */
export function waitForDomToSettle(
  element: HTMLElement,
  quietMs = 500,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise(resolve => {
    let quietTimer: ReturnType<typeof setTimeout>;
    let timeoutTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      observer.disconnect();
      clearTimeout(quietTimer);
      clearTimeout(timeoutTimer);
      resolve();
    };

    const observer = new MutationObserver(() => {
      clearTimeout(quietTimer);
      quietTimer = setTimeout(finish, quietMs);
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    quietTimer = setTimeout(finish, quietMs);
    timeoutTimer = setTimeout(finish, timeoutMs);
  });
}

export function getMime(format: FileFormat) {
  return `image/${format.includes('png') ? 'png' : (format === 'jpg' ? 'jpeg' : format)}`;
}

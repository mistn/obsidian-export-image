/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type App,
  MarkdownRenderChild,
  MarkdownRenderer,
  MarkdownView,
  type TFile,
} from 'obsidian';
import React from 'react';
import { type Root, createRoot } from 'react-dom/client';
import Target, { type TargetRef } from 'src/components/common/Target';
import { delay, getMetadata, waitForDomToSettle } from '.';

let root: Root | undefined;

// eslint-disable-next-line @typescript-eslint/naming-convention
export default async function makeHTML(
  file: TFile,
  settings: ISettings,
  app: App,
  container: HTMLElement,
): Promise<TargetRef> {
  if (root) {
    root.unmount();
    await delay(20);
    container.empty();
  }

  const markdown = await app.vault.cachedRead(file);
  const element = document.createElement('div');
  const contentEl = element.createDiv();
  await MarkdownRenderer.render(
    app,
    markdown,
    contentEl,
    file.path,
    app.workspace.getActiveViewOfType(MarkdownView)
    || app.workspace.activeLeaf?.view
    || new MarkdownRenderChild(element),
  );

  // Give async code block processors (Dataview, SQLSeal, etc.) time to fill
  // their placeholders before the content is cloned for capture.
  if (contentEl.querySelector('[class*="block-language-"]')) {
    await waitForDomToSettle(contentEl);
  }

  /* @ts-ignore */
  const metadataMap: Record<string, { type: MetadataType }> = app.metadataCache.getAllPropertyInfos();

  const frontmatter = getMetadata(file, app);

  root = createRoot(container);
  root.render(
    <Target
      frontmatter={frontmatter}
      setting={settings}
      title={file.basename}
      markdownEl={element}
      app={app}
      metadataMap={metadataMap}
      isProcessing
    />,
  );
  await delay(100);

  const createTarget = (clip: HTMLElement, content: HTMLElement): TargetRef => ({
    element: clip,
    contentElement: content,
    setClip: (startY: number, height: number) => {
      clip.style.height = `${height}px`;
      clip.style.overflow = 'hidden';
      content.style.transform = `translateY(-${startY}px)`;
    },
    resetClip: () => {
      clip.style.height = '';
      clip.style.overflow = '';
      content.style.transform = '';
    },
  });

  const clip = container.firstElementChild as HTMLElement | null;
  const content = container.querySelector<HTMLElement>('.export-image-root');
  if (clip && content) {
    return createTarget(clip, content);
  }

  return createTarget(element, element);
}

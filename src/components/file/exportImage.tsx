/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import {
  type App,
  type FrontMatterCache,
  MarkdownRenderChild,
  MarkdownRenderer,
  MarkdownView,
  Modal,
  Notice,
  type TFile,
} from 'obsidian';
import { createRoot } from 'react-dom/client';
import L from '../../L';
import ModalContent from './ModalContent';
import { preprocessMarkdown } from 'src/utils/preprocessMarkdown';
import Target from '../common/Target';
import { delay } from 'src/utils';
import { copy } from 'src/utils/capture';

export default async function (
  app: App,
  settings: ISettings,
  markdown: string,
  file: TFile,
  frontmatter: FrontMatterCache | undefined,
  type: 'file' | 'selection',
) {
  // 创建元素和模态框先
  const el = document.createElement('div');
  const skipConfig = type === 'selection' && settings.quickExportSelection;
  
  // 如果是快速导出，创建隐藏的div元素进行处理
  if (skipConfig) {
    const div = createDiv();
    div.style.width = (settings.width || 400) + 'px';
    div.style.position = 'fixed';
    div.style.top = '9999px';
    div.style.left = '9999px';
    document.body.appendChild(div);
    const root = createRoot(div);

    // 先加载内容，再渲染 Target，确保克隆到已经填充好的 DOM。
    await loadDocumentContent(app, el, markdown, file, frontmatter, type);

    root.render(
      <Target
        isProcessing={true}
        markdownEl={el}
        setting={{ ...settings, showMetadata: false, showFilename: false, split: { overlap: 0, height: 0, mode: 'none' } }}
        frontmatter={{}}
        title={file.basename}
        metadataMap={{}}
        app={app}
      />,
    );
    await delay(100);
    
    try {
      await copy(div.querySelector('.export-image-root')!, settings.resolutionMode, settings.format);
    } catch (e) {
      console.error(e);
      new Notice(L.copyFail());
    } finally {
      root.unmount();
      div.remove();
    }
  }
  else {
    // 先创建模态框并显示加载状态
    const modal = new Modal(app);
    modal.setTitle(L.imageExportPreview());
    modal.modalEl.style.width = '85vw';
    modal.modalEl.style.maxWidth = '1500px';
    modal.open();
    const root = createRoot(modal.contentEl);
    
    /* @ts-ignore */
    const metadataMap: Record<string, { type: MetadataType }> = app.metadataCache.getAllPropertyInfos();
    
    // 渲染组件，组件内部会处理loading状态
    root.render(
      <ModalContent
        markdownEl={el}
        settings={settings}
        frontmatter={frontmatter}
        title={file.basename}
        metadataMap={metadataMap}
        app={app}
      />,
    );
    
    // 异步加载文档内容
    await loadDocumentContent(app, el, markdown, file, frontmatter, type);
    
    // 发布一个自定义事件，通知内容已加载完成
    const loadedEvent = new CustomEvent("export-image-content-loaded");
    window.document.dispatchEvent(loadedEvent);
    
    modal.onClose = () => {
      root?.unmount();
    };
  }
}

// 提取加载文档内容的函数
async function loadDocumentContent(
  app: App,
  el: HTMLElement,
  markdown: string,
  file: TFile,
  frontmatter: FrontMatterCache | undefined,
  type: 'file' | 'selection',
) {
  try {
    const view = app.workspace.getActiveViewOfType(MarkdownView);
    const contentDiv = view?.contentEl.querySelector('.cm-content.cm-lineWrapping');

    // 只有在导出当前打开的文件、并且编辑器里存在 CM 内容时才使用实时预览 DOM。
    // 阅读模式没有 .cm-content，导出其他文件或选中内容时也必须使用传入的 markdown，
    // 否则会导出空白内容或当前编辑器里另一篇笔记的内容。
    if (type !== 'file' || !view || !contentDiv || view.file?.path !== file.path) {
      el.empty();
      await MarkdownRenderer.render(
        app,
        preprocessMarkdown(markdown, frontmatter),
        el,
        file.path,
        new MarkdownRenderChild(el),
      );
      await delay(100);
      return el;
    }

    const codeMirror = view.editor.cm;
    codeMirror.viewState.printing = true;
    try {
      codeMirror.measure();
      // 等待滚动操作完成
      view.editor.scrollTo(0, 0);
      await delay(100);
      view.editor.scrollTo(0, Number.MAX_SAFE_INTEGER);
      await delay(500);
      view.editor.scrollTo(0, 0);

      const tempDiv = document.createElement('div');
      tempDiv.className = "markdown-source-view mod-cm6 is-live-preview";
      
      // 首先添加内容
      tempDiv.innerHTML = contentDiv.innerHTML;
      
      // 删除所有带有 cm-active class 的元素
      tempDiv.querySelectorAll('.cm-active').forEach(el => el.classList.remove('cm-active'));
      
      // 删除所有 edit-block-button 和 callout-fold 元素
      tempDiv.querySelectorAll('.edit-block-button, .callout-fold, .cm-widgetBuffer, .table-col-drag-handle, .cm-fold-indicator, .table-row-btn, .table-row-drag-handle, .table-col-btn, .table-row-drag-handle').forEach(el => el.remove());
      
      // 构建完整的HTML，包括样式
      const cssStyles = `
        <style>
          /* 可以在这里添加更多自定义样式 */
          /* 修复列表缩进在渲染时的问题 */
          .export-image-root .list-bullet {
              margin-left: -24px !important;
          }
          .export-image-root .cm-formatting.cm-formatting-list.cm-formatting-list-ul.cm-list-1 {
              margin-left: 12px !important;
          }
          .export-image-root .list-bullet:after {
              left: 10px !important;
          }
        </style>
      `;
      
      // 将div的HTML和样式组合起来
      el.innerHTML = `<div class="export-image-root markdown-source-view mod-cm6 is-live-preview">
        ${cssStyles}
        ${tempDiv.innerHTML}
      </div>`;
    } finally {
      codeMirror.viewState.printing = false;
      codeMirror.measure();
    }
    
    // 增加一个短暂延迟，确保页面渲染完成
    await delay(100);
    
    return el;
  } catch (error) {
    console.error("Error loading document content:", error);
    return el;
  }
}

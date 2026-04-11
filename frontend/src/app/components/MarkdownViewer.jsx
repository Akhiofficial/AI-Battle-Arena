import { parseMarkdown } from '../utils/markdownParser';

export default function MarkdownViewer({ content }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content ?? '') }} />
  );
}

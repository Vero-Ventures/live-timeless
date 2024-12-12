"use dom";
import "./dom-content.css";

export default function DOMContent({ content }: { content: string }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

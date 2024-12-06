"use dom";
import "./dom-content.css";

export default function Description({ content }: { content: string }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

"use dom";
import "./dom-content.css";

export default function Description({ content }: { content: string }) {
  console.log(content);
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

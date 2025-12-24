import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Dropdown } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  TableOutlined,
} from "@ant-design/icons";

// Function to sanitize content and remove unwanted HTML elements/classes
const sanitizeContent = (content) => {
  if (!content || typeof content !== "string") return "";

  // Remove Ant Design form/button classes that might appear as text
  let cleaned = content
    .replace(/ant-form-item-control-input-content/g, "")
    .replace(/ant-btn\s+ant-btn-primary\s+w-full/g, "")
    .replace(/ant-btn\s+ant-btn-primary\s+mt-4\s+w-full/g, "")
    .replace(/ant-btn/g, "")
    .replace(/ant-form-item/g, "")
    .trim();

  // Remove empty paragraphs and divs (but NOT spaces inside them)
  cleaned = cleaned
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<div>\s*<\/div>/g, "")
    .replace(/<p[^>]*>\s*<\/p>/g, "")
    .replace(/<div[^>]*>\s*<\/div>/g, "");

  return cleaned || "";
};

const TipTapEditor = forwardRef(
  (
    {
      value,
      defaultValue,
      onChange,
      setContents,
      height = 400,
      placeholder = "",
      readonly = false,
      className = "",
      customButtons = [],
      ...props
    },
    ref
  ) => {
    const isUpdatingFromProp = useRef(false);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
          paragraph: false,
        }),
        // Custom Paragraph extension that preserves whitespace
        Paragraph.extend({
          parseHTML() {
            return [{ tag: "p" }];
          },
          renderHTML({ HTMLAttributes }) {
            return [
              "p",
              {
                ...HTMLAttributes,
                style: "white-space: pre-wrap; word-wrap: break-word;",
              },
              0,
            ];
          },
        }),
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Underline,
        Link.configure({
          openOnClick: false,
        }),
        Image,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell.configure({
          HTMLAttributes: {
            class: "tiptap-table-cell",
          },
        }),
      ],
      content: sanitizeContent(value || defaultValue || setContents || ""),
      editable: !readonly,
      immediatelyRender: false,
      parseOptions: {
        preserveWhitespace: "full",
      },
      onUpdate: ({ editor }) => {
        // Only call onChange if we're not updating from a prop change
        if (onChange && !isUpdatingFromProp.current) {
          const html = editor.getHTML();
          onChange(html);
        }
      },
    });

    useImperativeHandle(ref, () => ({
      editor: {
        setContents: (content) => {
          if (editor) {
            const cleaned = sanitizeContent(content || "");
            isUpdatingFromProp.current = true;
            editor.commands.setContent(cleaned);
            setTimeout(() => {
              isUpdatingFromProp.current = false;
            }, 0);
          }
        },
        getContents: () => {
          return editor ? editor.getHTML() : "";
        },
      },
      getContent: () => {
        return editor ? editor.getHTML() : "";
      },
      setContent: (content) => {
        if (editor) {
          const cleaned = sanitizeContent(content || "");
          isUpdatingFromProp.current = true;
          editor.commands.setContent(cleaned);
          setTimeout(() => {
            isUpdatingFromProp.current = false;
          }, 0);
        }
      },
    }));

    // Handle setContents prop changes
    React.useEffect(() => {
      if (editor && setContents !== undefined) {
        const cleaned = sanitizeContent(setContents || "");
        const currentContent = editor.getHTML();
        if (currentContent !== cleaned) {
          isUpdatingFromProp.current = true;
          editor.commands.setContent(cleaned);
          setTimeout(() => {
            isUpdatingFromProp.current = false;
          }, 0);
        }
      }
    }, [setContents, editor]);

    // Handle value prop changes
    React.useEffect(() => {
      if (editor && value !== undefined) {
        const cleaned = sanitizeContent(value || "");
        const currentContent = editor.getHTML();

        // Only update if content is actually different and we're not in the middle of editing
        if (currentContent !== cleaned && !editor.isFocused) {
          isUpdatingFromProp.current = true;
          editor.commands.setContent(cleaned);
          setTimeout(() => {
            isUpdatingFromProp.current = false;
          }, 0);
        }
      }
    }, [value, editor]);

    if (!editor) {
      return <div>Loading editor...</div>;
    }

    return (
      <div className={`tiptap-editor-wrapper ${className}`}>
        <div className="tiptap-toolbar">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={editor.isActive("undo") ? "is-active" : ""}
            title="Undo (Ctrl+Z)"
          >
            <UndoOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={editor.isActive("redo") ? "is-active" : ""}
            title="Redo (Ctrl+Y)"
          >
            <RedoOutlined />
          </button>
          <div className="toolbar-separator" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
            title="Bold (Ctrl+B)"
          >
            <BoldOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
            title="Italic (Ctrl+I)"
          >
            <ItalicOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "is-active" : ""}
            title="Underline (Ctrl+U)"
          >
            <UnderlineOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
            title="Strikethrough"
          >
            <StrikethroughOutlined />
          </button>
          <div className="toolbar-separator" />
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
            title="Зүүн талруу шахах"
          >
            <AlignLeftOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
            title="Голлуулах"
          >
            <AlignCenterOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
            title="Баруун талруу шахах"
          >
            <AlignRightOutlined />
          </button>
          <div className="toolbar-separator" />
          {customButtons.map((buttonGroup, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {buttonGroup.map((btn, btnIndex) => {
                // If button has items, it's a dropdown
                if (
                  btn.items &&
                  Array.isArray(btn.items) &&
                  btn.items.length > 0
                ) {
                  const menuItems = btn.items.map((item, itemIndex) => ({
                    key: `${groupIndex}-${btnIndex}-${itemIndex}`,
                    label: item.ner || item.label,
                    onClick: () => {
                      const templateValue = item.talbar || item.value;
                      if (templateValue) {
                        const tagText = `<${templateValue}>`;
                        editor.chain().focus().insertContent(tagText).run();
                      }
                    },
                  }));

                  return (
                    <Dropdown
                      key={btnIndex}
                      menu={{ items: menuItems }}
                      trigger={["click"]}
                      placement="bottomLeft"
                    >
                      <button
                        type="button"
                        title={btn.title || btn.name}
                        className="custom-template-btn"
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: btn.innerHTML || btn.button || btn.title,
                          }}
                        />
                        <span style={{ marginLeft: "4px" }}>▼</span>
                      </button>
                    </Dropdown>
                  );
                }
                // Regular button
                return (
                  <button
                    key={btnIndex}
                    type="button"
                    onClick={() => {
                      if (btn.onClick) {
                        btn.onClick(editor);
                      } else if (btn.value) {
                        const value = btn.value
                          .replace(/&lt;/g, "<")
                          .replace(/&gt;/g, ">");
                        editor.chain().focus().insertContent(value).run();
                      }
                    }}
                    title={btn.title || btn.label}
                    className="custom-template-btn"
                  >
                    {btn.icon || btn.label || btn.title}
                  </button>
                );
              })}
              {groupIndex < customButtons.length - 1 && (
                <div className="toolbar-separator" />
              )}
            </React.Fragment>
          ))}
        </div>
        <EditorContent
          editor={editor}
          style={{ minHeight: `${height}px` }}
          className="tiptap-content"
        />
      </div>
    );
  }
);

TipTapEditor.displayName = "TipTapEditor";

export default TipTapEditor;

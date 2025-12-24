import React, { useImperativeHandle, forwardRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
import { Dropdown, Button } from "antd";
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
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
  PictureOutlined,
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

  // Remove empty paragraphs and divs
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
        TableCell,
      ],
      content: sanitizeContent(value || defaultValue || setContents || ""),
      editable: !readonly,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
    });

    useImperativeHandle(ref, () => ({
      editor: {
        setContents: (content) => {
          if (editor) {
            const cleaned = sanitizeContent(content || "");
            editor.commands.setContent(cleaned);
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
          editor.commands.setContent(cleaned);
        }
      },
    }));

    React.useEffect(() => {
      if (editor && setContents !== undefined) {
        const cleaned = sanitizeContent(setContents || "");
        editor.commands.setContent(cleaned);
      }
    }, [setContents, editor]);

    React.useEffect(() => {
      if (editor && value !== undefined) {
        const cleaned = sanitizeContent(value || "");
        const currentContent = editor.getHTML();
        if (currentContent !== cleaned) {
          editor.commands.setContent(cleaned);
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
          {/* <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
            title="Bullet List"
          >
            <UnorderedListOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
            title="Numbered List"
          >
            <OrderedListOutlined />
          </button> */}
          <div className="toolbar-separator" />
          {/* <button
            type="button"
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={editor.isActive("link") ? "is-active" : ""}
            title="Insert Link"
          >
            <LinkOutlined />
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("Enter image URL:");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            title="Insert Image"
          >
            <PictureOutlined />
          </button> */}
          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            title="Хүснэгт оруулах"
          >
            <TableOutlined />
          </button>
          {customButtons.length > 0 && <div className="toolbar-separator" />}
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
                        // Insert template variable like <ovog> as plain text
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
                        // Ensure value is plain text, not HTML encoded
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

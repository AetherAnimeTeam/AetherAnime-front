import React, { useEffect, useRef, useState } from 'react';
import styles from './CommentField.module.css';

const CommentField = () => {
  const [content, setContent] = useState('');
  const editableRef = useRef(null);

  const allowedTags = ['b', 'i', 'u', 's', 'span', 'br'];

  const sanitizeHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const sanitizeNode = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE && !allowedTags.includes(node.tagName.toLowerCase())) {
        const textNode = document.createTextNode(node.textContent || '');
        node.parentNode.replaceChild(textNode, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(sanitizeNode);
      }
    };
    Array.from(div.childNodes).forEach(sanitizeNode);
    return div.innerHTML.trim(); // Ensure no whitespace-only content
  };

  // Set caret position to the end
  const setCaretToEnd = () => {
    const el = editableRef.current;
    if (!el) return;
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false); // Move caret to the end
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Handle input changes
  const handleInput = () => {
    const currentContent = editableRef.current.innerHTML;
    const sanitizedContent = sanitizeHtml(currentContent);
    setContent(sanitizedContent);

    if (!sanitizedContent) {
      editableRef.current.innerHTML = '<br>';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        console.log(content)
      e.preventDefault();
      document.execCommand('insertHTML', true, '<br>'); // Insert a new line
    }
  };

  useEffect(() => {
    setCaretToEnd();
  }, [content]);

  return (
    <div className={styles.commentFieldContainer}>
      <div className={styles.buttonContainer}>
        <button onClick={() => document.execCommand('bold')} className={styles.bold}>
          Bold
        </button>
        <button onClick={() => document.execCommand('italic')} className={styles.italic}>
          Italic
        </button>
        <button onClick={() => document.execCommand('underline')} className={styles.underline}>
          Underline
        </button>
        <button onClick={() => document.execCommand('strikeThrough')} className={styles.strikethrough}>
          Cross Over
        </button>
        <button
          onClick={() => document.execCommand('insertHTML', false, '<span class="spoiler">spoiler</span>')}
          className={styles.spoiler}
        >
          Spoiler
        </button>
      </div>
      <div
        ref={editableRef}
        id="editableDiv"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={styles.editable}
        dangerouslySetInnerHTML={{ __html: content || '<br>' }}
      ></div>
    </div>
  );
};

export default CommentField;

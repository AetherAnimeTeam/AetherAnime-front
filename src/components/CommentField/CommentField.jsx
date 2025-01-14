import React, {useRef, useState} from 'react';
import styles from './CommentField.module.css';

const CommentField = () => {
  const [content, setContent] = useState('Напишите свой комментарй здесь!');
  const textField = useRef(null);

    const handleInput = (e) => {
        const dangerousHtml = e?.current ? e.current.innerHTML : e.target.innerHTML
        const html = sanitizeHTML(dangerousHtml);
        setContent(html);
    };

  const applyStyle = (tagName, className) => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const wrapper = document.createElement(tagName);
      if (className) wrapper.className = className;
      range.surroundContents(wrapper);
      // sel.selectNodeContents(wrapper);
      sel.collapseToEnd();
      handleInput(textField); // Update content
    }
  };

  const sanitizeHTML = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const allowedTags = ['B', 'I', 'U', 'DEL', 'SPAN'];
    const nodes = temp.childNodes;

    nodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && !allowedTags.includes(node.tagName)) {
        const text = node.textContent;
        node.replaceWith(text);
      }
      if (node.childNodes.length) {
        sanitizeHTML(node.innerHTML);
      }
    });
    return temp.innerHTML;
  };

    return (
        <div className={styles.editorContainer}>
            <div className={styles.inputField}
                ref={textField}
                 contentEditable="true"
                 suppressContentEditableWarning={true}
                 onInput={handleInput}
                 dangerouslySetInnerHTML={{ __html: content }}
            />
            <div>
                <button onClick={() => applyStyle('b')}>Bold</button>
                <button onClick={() => applyStyle('i')}>Italic</button>
                <button onClick={() => applyStyle('u')}>Underline</button>
                <button onClick={() => applyStyle('del')}>Crossed Out</button>
                <button onClick={() => applyStyle('span', 'spoiler')}>Spoiler</button>
            </div>
        </div>
    );
};

export default CommentField;
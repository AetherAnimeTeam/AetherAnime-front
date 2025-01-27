import React, {useRef} from "react";
import DOMPurify from "dompurify";
import classes from "./CommentField.module.css";
import {ReactComponent as BoldIcon} from "../../assets/icons/bold.svg";
import {ReactComponent as ItalicIcon} from "../../assets/icons/italic.svg";
import {ReactComponent as StrokeIcon} from "../../assets/icons/stroke.svg";
import {ReactComponent as UnderlineIcon} from "../../assets/icons/underline.svg";
import Button from "../UI/Button/Button";
import {useCookies} from "react-cookie";

const ALLOWED_TAGS = ["b", "strong", "i", "em", "s", "u", "span", "br", "p", "div"];
const ALLOWED_ATTRS = ["class"];

export default function CommentField({ sendComment }) {
    const editorRef = useRef(null);

    const sanitizeHtml = (dirtyHtml) => {
        return DOMPurify.sanitize(dirtyHtml, {
            ALLOWED_TAGS,
            ALLOWED_ATTRS
        });
    };

    const saveSelection = () => {
        const sel = document.getSelection();
        return sel && sel.rangeCount ? sel.getRangeAt(0) : null;
    };

    const restoreSelection = (range) => {
        if (!range) return;
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const applyFormat = (tag) => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = saveSelection();
        if (!range || range.collapsed) return;

        const newNode = document.createElement(tag === "spoiler" ? "span" : tag);
        if (tag === "spoiler") {
            newNode.classList.add(classes.spoiler);
        }

        try {
            range.surroundContents(newNode);

            editorRef.current.innerHTML = sanitizeHtml(editorRef.current.innerHTML);
            restoreSelection(range);

        } catch (error) {
            console.error("Не удалось обернуть содержимое:", error);
        }
    };

    const handleInput = (e) => {
        const range = saveSelection();
        const cleanHtml = sanitizeHtml(e.currentTarget.innerHTML);

        if (cleanHtml !== e.currentTarget.innerHTML) e.currentTarget.innerHTML = cleanHtml;

        restoreSelection(range);
    };

    return (
        <div className={classes.commentFieldContainer}>
            <div className={classes.stylesContainer}>
                <BoldIcon onClick={() => applyFormat("b")} className={classes.styleIcon}/>
                <ItalicIcon onClick={() => applyFormat("i")} className={classes.styleIcon}/>
                <StrokeIcon onClick={() => applyFormat("s")} className={classes.styleIcon}/>
                <UnderlineIcon onClick={() => applyFormat("u")} className={classes.styleIcon}/>
                <p onClick={() => applyFormat("spoiler")} className={classes.spoilerIcon}>Spoiler</p>
            </div>

            <div
                ref={editorRef}
                contentEditable
                className={classes.editable}
                onInput={handleInput}
            />

            <Button text="Добавить" onClick={() => {sendComment(editorRef.current.innerHTML);
                editorRef.current.innerHTML = ""}}/>
        </div>
    );
}

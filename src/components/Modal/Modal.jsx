import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { Minus } from "lucide-react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 150,
                damping: 10,
                mass: 0.5
              }
            }}
            exit={{ 
              scale: 0.7,
              opacity: 0,
              y: 50,
              transition: { 
                duration: 0.15,
                ease: "easeIn" 
              }
            }}
          >
            <div className="modal-header">
              {title && (
                <motion.h3
                  className="modal-title"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ 
                    x: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.15,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }
                  }}
                  exit={{ 
                    x: -20,
                    opacity: 0,
                    transition: { duration: 0.1 }
                  }}
                >
                  {title}
                </motion.h3>
              )}
              <motion.button 
                className="modal-close" 
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Minus size={20} />
              </motion.button>
            </div>
            <motion.div
              className="modal-body"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.25,
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              exit={{ 
                opacity: 0,
                y: 10,
                transition: { duration: 0.15 }
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root')
  );
};

export default Modal;
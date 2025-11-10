import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

const DropdownMenu = ({ anchorRef, onClose, children }) => {
  const menuRef = useRef(null);
  const [styles, setStyles] = useState({});

  useEffect(() => {
    if (anchorRef.current && menuRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuHeight = 100; // approximate or measure

      const spaceBelow = window.innerHeight - anchorRect.bottom;
      const openUp = spaceBelow < menuHeight;

      setStyles({
        position: "absolute",
        top: openUp
          ? anchorRect.top - menuHeight - 8
          : anchorRect.bottom + 8,
        left: anchorRect.left,
        zIndex: 1000,
      });
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorRef]);

  return createPortal(
    <div
      ref={menuRef}
      style={styles}
      className="bg-white border rounded-md shadow-lg p-2 w-40"
    >
      {children}
    </div>,
    document.body
  );
};

export default DropdownMenu;

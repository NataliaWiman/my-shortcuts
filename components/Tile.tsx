import React from "react";
import Icon from "./icons/Icon";

const Tile = ({
  title,
  isAddNew,
  favicon,
}: {
  title: string;
  isAddNew?: boolean;
  favicon?: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 w-28 h-28 py-4 text-center rounded-md group-hover:bg-neutral-800/5 hover:bg-neutral-800/5 transition">
      {isAddNew ? (
        <div className="flex justify-center items-center min-w-12 min-h-12 max-w-12 max-h-12 rounded-full bg-neutral-200/75">
          <Icon name="plus" />
        </div>
      ) : (
        <div className="flex justify-center items-center min-w-12 min-h-12 max-w-12 max-h-12 rounded-full bg-neutral-200">
          {favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={favicon} alt={`${title} favicon`} className="w-7 h-7" />
          )}
        </div>
      )}

      <span className="font-medium text-sm">{title}</span>
    </div>
  );
};

export default Tile;

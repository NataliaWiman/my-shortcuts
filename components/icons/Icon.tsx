import React from "react";
import SearchIcon from "./SearchIcon";
import GoogleIcon from "./GoogleIcon";
import PlusIcon from "./PlusIcon";
import CrossIcon from "./CrossIcon";
import MenuIcon from "./MenuIcon";

const icons = {
  search: SearchIcon,
  google: GoogleIcon,
  plus: PlusIcon,
  close: CrossIcon,
  menu: MenuIcon,
};

const Icon = (props: { name: keyof typeof icons; className?: string }) => {
  const SelectedIcon = icons[props.name];
  if (!SelectedIcon) return null;

  return <SelectedIcon className={props.className || "text-inherit"} />;
};

export default Icon;

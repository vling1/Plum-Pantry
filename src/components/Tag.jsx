import { Button } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import Children from "react";
import icons from "./../icon-data.js";

const existingColors = [
  "blue",
  "blue-dim",
  "red",
  "red-dim",
  "yellow",
  "yellow-dim",
  "green",
  "green-dim",
  "white",
  "white-dim",
];

export default function Tag({
  children,
  color = "blue",
  icon = "xMark",
  tagOnClick = null,
  iconOnClick = null,
  className = "",
}) {
  // Check for a valid color
  if (existingColors.includes(color)) color = "tag-" + color;
  else color = "tag-blue";
  // Check for a valid icon
  if (!icons[icon]) icon = "none";
  return (
    <div
      className={
        "d-flex align-items-center justify-content-between gap-1 tag " +
        color +
        " " +
        className
      }
      onMouseDown={tagOnClick}
    >
      <span>{children}</span>
      {icon == "none" ? null : (
        <Button
          variant=""
          className={"tag__icon-wrapper"}
          onClick={iconOnClick}
        >
          <ReactSVG src={icons[icon]} className="tag__icon" />
        </Button>
      )}
    </div>
  );
}

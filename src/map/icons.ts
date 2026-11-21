// Map markers from the design, drawn at runtime: Polar night (--color-primary)
// with a white outline. The sprite's icons are black and not SDF, so they
// can't be recoloured.
export const ICON_PIXEL_RATIO = 2;

const FILL = "#0B2545";
const OUTLINE_COLOR = "#FFFFFF";
const OUTLINE = 1.5;

type Draw = (context: CanvasRenderingContext2D) => void;

interface IconSpec {
  width: number;
  height: number;
  draw: Draw;
}

const inset = OUTLINE / 2;

// Summit: an upward triangle.
const peak: IconSpec = {
  width: 14,
  height: 12,
  draw(context) {
    context.moveTo(7, inset);
    context.lineTo(14 - inset, 12 - inset);
    context.lineTo(inset, 12 - inset);
    context.closePath();
  },
};

// Trail signpost: one arrow board on a post.
const signpost: IconSpec = {
  width: 14,
  height: 15,
  draw(context) {
    context.moveTo(inset, 2);
    context.lineTo(10, 2);
    context.lineTo(14 - inset, 5);
    context.lineTo(10, 8);
    context.lineTo(6.75, 8);
    context.lineTo(6.75, 15 - inset);
    context.lineTo(4.25, 15 - inset);
    context.lineTo(4.25, 8);
    context.lineTo(inset, 8);
    context.closePath();
  },
};

export const MAP_ICONS: Record<string, IconSpec> = { peak, signpost };

export function createIcon({ width, height, draw }: IconSpec): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = width * ICON_PIXEL_RATIO;
  canvas.height = height * ICON_PIXEL_RATIO;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is not available.");

  context.scale(ICON_PIXEL_RATIO, ICON_PIXEL_RATIO);
  context.beginPath();
  draw(context);
  context.fillStyle = FILL;
  context.fill();
  context.lineWidth = OUTLINE;
  context.lineJoin = "round";
  context.strokeStyle = OUTLINE_COLOR;
  context.stroke();

  return context.getImageData(0, 0, canvas.width, canvas.height);
}

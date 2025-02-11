import * as opentype from "opentype.js";

export interface ValidationRule {
  check: (glyph: opentype.Glyph) => boolean;
  fix?: (glyph: opentype.Glyph) => opentype.Glyph | null;
  severity: "error" | "warning";
}

export interface FontMetrics {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  ascender: number;
  descender: number;
  unitsPerEm: number;
}

export class GlyphValidationService {
  private rules: Map<string, ValidationRule>;
  private metrics: FontMetrics | null = null;
  private defaults = {
    unitsPerEm: 1000,
  };

  constructor(metrics?: FontMetrics) {
    this.metrics = metrics || null;
    this.rules = new Map();
    this.initializeRules();
  }

  public getValidationRules(): Map<string, ValidationRule> {
    return this.rules;
  }

  public addValidationRule(rule: ValidationRule, name: string): void {
    this.rules.set(name, rule);
  }

  private initializeRules(): void {

    if(this.metrics === null) {
      return;
    }

    this.rules.set("hasValidPath", {
      check: (glyph: opentype.Glyph) => glyph.path instanceof opentype.Path,
      severity: "error",
    });

    this.rules.set("hasValidMetrics", {
      check: (glyph: opentype.Glyph) => {
        return (
          typeof glyph.xMin === "number" &&
          typeof glyph.xMax === "number" &&
          typeof glyph.yMin === "number" &&
          typeof glyph.yMax === "number"
        );
      },
      severity: "error",
    });

    this.rules.set("validPathCommands", {
      check: (glyph: opentype.Glyph) => {
        return glyph.path.commands.every(
          (cmd) =>
            ["M", "L", "C", "Q", "Z"].includes(cmd.type) &&
            (!("x" in cmd) || isFinite(cmd.x)) &&
            (!("y" in cmd) || isFinite(cmd.y))
        );
      },
      fix: (glyph: opentype.Glyph) => {
        const newPath = new opentype.Path();
        let hasValidCommands = false;

        glyph.path.commands.forEach((cmd) => {
          if (
            ["M", "L", "C", "Q", "Z"].includes(cmd.type) &&
            (!("x" in cmd) || isFinite(cmd.x)) &&
            (!("y" in cmd) || isFinite(cmd.y))
          ) {
            newPath.commands.push(cmd);
            hasValidCommands = true;
          }
        });

        if (hasValidCommands) {
          glyph.path = newPath;
          return glyph;
        }
        return null;
      },
      severity: "error",
    });

    // Unicode validation
    this.rules.set("validUnicode", {
      check: (glyph: opentype.Glyph) => {
        return (
          glyph.unicode === undefined ||
          (glyph.unicode >= 0 && glyph.unicode <= 0x10ffff)
        );
      },
      severity: "warning",
    });

    this.rules.set("validContourDirection", {
      check: (glyph: opentype.Glyph) => {
        let area = 0;
        const commands = glyph.path.commands;
        for (let i = 0; i < commands.length; i++) {
          const cmd = commands[i];
          const nextCmd = commands[(i + 1) % commands.length];
          if (cmd.type !== "Z" && nextCmd.type !== "Z") {
            area += (nextCmd.x - cmd.x) * (nextCmd.y + cmd.y);
          }
        }
        return area !== 0; // Non-zero area means valid contour
      },
      severity: "warning",
    });

    // Advance width validation
    this.rules.set("validAdvanceWidth", {
      check: (glyph: opentype.Glyph) => {
        return (
          typeof glyph.advanceWidth === "number" &&
          glyph.advanceWidth >= 0 &&
          glyph.advanceWidth <
            ((this.metrics?.unitsPerEm ?? this.defaults.unitsPerEm) * 5 || 5000)
        );
      },
      fix: (glyph: opentype.Glyph) => {
        if (!glyph.advanceWidth || glyph.advanceWidth < 0) {
          glyph.advanceWidth = this.metrics?.unitsPerEm || 1000;
          return glyph;
        }
        if (
          glyph.advanceWidth >=
          ((this.metrics?.unitsPerEm ?? this.defaults.unitsPerEm) * 5 || 5000)
        ) {
          glyph.advanceWidth = this.metrics?.unitsPerEm || 1000;
          return glyph;
        }
        return null;
      },
      severity: "warning",
    });

    // Boundary validations
    this.rules.set("reasonableBoundaries", {
      check: (glyph: opentype.Glyph) => {
        const maxSize =
          (this.metrics?.unitsPerEm ?? this.defaults.unitsPerEm) * 4 || 5000;
        return (
          glyph.xMax !== undefined &&
          glyph.xMin !== undefined &&
          Math.abs(glyph.xMax - glyph.xMin) < maxSize &&
          glyph.yMax !== undefined &&
          glyph.yMin !== undefined &&
          Math.abs(glyph.yMax - glyph.yMin) < maxSize
        );
      },
      fix: (glyph: opentype.Glyph) => {
        const maxSize =
          (this.metrics?.unitsPerEm ?? this.defaults.unitsPerEm) * 4 || 5000;

        if (
          glyph.xMax !== undefined &&
          glyph.xMin !== undefined &&
          Math.abs(glyph.xMax - glyph.xMin) < maxSize &&
          glyph.yMax !== undefined &&
          glyph.yMin !== undefined &&
          Math.abs(glyph.yMax - glyph.yMin) < maxSize
        ) {
          const scale =
            maxSize /
            Math.max(
              Math.abs(glyph.xMax - glyph.xMin),
              Math.abs(glyph.yMax - glyph.yMin)
            );

          const newPath = new opentype.Path();

          glyph.path.commands.forEach((cmd) => {
            const scaledCmd = { ...cmd };
            // Scale all applicable coordinate properties if they exist
            if ("x" in scaledCmd) scaledCmd.x *= scale;
            if ("y" in scaledCmd) scaledCmd.y *= scale;
            if ("x1" in scaledCmd) scaledCmd.x1 *= scale;
            if ("y1" in scaledCmd) scaledCmd.y1 *= scale;
            if ("x2" in scaledCmd) scaledCmd.x2 *= scale;
            if ("y2" in scaledCmd) scaledCmd.y2 *= scale;

            newPath.commands.push(scaledCmd);
          });

          glyph.path = newPath;
          return glyph;
        }
        return null;
      },
      severity: "warning",
    });
  }


}
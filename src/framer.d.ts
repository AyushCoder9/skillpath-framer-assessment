declare module "framer" {
  export const ControlType: {
    Color: string;
    Boolean: string;
  };
  export function addPropertyControls(component: unknown, controls: unknown): void;
}

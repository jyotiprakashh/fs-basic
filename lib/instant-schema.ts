import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    objects: i.entity({
      name: i.string(),
      type: i.string(),
      position: i.any(),
      rotation: i.any(),
      scale: i.any(),
      image: i.any().optional(),
      parentId: i.any().optional(),
      cameraId: i.string().optional(),
      timestamp: i.number().optional(),
      x: i.number().optional(),
      y: i.number().optional(),
      z: i.number().optional(),
    }),
    lights: i.entity({
      name: i.string(),
      type: i.string(),
      color: i.string(),
      intensity: i.number(),
      position: i.any(),
      target: i.any(),
    }),
    joints: i.entity({
      name: i.string(),
      objectId: i.string(),
      currentAngle: i.number(),
      minAngle: i.number(),
      maxAngle: i.number(),
    }),
    camera: i.entity({
      fov: i.number(),
      aspect: i.number(),
      near: i.number(),
      far: i.number(),
      position: i.any(),
      target: i.any(),
    }),
    // Workflow entities
    workflows: i.entity({
      jobCardNo: i.string().indexed(),
      customer: i.string().optional(),
      part: i.string().indexed(),
      quantity: i.string(),
      machine: i.string().indexed(),
      material: i.string().optional(),
      drawingNo: i.string().optional(),
      useRobot: i.boolean(),
      robot: i.string().optional(),
      amr: i.string().optional(),
      shift: i.string().optional(),
      toolChangeRule: i.string().optional(),
      qcSampling: i.string().optional(),
      status: i.string().indexed(), // "pending", "active", "completed", "paused"
      produced: i.number().optional(),
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    robotInstructions: i.entity({
      instruction: i.string(),
      order: i.number().indexed(),
      createdAt: i.number(),
    }),
    teachingChecklists: i.entity({
      positionName: i.string(),
      purpose: i.string(),
      status: i.string(), // "not-taught" or "taught"
      order: i.number().indexed(),
      createdAt: i.number(),
    }),
  },
  links: {
    workflowInstructions: {
      forward: { on: "robotInstructions", has: "one", label: "workflow", onDelete: "cascade" },
      reverse: { on: "workflows", has: "many", label: "instructions" },
    },
    workflowChecklists: {
      forward: { on: "teachingChecklists", has: "one", label: "workflow", onDelete: "cascade" },
      reverse: { on: "workflows", has: "many", label: "checklists" },
    },
  },
  rooms: {
    live3d: {
      presence: i.entity({}),
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

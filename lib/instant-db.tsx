"use client";

import { init, id, InstaQLEntity } from "@instantdb/react";
import schema, { AppSchema } from "@/lib/instant-schema";

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID!;

interface ai_robot_configuration {
  id: number;
  robot_name: string;
  robot_type: string;
  model_number: string;
  manufacturer: string;
  ip_address: string,
  mac_address: string,
  firmware_version: string,
  ai_module_version: string,
  location: string,
  coordinates: any,
  extra_parts: any,
  status: string,
  last_maintenance: string,
  assigned_task: string,
  power_source: string,
  operating_temp_range: string,
  created_at: string,
  updated_at: string,
}

export { schema };

export type ObjectEntity = InstaQLEntity<AppSchema, "objects">;
export type LightEntity = InstaQLEntity<AppSchema, "lights">;
export type JointEntity = InstaQLEntity<AppSchema, "joints">;
export type CameraEntity = InstaQLEntity<AppSchema, "camera">;
export type WorkflowEntity = InstaQLEntity<AppSchema, "workflows">;
export type RobotInstructionEntity = InstaQLEntity<AppSchema, "robotInstructions">;
export type TeachingChecklistEntity = InstaQLEntity<AppSchema, "teachingChecklists">;

export const db = init({ appId: APP_ID, schema });
export const room = db.room("live3d");

// ============================================================================
// WORKFLOW CRUD OPERATIONS
// ============================================================================

export interface WorkflowFormData {
  jobCardNo: string;
  customer: string;
  part: string;
  quantity: string;
  machine: string;
  material: string;
  drawingNo: string;
  useRobot: boolean;
  robot: string;
  amr: string;
  shift: string;
  toolChangeRule: string;
  qcSampling: string;
  instructions: Array<{ instruction: string }>;
  checklists: Array<{ positionName: string; purpose: string; status: "not-taught" | "taught" }>;
}

/**
 * Create a new workflow with instructions and checklists
 */
export async function createWorkflow(data: WorkflowFormData) {
  const workflowId = id();
  const timestamp = Date.now();

  // Create workflow
  const workflowTx = db.tx.workflows[workflowId].create({
    jobCardNo: data.jobCardNo,
    customer: data.customer,
    part: data.part,
    quantity: data.quantity,
    machine: data.machine,
    material: data.material,
    drawingNo: data.drawingNo,
    useRobot: data.useRobot,
    robot: data.robot,
    amr: data.amr,
    shift: data.shift,
    toolChangeRule: data.toolChangeRule,
    qcSampling: data.qcSampling,
    status: "active",
    produced: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  // Create robot instructions
  const instructionTxs = data.instructions.map((inst, index) => {
    const instructionId = id();
    return db.tx.robotInstructions[instructionId]
      .create({
        instruction: inst.instruction,
        order: index,
        createdAt: timestamp,
      })
      .link({ workflow: workflowId });
  });

  // Create teaching checklists
  const checklistTxs = data.checklists.map((check, index) => {
    const checklistId = id();
    return db.tx.teachingChecklists[checklistId]
      .create({
        positionName: check.positionName,
        purpose: check.purpose,
        status: check.status,
        order: index,
        createdAt: timestamp,
      })
      .link({ workflow: workflowId });
  });

  // Execute all transactions
  await db.transact([workflowTx, ...instructionTxs, ...checklistTxs]);

  return workflowId;
}

/**
 * Get a single workflow by ID with all related data
 */
export function useWorkflow(workflowId: string) {
  return db.useQuery({
    workflows: {
      $: {
        where: {
          id: workflowId,
        },
      },
      instructions: {
        $: {
          order: {
            order: "asc",
          },
        },
      },
      checklists: {
        $: {
          order: {
            order: "asc",
          },
        },
      },
    },
  });
}

/**
 * Get all workflows with optional filters
 */
export function useWorkflows(filters?: {
  status?: string;
  machine?: string;
  limit?: number;
}) {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.machine) {
    where.machine = filters.machine;
  }

  return db.useQuery({
    workflows: {
      $: {
        where,
        limit: filters?.limit,
        order: {
          createdAt: "desc",
        },
      },
      instructions: {
        $: {
          order: {
            order: "asc",
          },
        },
      },
      checklists: {
        $: {
          order: {
            order: "asc",
          },
        },
      },
    },
  });
}

/**
 * Update workflow data
 */
export async function updateWorkflow(
  workflowId: string,
  updates: Partial<Omit<WorkflowFormData, "instructions" | "checklists">>
) {
  const timestamp = Date.now();

  await db.transact([
    db.tx.workflows[workflowId].update({
      ...updates,
      updatedAt: timestamp,
    }),
  ]);
}

/**
 * Update workflow status
 */
export async function updateWorkflowStatus(
  workflowId: string,
  status: "pending" | "active" | "completed" | "paused"
) {
  await db.transact([
    db.tx.workflows[workflowId].update({
      status,
      updatedAt: Date.now(),
    }),
  ]);
}

/**
 * Update produced count
 */
export async function updateWorkflowProduced(
  workflowId: string,
  produced: number
) {
  await db.transact([
    db.tx.workflows[workflowId].update({
      produced,
      updatedAt: Date.now(),
    }),
  ]);
}

/**
 * Delete a workflow (will cascade delete instructions and checklists)
 */
export async function deleteWorkflow(workflowId: string) {
  await db.transact([db.tx.workflows[workflowId].delete()]);
}

/**
 * Add a robot instruction to a workflow
 */
export async function addRobotInstruction(
  workflowId: string,
  instruction: string,
  order: number
) {
  const instructionId = id();
  await db.transact([
    db.tx.robotInstructions[instructionId]
      .create({
        instruction,
        order,
        createdAt: Date.now(),
      })
      .link({ workflow: workflowId }),
  ]);
}

/**
 * Update a robot instruction
 */
export async function updateRobotInstruction(
  instructionId: string,
  updates: { instruction?: string; order?: number }
) {
  await db.transact([db.tx.robotInstructions[instructionId].update(updates)]);
}

/**
 * Delete a robot instruction
 */
export async function deleteRobotInstruction(instructionId: string) {
  await db.transact([db.tx.robotInstructions[instructionId].delete()]);
}

/**
 * Add a teaching checklist item to a workflow
 */
export async function addTeachingChecklist(
  workflowId: string,
  positionName: string,
  purpose: string,
  status: "not-taught" | "taught",
  order: number
) {
  const checklistId = id();
  await db.transact([
    db.tx.teachingChecklists[checklistId]
      .create({
        positionName,
        purpose,
        status,
        order,
        createdAt: Date.now(),
      })
      .link({ workflow: workflowId }),
  ]);
}

/**
 * Update a teaching checklist item
 */
export async function updateTeachingChecklist(
  checklistId: string,
  updates: {
    positionName?: string;
    purpose?: string;
    status?: "not-taught" | "taught";
    order?: number;
  }
) {
  await db.transact([db.tx.teachingChecklists[checklistId].update(updates)]);
}

/**
 * Delete a teaching checklist item
 */
export async function deleteTeachingChecklist(checklistId: string) {
  await db.transact([db.tx.teachingChecklists[checklistId].delete()]);
}

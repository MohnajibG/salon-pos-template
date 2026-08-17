import { Schema, model, Document, Types } from "mongoose";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export interface IDayHours {
  isOpen: boolean;
  start?: string;
  end?: string;
}

export interface IScheduleException {
  _id: Types.ObjectId;
  date: Date;
  isOff: boolean;
  start?: string;
  end?: string;
  reason?: string;
}

export interface IEmployeeSchedule extends Document {
  employee: Types.ObjectId;
  weeklyHours: Record<DayOfWeek, IDayHours>;
  exceptions: IScheduleException[];
  createdAt: Date;
  updatedAt: Date;
}

const dayHoursSchema = new Schema<IDayHours>(
  {
    isOpen: { type: Boolean, required: true, default: true },
    start: { type: String },
    end: { type: String },
  },
  { _id: false },
);

const exceptionSchema = new Schema<IScheduleException>({
  date: { type: Date, required: true },
  isOff: { type: Boolean, required: true, default: true },
  start: { type: String },
  end: { type: String },
  reason: { type: String, trim: true },
});

const employeeScheduleSchema = new Schema<IEmployeeSchedule>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    weeklyHours: {
      monday: { type: dayHoursSchema, required: true },
      tuesday: { type: dayHoursSchema, required: true },
      wednesday: { type: dayHoursSchema, required: true },
      thursday: { type: dayHoursSchema, required: true },
      friday: { type: dayHoursSchema, required: true },
      saturday: { type: dayHoursSchema, required: true },
      sunday: { type: dayHoursSchema, required: true },
    },

    exceptions: { type: [exceptionSchema], default: [] },
  },
  { timestamps: true },
);

export default model<IEmployeeSchedule>(
  "EmployeeSchedule",
  employeeScheduleSchema,
);

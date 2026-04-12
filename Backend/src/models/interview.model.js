const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    intention: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    focus: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    _id: false,
  },
);

const interviewReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    resume: {
      type: String,
      trim: true,
    },
    selfDescription: {
      type: String,
      trim: true,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: { type: [questionSchema], default: [] },
    behavioralQuestions: { type: [questionSchema], default: [] },
    skillGaps: { type: [skillGapSchema], default: [] },
    preparationPlan: { type: [preparationPlanSchema], default: [] },
  },
  { timestamps: true },
);

interviewReportSchema.index({ user: 1, createdAt: -1 });
interviewReportSchema.index({ matchScore: -1 });

module.exports = mongoose.model("InterviewReport", interviewReportSchema);

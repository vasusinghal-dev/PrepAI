function reconstructQA(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 6) {
    if (
      arr[i] === "question" &&
      arr[i + 2] === "intention" &&
      arr[i + 4] === "answer"
    ) {
      result.push({
        question: arr[i + 1] || "",
        intention: arr[i + 3] || "",
        answer: arr[i + 5] || "",
      });
    }
  }

  return result;
}

function reconstructSkillGaps(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i += 4) {
    if (arr[i] === "skill" && arr[i + 2] === "severity") {
      result.push({
        skill: arr[i + 1],
        severity: ["low", "medium", "high"].includes(arr[i + 3])
          ? arr[i + 3]
          : "medium",
      });
    }
  }

  return result;
}

function reconstructPlan(arr) {
  const result = [];

  let current = null;
  let i = 0;

  while (i < arr.length) {
    const key = arr[i];

    if (key === "day") {
      // push previous block
      if (current) result.push(current);

      current = {
        day: Number(arr[i + 1]) || 1,
        focus: "",
        tasks: [],
      };

      i += 2;
    } else if (key === "focus" && current) {
      current.focus = arr[i + 1] || "";
      i += 2;
    } else if (key === "tasks" && current) {
      i += 1;

      // collect ALL tasks until next "day"
      while (i < arr.length && arr[i] !== "day") {
        current.tasks.push(arr[i]);
        i++;
      }
    } else {
      i++;
    }
  }

  // push last block
  if (current) result.push(current);

  return result;
}

function sanitizeReport(data) {
  return {
    title: data.title || "",
    matchScore: Number(data.matchScore) || 0,
    technicalQuestions: reconstructQA(data.technicalQuestions || []),
    behavioralQuestions: reconstructQA(data.behavioralQuestions || []),
    skillGaps: reconstructSkillGaps(data.skillGaps || []),
    preparationPlan: reconstructPlan(data.preparationPlan || []),
  };
}

function isEmptyReport(data) {
  return (
    !data.title?.length ||
    !data.technicalQuestions?.length ||
    !data.behavioralQuestions?.length ||
    !data.skillGaps?.length ||
    !data.preparationPlan?.length
  );
}

module.exports = { sanitizeReport, isEmptyReport };

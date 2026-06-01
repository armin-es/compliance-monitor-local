import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { analysisRequestSchema, type AnalysisRequestInput } from "@/lib/validations";

interface AnalysisFormProps {
  onSubmit: (data: AnalysisRequestInput) => void;
  isPending: boolean;
  editingValues?: AnalysisRequestInput | null;
  onCancelEdit?: () => void;
}

export function AnalysisForm({
  onSubmit,
  isPending,
  editingValues,
  onCancelEdit,
}: AnalysisFormProps) {
  const [action, setAction] = useState(editingValues?.action ?? "");
  const [guideline, setGuideline] = useState(editingValues?.guideline ?? "");
  const [errors, setErrors] = useState<{ action?: string; guideline?: string }>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = analysisRequestSchema.safeParse({
      action: action.trim(),
      guideline: guideline.trim(),
    });
    if (!result.success) {
      const fieldErrors: { action?: string; guideline?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as "action" | "guideline";
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(result.data);
  }

  const isEditing = !!editingValues;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEditing && (
        <div className="flex items-center justify-between rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
          <p className="text-sm font-medium text-amber-800">
            Editing existing entry. Resubmit to update the result.
          </p>
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-amber-600 hover:text-amber-800 underline"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="action" className="text-sm font-medium text-slate-700">
          Reported Action <span className="text-rose-500">*</span>
        </label>
        <Textarea
          id="action"
          data-testid="action-input"
          value={action}
          onChange={(e) => { setAction(e.target.value); setErrors((p) => ({ ...p, action: undefined })); }}
          placeholder="e.g. Operator skipped torque check at Station 3"
          rows={3}
          disabled={isPending}
          className={cn("resize-none text-sm", errors.action && "border-rose-400")}
        />
        {errors.action && (
          <p className="text-xs text-rose-500">{errors.action}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="guideline" className="text-sm font-medium text-slate-700">
          Process Standard
          <span className="ml-1.5 text-xs font-normal text-slate-400">
            (leave blank if no standard applies)
          </span>
        </label>
        <Textarea
          id="guideline"
          data-testid="guideline-input"
          value={guideline}
          onChange={(e) => { setGuideline(e.target.value); setErrors((p) => ({ ...p, guideline: undefined })); }}
          placeholder="e.g. All torque checks must be completed before assembly proceeds"
          rows={3}
          disabled={isPending}
          className={cn("resize-none text-sm", errors.guideline && "border-rose-400")}
        />
        {errors.guideline && (
          <p className="text-xs text-rose-500">{errors.guideline}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
        data-testid="submit-button"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : isEditing ? (
          <>
            <RotateCcw className="mr-2 h-4 w-4" />
            Resubmit for Analysis
          </>
        ) : (
          "Run Compliance Check"
        )}
      </Button>
    </form>
  );
}

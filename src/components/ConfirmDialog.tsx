import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "./ui/button";
import { ReactNode } from "react";

interface ConfirmDialogProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonProps["variant"];
  children?: ReactNode;
  trigger?: ReactNode;
}

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  children,
  trigger,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            variant={confirmVariant}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      {children}
    </AlertDialog>
  );
}

// Simple hook-based version
interface UseConfirmDialogProps {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: UseConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [resolve, setResolve] = React.useState<(value: boolean) => void>();

  const confirm = async (): Promise<boolean> => {
    setOpen(true);
    return new Promise((res) => {
      setResolve(() => res);
    });
  };

  const DialogComponent = () => (
    <AlertDialog open={open} onOpenChange={(o) => {
      setOpen(o);
      if (!o) resolve?.(false);
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setOpen(false);
            resolve?.(false);
          }}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpen(false);
              resolve?.(true);
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    confirm,
    Dialog: DialogComponent,
  };
}

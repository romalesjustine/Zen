"use client";

import { Id, ToastOptions, UpdateOptions, toast } from "react-toastify";

const baseToastOptions = {
  autoClose: 2500,
  closeButton: true,
};

export const showSuccessToast = (
  message: string,
  options?: ToastOptions
): Id => {
  return toast.success(message, { ...baseToastOptions, ...options });
};

export const showErrorToast = (
  message: string,
  options?: ToastOptions
): Id => {
  return toast.error(message, { ...baseToastOptions, ...options });
};

export const showInfoToast = (
  message: string,
  options?: ToastOptions
): Id => {
  return toast.info(message, { ...baseToastOptions, ...options });
};

type ToastLifecycleMessages = {
  loading: string;
  success: string;
  error: string;
};

type ToastLifecycleOptions = {
  toastId?: Id;
  loadingOptions?: ToastOptions;
  successOptions?: UpdateOptions;
  errorOptions?: UpdateOptions;
};

export async function runWithToast<T>(
  action: () => Promise<T>,
  messages: ToastLifecycleMessages,
  options?: ToastLifecycleOptions
): Promise<T> {
  const { toastId, loadingOptions, successOptions, errorOptions } =
    options ?? {};

  const id = toast.loading(messages.loading, {
    ...baseToastOptions,
    ...loadingOptions,
    toastId,
  });

  try {
    const result = await action();
    toast.update(id, {
      render: messages.success,
      type: "success",
      isLoading: false,
      ...baseToastOptions,
      ...successOptions,
    });
    return result;
  } catch (error) {
    toast.update(id, {
      render: messages.error,
      type: "error",
      isLoading: false,
      ...baseToastOptions,
      ...errorOptions,
    });
    throw error;
  }
}

export const dismissToast = (id?: Id) => toast.dismiss(id);

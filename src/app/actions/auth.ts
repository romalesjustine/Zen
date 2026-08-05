"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  username: string
) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Failed to create user" };
  }

  try {
    await prisma.profile.create({
      data: {
        id: authData.user.id,
        email,
        username,
        full_name: fullName,
        avatar_url: "",
      },
    });
  } catch (dbError) {
    if (
      dbError &&
      typeof dbError === "object" &&
      "code" in dbError &&
      dbError.code === "P2002"
    ) {
      return { error: "Username or email already exists" };
    }
    return { error: "Failed to create profile" };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      username: true,
      email: true,
      full_name: true,
      avatar_url: true,
    },
  });

  return profile;
}

export async function forgotPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resetPassword(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function updateProfile(data: {
  username?: string;
  email?: string;
  password?: string;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "User not authenticated" };
  }

  try {
    // Update email in auth if provided
    if (data.email && data.email !== user.email) {
      const { error: authError } = await supabase.auth.updateUser({
        email: data.email,
      });
      if (authError) {
        return { error: authError.message };
      }
    }

    // Update password in auth if provided
    if (data.password) {
      const { error: authError } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (authError) {
        return { error: authError.message };
      }
    }

    // Update profile in database
    const updateData: { username?: string; email?: string } = {};
    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;

    if (Object.keys(updateData).length > 0) {
      await prisma.profile.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { error: "Username or email already exists" };
    }
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function uploadProfilePicture(formData: FormData) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { error: "User not authenticated" };
  }

  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return { error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { error: "Please upload an image file" };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { error: "File size must be less than 5MB" };
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${timestamp}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Failed to upload image" };
    }

    // Get public URL
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    // Update profile with avatar URL
    await prisma.profile.update({
      where: { id: user.id },
      data: { avatar_url: publicUrl },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return { error: "Failed to upload profile picture" };
  }
}

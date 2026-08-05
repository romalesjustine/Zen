import { prisma } from "@/lib/prisma";
import React from "react";
import Notes from "./notes";
import { redirect } from "next/navigation";

const NotesPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const note = await prisma.note.findUnique({
    where: {
      id: (await params).id,
    },
  });

  if (!note) redirect("/dashboard");

  return (
    <>
      <Notes note={note} />
    </>
  );
};

export default NotesPage;

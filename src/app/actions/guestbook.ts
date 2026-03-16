"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function addGuestbookEntry(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    throw new Error("You must be logged in to sign the guestbook.");
  }

  const content = formData.get("content") as string;
  
  if (!content || content.trim() === "") {
    throw new Error("Message cannot be empty.");
  }

  try {
    await db.execute({
      sql: `
        INSERT INTO guestbook (user_email, user_name, user_image, content)
        VALUES (?, ?, ?, ?)
      `,
      args: [
        session.user.email,
        session.user.name || "Anonymous",
        session.user.image || "",
        content.trim()
      ]
    });
    
    // Revalidate the guestbook page so new entry appears immediately
    revalidatePath("/guestbook");
  } catch (error) {
    console.error("Failed to add guestbook entry", error);
    throw new Error("Failed to post message.");
  }
}

export async function getGuestbookEntries() {
  try {
    const result = await db.execute(`
      SELECT * FROM guestbook
      ORDER BY created_at DESC
      LIMIT 100
    `);
    
    return result.rows.map(row => ({
      id: row.id as number,
      name: row.user_name as string,
      email: row.user_email as string,
      image: row.user_image as string,
      content: row.content as string,
      createdAt: row.created_at as string,
    }));
  } catch (error) {
    console.error("Failed to fetch guestbook entries", error);
    return [];
  }
}

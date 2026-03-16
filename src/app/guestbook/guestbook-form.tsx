"use client";

import { useRef, useState } from "react";
import { addGuestbookEntry } from "@/app/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function GuestbookForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  async function action(formData: FormData) {
    setIsPending(true);
    try {
      await addGuestbookEntry(formData);
      formRef.current?.reset();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-4 max-w-2xl mt-4">
      <Textarea 
        name="content"
        placeholder="이곳에 자유롭게 메시지를 남겨주세요..."
        className="min-h-[100px] resize-y"
        required
        disabled={isPending}
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending}
        >
          {isPending ? "등록 중..." : "방명록 남기기"}
        </Button>
      </div>
    </form>
  );
}

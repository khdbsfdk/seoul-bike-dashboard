import { getGuestbookEntries } from "@/app/actions/guestbook";
import { GuestbookForm } from "./guestbook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";

// Force dynamic rendering so caching doesn't stale the guestbook too heavily
export const dynamic = 'force-dynamic';

export default async function GuestbookPage() {
  const entries = await getGuestbookEntries();

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">방명록</h1>
        <p className="text-muted-foreground mt-2">
          따릉이 대시보드에 방문하신 분들과 자유롭게 인사와 소통을 나눠보세요!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>메시지 남기기</CardTitle>
          <CardDescription>구글 프로필 사용자 이름으로 방명록이 등록됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <GuestbookForm />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">최근 방문자 메시지</h2>
        
        {entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg">
            아직 등록된 방명록이 없습니다. 첫 번째 메시지를 남겨주세요!
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    {entry.image ? (
                      <Image 
                        src={entry.image} 
                        alt={entry.name} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {entry.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{entry.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true, locale: ko })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

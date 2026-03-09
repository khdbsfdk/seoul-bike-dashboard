"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Map as MapIcon } from "lucide-react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-md flex items-center justify-center text-muted-foreground"><MapIcon className="animate-bounce" />지도 불러오는 중...</div>
});

interface BikeStation {
  rackTotCnt: string;
  stationName: string;
  parkingBikeTotCnt: string;
  shared: string;
  stationLatitude: string;
  stationLongitude: string;
  stationId: string;
}

export default function DashboardPage() {
  const [stations, setStations] = useState<BikeStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_SEOUL_BIKE_API_KEY;
        if (!apiKey) {
          throw new Error("API 키가 설정되지 않았습니다.");
        }

        const res = await fetch(
          `http://openapi.seoul.go.kr:8088/${apiKey}/json/bikeList/1/1000/`
        );
        
        if (!res.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }

        const data = await res.json();

        // API might return an error structure if key is invalid, e.g. data.RESULT.CODE
        if (data?.RESULT?.CODE && data.RESULT.CODE !== "INFO-000") {
          throw new Error(data.RESULT.MESSAGE || "API 호출 오류가 발생했습니다.");
        }

        if (!data?.rentBikeStatus?.row) {
          throw new Error("응답 데이터 형식이 올바르지 않습니다.");
        }

        setStations(data.rentBikeStatus.row);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("데이터를 불러올 수 없습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredStations = stations.filter((station) =>
    station.stationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">서울시 공공자전거 실시간 현황</CardTitle>
          <CardDescription>
            따릉이 대여소별 실시간 자전거 거치 현황을 확인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full">
            <MapComponent stations={filteredStations} searchQuery={searchQuery} />
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="대여소 이름 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {error ? (
            <div className="text-center p-8 bg-destructive/10 text-destructive rounded-md border border-destructive/20 font-medium">
              {error}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>대여소 이름</TableHead>
                    <TableHead className="text-right">거치대 수</TableHead>
                    <TableHead className="text-right">남은 자전거</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-[50px] ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-[50px] ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredStations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStations.map((station, index) => {
                      // Extract number part if it exists e.g "102. 망원역 1번출구 앞" -> "102. 망원역 1번출구 앞"
                      // Just display the station name as returned by API
                      const isEmpty = station.parkingBikeTotCnt === "0";

                      return (
                        <TableRow key={`${station.stationId}-${index}`}>
                          <TableCell className="font-medium">
                            {station.stationName}
                          </TableCell>
                          <TableCell className="text-right">
                            {station.rackTotCnt}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${isEmpty ? 'text-red-500' : 'text-green-600'}`}>
                            {isEmpty ? '대여 불가' : `${station.parkingBikeTotCnt} 대`}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

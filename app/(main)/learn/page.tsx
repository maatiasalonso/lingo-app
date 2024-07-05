import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";

export default function LearnPage() {
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>LearnPage</StickyWrapper>
      <FeedWrapper>FeedWrapper</FeedWrapper>
    </div>
  );
}
